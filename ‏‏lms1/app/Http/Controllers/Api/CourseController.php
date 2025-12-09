<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\StudentCourse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class CourseController extends Controller
{
    // قائمة جميع الكورسات
    public function index()
    {
        $courses = Course::with(['instructor', 'lessons', 'students'])->get();
        
        return response()->json([
            'data' => $courses,
        ]);
    }

    // إنشاء كورس جديد
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'image_url' => 'nullable|url',
            'level' => 'required|in:beginner,intermediate,advanced',
            'duration_hours' => 'nullable|integer',
            'price' => 'required|numeric|min:0',
            'what_you_will_learn' => 'nullable|string',
            'requirements' => 'nullable|string',
        ]);

        $validated['instructor_id'] = auth()->id();
        $course = Course::create($validated);

        return response()->json([
            'message' => 'تم إنشاء الكورس بنجاح',
            'data' => $course,
        ], Response::HTTP_CREATED);
    }

    // عرض كورس واحد
    public function show(Course $course)
    {
        $course->load(['instructor', 'lessons', 'quizzes.questions.answers', 'students']);
        
        return response()->json([
            'data' => $course,
        ]);
    }

    // تحديث الكورس
    public function update(Request $request, Course $course)
    {
        // التحقق من أن المستخدم هو مالك الكورس
        if ($course->instructor_id !== auth()->id()) {
            return response()->json([
                'message' => 'غير مسموح',
            ], Response::HTTP_FORBIDDEN);
        }

        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'image_url' => 'nullable|url',
            'level' => 'sometimes|in:beginner,intermediate,advanced',
            'duration_hours' => 'nullable|integer',
            'price' => 'sometimes|numeric|min:0',
            'status' => 'sometimes|in:active,archived',
            'what_you_will_learn' => 'nullable|string',
            'requirements' => 'nullable|string',
        ]);

        $course->update($validated);

        return response()->json([
            'message' => 'تم تحديث الكورس بنجاح',
            'data' => $course,
        ]);
    }

    // حذف الكورس
    public function destroy(Course $course)
    {
        if ($course->instructor_id !== auth()->id()) {
            return response()->json([
                'message' => 'غير مسموح',
            ], Response::HTTP_FORBIDDEN);
        }

        $course->delete();

        return response()->json([
            'message' => 'تم حذف الكورس بنجاح',
        ]);
    }

    // تسجيل الطالب في الكورس
    public function enroll(Request $request, Course $course)
    {
        $studentId = auth()->id();

        // التحقق من عدم التسجيل المكرر
        if (StudentCourse::where('student_id', $studentId)
                ->where('course_id', $course->id)
                ->exists()) {
            return response()->json([
                'message' => 'أنت مسجل بالفعل في هذا الكورس',
            ], Response::HTTP_BAD_REQUEST);
        }

        StudentCourse::create([
            'student_id' => $studentId,
            'course_id' => $course->id,
        ]);

        $course->increment('students_count');

        return response()->json([
            'message' => 'تم التسجيل في الكورس بنجاح',
        ], Response::HTTP_CREATED);
    }

    // الكورسات المسجل فيها الطالب
    public function myEnrolledCourses()
    {
        $courses = auth()->user()->enrolledCourses()->with(['instructor', 'lessons', 'quizzes'])->get();

        return response()->json([
            'data' => $courses,
        ]);
    }

    // كورسات المدرس
    public function myCreatedCourses()
    {
        $courses = auth()->user()->courses()->with(['lessons', 'students'])->get();

        return response()->json([
            'data' => $courses,
        ]);
    }

    // إحصائيات الطالب
    public function studentStats()
    {
        $user = auth()->user();
        $enrolledCourses = $user->enrolledCourses()->count();
        
        return response()->json([
            'data' => [
                'totalCourses' => $enrolledCourses,
                'completedLessons' => 0,
                'passedQuizzes' => 0,
                'averageScore' => 0,
            ]
        ]);
    }

    // إحصائيات المدرس
    public function instructorStats()
    {
        $user = auth()->user();
        $courses = $user->courses()->get();
        $totalStudents = 0;
        
        foreach ($courses as $course) {
            $totalStudents += $course->students_count ?? 0;
        }
        
        return response()->json([
            'data' => [
                'totalCourses' => $courses->count(),
                'totalStudents' => $totalStudents,
                'totalLessons' => 0,
                'averageRating' => 0,
            ]
        ]);
    }
}

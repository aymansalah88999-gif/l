<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Lesson;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class LessonController extends Controller
{
    // جميع الدروس
    public function index()
    {
        $lessons = Lesson::with(['course', 'quizzes'])->get();
        return response()->json(['data' => $lessons]);
    }

    // إنشاء درس
    public function store(Request $request)
    {
        $validated = $request->validate([
            'course_id' => 'required|exists:courses,id',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'content' => 'nullable|string',
            'video_url' => 'nullable|url',
            'order' => 'required|integer|min:0',
            'is_free' => 'boolean',
            'duration_minutes' => 'nullable|integer',
        ]);

        $lesson = Lesson::create($validated);

        return response()->json([
            'message' => 'تم إنشاء الدرس بنجاح',
            'data' => $lesson,
        ], Response::HTTP_CREATED);
    }

    // عرض درس
    public function show(Lesson $lesson)
    {
        $lesson->load(['course', 'quizzes.questions.answers']);
        return response()->json(['data' => $lesson]);
    }

    // تحديث الدرس
    public function update(Request $request, Lesson $lesson)
    {
        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'content' => 'nullable|string',
            'video_url' => 'nullable|url',
            'order' => 'sometimes|integer|min:0',
            'is_free' => 'sometimes|boolean',
            'duration_minutes' => 'nullable|integer',
        ]);

        $lesson->update($validated);

        return response()->json([
            'message' => 'تم تحديث الدرس بنجاح',
            'data' => $lesson,
        ]);
    }

    // حذف الدرس
    public function destroy(Lesson $lesson)
    {
        $lesson->delete();
        return response()->json(['message' => 'تم حذف الدرس بنجاح']);
    }

    // دروس الكورس
    public function courseLessons($courseId)
    {
        $lessons = Lesson::where('course_id', $courseId)
            ->with(['quizzes.questions.answers'])
            ->orderBy('order')
            ->get();

        return response()->json(['data' => $lessons]);
    }
}

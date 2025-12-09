<?php

namespace App\Http\Controllers\LMS;

use App\Http\Controllers\Controller;
use App\Models\LMS\Enrollment;
use App\Models\LMS\Course;
use Illuminate\Http\Request;

class EnrollmentController extends Controller
{
    public function enroll(Request $request, Course $course)
    {
        $user = auth()->user();
        if (!$user) return response()->json(['message'=>'Unauthenticated'], 401);

        $enrollment = Enrollment::firstOrCreate([
            'user_id' => $user->id,
            'course_id' => $course->id,
        ], [
            'enrolled_at' => now(),
        ]);

        return response()->json($enrollment, 201);
    }

    public function myEnrollments(Request $request)
    {
        $enrollments = auth()->user()->enrollments()->with('course')->get();
        return response()->json(['data'=>$enrollments]);
    }
}

<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\CourseController;
use App\Http\Controllers\Api\QuizController;
use App\Http\Controllers\Api\LessonController;
use App\Http\Controllers\Api\QuestionController;
use App\Http\Controllers\Api\UserController;

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::middleware('auth:sanctum')->group(function () {
    // الكورسات
    Route::get('courses', [CourseController::class, 'index']);
    Route::post('courses', [CourseController::class, 'store']);
    Route::get('courses/my-enrolled', [CourseController::class, 'myEnrolledCourses']);
    Route::get('courses/my-created', [CourseController::class, 'myCreatedCourses']);
    Route::get('courses/{course}', [CourseController::class, 'show']);
    Route::put('courses/{course}', [CourseController::class, 'update']);
    Route::delete('courses/{course}', [CourseController::class, 'destroy']);
    Route::post('courses/{course}/enroll', [CourseController::class, 'enroll']);

    // الدروس
    Route::get('lessons', [LessonController::class, 'index']);
    Route::post('lessons', [LessonController::class, 'store']);
    Route::get('lessons/{lesson}', [LessonController::class, 'show']);
    Route::put('lessons/{lesson}', [LessonController::class, 'update']);
    Route::delete('lessons/{lesson}', [LessonController::class, 'destroy']);
    Route::get('courses/{courseId}/lessons', [LessonController::class, 'courseLessons']);

    // الاختبارات
    Route::get('quizzes', [QuizController::class, 'index']);
    Route::post('quizzes', [QuizController::class, 'store']);
    Route::get('quizzes/{quiz}', [QuizController::class, 'show']);
    Route::put('quizzes/{quiz}', [QuizController::class, 'update']);
    Route::delete('quizzes/{quiz}', [QuizController::class, 'destroy']);
    Route::post('quizzes/{quiz}/start', [QuizController::class, 'startQuiz']);
    Route::post('quizzes/{quiz}/submit-answer', [QuizController::class, 'submitAnswer']);
    Route::post('quizzes/{quiz}/complete', [QuizController::class, 'completeQuiz']);
    Route::get('quizzes/{quiz}/results', [QuizController::class, 'getResults']);

    // الأسئلة
    Route::get('questions', [QuestionController::class, 'index']);
    Route::post('questions', [QuestionController::class, 'store']);
    Route::get('questions/{question}', [QuestionController::class, 'show']);
    Route::put('questions/{question}', [QuestionController::class, 'update']);
    Route::delete('questions/{question}', [QuestionController::class, 'destroy']);
    Route::get('quizzes/{quizId}/questions', [QuestionController::class, 'quizQuestions']);

    // الإحصائيات
    Route::get('student/stats', [CourseController::class, 'studentStats']);
    Route::get('instructor/stats', [CourseController::class, 'instructorStats']);
    Route::get('admin/stats', [UserController::class, 'adminStats']);

    // المستخدمين
    Route::get('users', [UserController::class, 'index']);
    Route::delete('users/{user}', [UserController::class, 'destroy']);
    
    // LMS API (modular)
    Route::prefix('lms')->group(function () {
        Route::apiResource('courses', \App\Http\Controllers\LMS\CourseController::class);
        Route::apiResource('courses.lectures', \App\Http\Controllers\LMS\LectureController::class)->shallow();
        Route::post('courses/{course}/enroll', [\App\Http\Controllers\LMS\EnrollmentController::class, 'enroll']);
        Route::get('my/enrollments', [\App\Http\Controllers\LMS\EnrollmentController::class, 'myEnrollments']);
        Route::post('quizzes/{quiz}/start', [\App\Http\Controllers\LMS\QuizController::class, 'take']);
        Route::post('attempts/{attempt}/submit', [\App\Http\Controllers\LMS\QuizController::class, 'submit']);
        Route::post('enrollments/{enrollment}/certificate', [\App\Http\Controllers\LMS\CertificateController::class, 'generate']);
        Route::get('certificates/{certificate}/download', [\App\Http\Controllers\LMS\CertificateController::class, 'download']);
    });

    // AI models listing and admin toggle
    Route::get('ai/models', [\App\Http\Controllers\Api\AIModelController::class, 'index']);
    Route::post('ai/models/{key}', [\App\Http\Controllers\Api\AIModelController::class, 'update']);
});

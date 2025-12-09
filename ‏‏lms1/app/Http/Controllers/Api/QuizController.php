<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Quiz;
use App\Models\QuizResult;
use App\Models\StudentAnswer;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class QuizController extends Controller
{
    // قائمة الاختبارات
    public function index()
    {
        $quizzes = Quiz::with(['questions.answers', 'results'])->get();
        return response()->json(['data' => $quizzes]);
    }

    // إنشاء اختبار
    public function store(Request $request)
    {
        $validated = $request->validate([
            'course_id' => 'required|exists:courses,id',
            'lesson_id' => 'nullable|exists:lessons,id',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'pass_percentage' => 'required|integer|min:0|max:100',
            'duration_minutes' => 'nullable|integer',
        ]);

        $quiz = Quiz::create($validated);

        return response()->json([
            'message' => 'تم إنشاء الاختبار بنجاح',
            'data' => $quiz,
        ], Response::HTTP_CREATED);
    }

    // عرض اختبار
    public function show(Quiz $quiz)
    {
        $quiz->load(['course', 'lesson', 'questions.answers']);
        return response()->json(['data' => $quiz]);
    }

    // تحديث الاختبار
    public function update(Request $request, Quiz $quiz)
    {
        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'pass_percentage' => 'sometimes|integer|min:0|max:100',
            'duration_minutes' => 'nullable|integer',
        ]);

        $quiz->update($validated);

        return response()->json([
            'message' => 'تم تحديث الاختبار بنجاح',
            'data' => $quiz,
        ]);
    }

    // حذف الاختبار
    public function destroy(Quiz $quiz)
    {
        $quiz->delete();
        return response()->json(['message' => 'تم حذف الاختبار بنجاح']);
    }

    // بدء الاختبار
    public function startQuiz(Quiz $quiz)
    {
        $studentId = auth()->id();

        // التحقق من وجود محاولة سابقة غير مكتملة
        $existingResult = QuizResult::where('student_id', $studentId)
            ->where('quiz_id', $quiz->id)
            ->whereNull('completed_at')
            ->first();

        if ($existingResult) {
            return response()->json([
                'data' => $existingResult->load('studentAnswers'),
            ]);
        }

        // إنشاء نتيجة جديدة
        $totalPoints = $quiz->questions()->sum('points');
        $result = QuizResult::create([
            'student_id' => $studentId,
            'quiz_id' => $quiz->id,
            'total_points' => $totalPoints,
            'started_at' => now(),
        ]);

        return response()->json([
            'data' => $result->load('quiz.questions.answers'),
        ], Response::HTTP_CREATED);
    }

    // إرسال إجابة
    public function submitAnswer(Request $request, Quiz $quiz)
    {
        $validated = $request->validate([
            'quiz_result_id' => 'required|exists:quiz_results,id',
            'question_id' => 'required|exists:questions,id',
            'answer_id' => 'nullable|exists:answers,id',
            'text_answer' => 'nullable|string',
        ]);

        $quizResult = QuizResult::find($validated['quiz_result_id']);
        $question = Quiz::find($quiz->id)->questions()->find($validated['question_id']);

        $isCorrect = false;
        $pointsEarned = 0;

        if ($validated['answer_id']) {
            $answer = $question->answers()->where('id', $validated['answer_id'])->first();
            if ($answer && $answer->is_correct) {
                $isCorrect = true;
                $pointsEarned = $question->points;
            }
        }

        StudentAnswer::create([
            'quiz_result_id' => $quizResult->id,
            'question_id' => $question->id,
            'answer_id' => $validated['answer_id'] ?? null,
            'text_answer' => $validated['text_answer'] ?? null,
            'is_correct' => $isCorrect,
            'points_earned' => $pointsEarned,
        ]);

        return response()->json(['message' => 'تم تسجيل الإجابة بنجاح']);
    }

    // إنهاء الاختبار
    public function completeQuiz(Request $request, Quiz $quiz)
    {
        $validated = $request->validate([
            'quiz_result_id' => 'required|exists:quiz_results,id',
        ]);

        $result = QuizResult::find($validated['quiz_result_id']);

        $earnedPoints = $result->studentAnswers()->sum('points_earned');
        $percentage = ($earnedPoints / $result->total_points) * 100;
        $passed = $percentage >= $quiz->pass_percentage;

        $result->update([
            'earned_points' => $earnedPoints,
            'percentage' => $percentage,
            'passed' => $passed,
            'completed_at' => now(),
        ]);

        return response()->json([
            'message' => 'تم إنهاء الاختبار',
            'data' => $result,
        ]);
    }

    // عرض نتائج الاختبار
    public function getResults(Quiz $quiz)
    {
        $results = $quiz->results()->with(['student', 'studentAnswers.question.answers'])->get();
        return response()->json(['data' => $results]);
    }
}

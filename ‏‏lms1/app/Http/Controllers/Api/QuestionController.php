<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Question;
use App\Models\Answer;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class QuestionController extends Controller
{
    // جميع الأسئلة
    public function index()
    {
        $questions = Question::with(['quiz', 'answers'])->get();
        return response()->json(['data' => $questions]);
    }

    // إنشاء سؤال
    public function store(Request $request)
    {
        $validated = $request->validate([
            'quiz_id' => 'required|exists:quizzes,id',
            'type' => 'required|in:multiple_choice,true_false,short_answer',
            'question_text' => 'required|string',
            'order' => 'required|integer|min:0',
            'points' => 'required|integer|min:1',
            'explanation' => 'nullable|string',
            'answers' => 'nullable|array',
            'answers.*.answer_text' => 'required|string',
            'answers.*.is_correct' => 'boolean',
        ]);

        $question = Question::create([
            'quiz_id' => $validated['quiz_id'],
            'type' => $validated['type'],
            'question_text' => $validated['question_text'],
            'order' => $validated['order'],
            'points' => $validated['points'],
            'explanation' => $validated['explanation'] ?? null,
        ]);

        // إضافة الإجابات
        if (isset($validated['answers'])) {
            foreach ($validated['answers'] as $index => $answerData) {
                Answer::create([
                    'question_id' => $question->id,
                    'answer_text' => $answerData['answer_text'],
                    'is_correct' => $answerData['is_correct'] ?? false,
                    'order' => $index,
                ]);
            }
        }

        $question->load('answers');

        return response()->json([
            'message' => 'تم إنشاء السؤال بنجاح',
            'data' => $question,
        ], Response::HTTP_CREATED);
    }

    // عرض سؤال
    public function show(Question $question)
    {
        $question->load(['quiz', 'answers']);
        return response()->json(['data' => $question]);
    }

    // تحديث السؤال
    public function update(Request $request, Question $question)
    {
        $validated = $request->validate([
            'type' => 'sometimes|in:multiple_choice,true_false,short_answer',
            'question_text' => 'sometimes|string',
            'order' => 'sometimes|integer|min:0',
            'points' => 'sometimes|integer|min:1',
            'explanation' => 'nullable|string',
        ]);

        $question->update($validated);

        return response()->json([
            'message' => 'تم تحديث السؤال بنجاح',
            'data' => $question,
        ]);
    }

    // حذف السؤال
    public function destroy(Question $question)
    {
        $question->delete();
        return response()->json(['message' => 'تم حذف السؤال بنجاح']);
    }

    // أسئلة الاختبار
    public function quizQuestions($quizId)
    {
        $questions = Question::where('quiz_id', $quizId)
            ->with('answers')
            ->orderBy('order')
            ->get();

        return response()->json(['data' => $questions]);
    }
}

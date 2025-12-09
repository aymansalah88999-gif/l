<?php

namespace App\Http\Controllers\LMS;

use App\Http\Controllers\Controller;
use App\Models\LMS\Quiz;
use App\Models\LMS\Question;
use App\Models\LMS\Attempt;
use Illuminate\Http\Request;
use App\Services\LMS\GradingService;
use App\Http\Resources\LMS\QuizResource;

class QuizController extends Controller
{
    public function store(Request $request, $courseId)
    {
        // create quiz for course
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'instructions' => 'nullable|string',
        ]);

        $quiz = Quiz::create(array_merge($validated, ['course_id' => $courseId]));
        return new QuizResource($quiz);
    }

    public function addQuestion(Request $request, Quiz $quiz)
    {
        $validated = $request->validate([
            'question_text' => 'required|string',
            'type' => 'required|in:mcq,true_false,short_answer',
            'options' => 'nullable|array',
            'correct_answer' => 'nullable',
        ]);

        $question = $quiz->questions()->create($validated);
        return response()->json($question, 201);
    }

    public function take(Request $request, Quiz $quiz)
    {
        // start attempt
        $attempt = Attempt::create(['quiz_id'=>$quiz->id,'user_id'=>auth()->id()]);
        return response()->json(['attempt_id'=>$attempt->id]);
    }

    public function submit(Request $request, Attempt $attempt, GradingService $grading)
    {
        $data = $request->input('answers', []);
        $grading->gradeAttempt($attempt, $data);
        return response()->json(['score'=>$attempt->score]);
    }
}

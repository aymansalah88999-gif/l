<?php

namespace App\Services\LMS;

use App\Models\LMS\Attempt;
use App\Models\LMS\AttemptAnswer;

class GradingService
{
    public function gradeAttempt(Attempt $attempt, array $answers)
    {
        $total = 0;
        $correct = 0;

        foreach ($answers as $qId => $answer) {
            $question = \App\Models\LMS\Question::find($qId);
            if (!$question) continue;

            $isCorrect = null;
            $score = 0;

            if (in_array($question->type, ['mcq','true_false'])) {
                $isCorrect = trim((string)$question->correct_answer) === trim((string)$answer);
                $score = $isCorrect ? 1 : 0;
            }

            AttemptAnswer::create([
                'attempt_id' => $attempt->id,
                'question_id' => $question->id,
                'answer' => is_array($answer) ? json_encode($answer) : (string)$answer,
                'is_correct' => $isCorrect,
                'score' => $score,
            ]);

            $total++;
            if ($isCorrect) $correct++;
        }

        $attempt->score = $total ? (100 * ($correct / $total)) : 0;
        $attempt->completed_at = now();
        $attempt->save();
    }
}

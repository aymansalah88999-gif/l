<?php

namespace App\Http\Controllers\LMS;

use App\Http\Controllers\Controller;
use App\Models\LMS\Course;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use App\Http\Resources\LMS\CourseResource;

class CourseController extends Controller
{
    public function index()
    {
        $courses = Course::with('instructor')->paginate(15);
        return CourseResource::collection($courses);
    }

    public function store(Request $request)
    {
        $this->authorize('create', Course::class);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'image' => 'nullable|string',
            'category_id' => 'nullable|exists:categories,id',
            'price' => 'nullable|numeric|min:0',
            'level' => 'required|in:beginner,intermediate,advanced',
            // nested structures
            'sections' => 'sometimes|array',
            'sections.*.title' => 'required_with:sections|string|max:255',
            'sections.*.lectures' => 'sometimes|array',
            'sections.*.lectures.*.title' => 'required_with:sections.*.lectures|string|max:255',
            'sections.*.lectures.*.content' => 'nullable|string',

            'quizzes' => 'sometimes|array',
            'quizzes.*.title' => 'required_with:quizzes|string|max:255',
            'quizzes.*.questions' => 'sometimes|array',
            'quizzes.*.questions.*.text' => 'required_with:quizzes.*.questions|string',
            'quizzes.*.questions.*.type' => 'required_with:quizzes.*.questions|in:mcq,true_false,short_answer',
            'quizzes.*.questions.*.options' => 'sometimes|array',
            'quizzes.*.questions.*.options.*.text' => 'required_with:quizzes.*.questions.*.options|string',
            'quizzes.*.questions.*.font' => 'nullable|string',
        ]);

        $slug = \Str::slug($validated['title']);

        \DB::beginTransaction();
        try {
            $course = Course::create([
                'title' => $validated['title'],
                'slug' => $slug,
                'description' => $validated['description'] ?? null,
                'image' => $validated['image'] ?? null,
                'category_id' => $validated['category_id'] ?? null,
                'price' => $validated['price'] ?? 0,
                'level' => $validated['level'],
                'created_by' => auth()->id(),
            ]);

            // create sections -> lectures
            if (!empty($validated['sections'])) {
                $orderSection = 0;
                foreach ($validated['sections'] as $section) {
                    $orderSection++;
                    if (empty($section['lectures'])) {
                        continue;
                    }
                    $orderLecture = 0;
                    foreach ($section['lectures'] as $lec) {
                        $orderLecture++;
                        $course->lectures()->create([
                            'title' => $lec['title'],
                            'content' => $lec['content'] ?? null,
                            'order_index' => $orderLecture,
                        ]);
                    }
                }
            }

            // create quizzes -> questions
            if (!empty($validated['quizzes'])) {
                foreach ($validated['quizzes'] as $quizData) {
                    $quiz = $course->quizzes()->create([
                        'title' => $quizData['title'],
                        'instructions' => $quizData['instructions'] ?? null,
                    ]);

                    if (!empty($quizData['questions'])) {
                        foreach ($quizData['questions'] as $questionData) {
                            $options = $questionData['options'] ?? null;
                            $correctAnswer = null;
                            if (!empty($options) && is_array($options)) {
                                // detect correct indices
                                $correct = [];
                                foreach ($options as $idx => $opt) {
                                    if (!empty($opt['correct'])) $correct[] = $idx;
                                }
                                $correctAnswer = empty($correct) ? null : json_encode($correct);
                            }

                            $question = $quiz->questions()->create([
                                'question_text' => $questionData['text'],
                                'type' => $questionData['type'],
                                'options' => $options ?? null,
                                'correct_answer' => $correctAnswer,
                                'font' => $questionData['font'] ?? null,
                            ]);
                        }
                    }
                }
            }

            \DB::commit();

            return new CourseResource($course->load(['lectures','quizzes.questions']));
        } catch (\Throwable $e) {
            \DB::rollBack();
            report($e);
            return response()->json(['message' => 'حدث خطأ أثناء إنشاء الكورس'], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function show(Course $course)
    {
        return new CourseResource($course->load(['lectures','quizzes']));
    }

    public function update(Request $request, Course $course)
    {
        $this->authorize('update', $course);
        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'image' => 'nullable|string',
            'category_id' => 'nullable|exists:categories,id',
            'price' => 'nullable|numeric|min:0',
            'level' => 'sometimes|in:beginner,intermediate,advanced',
            'status' => 'sometimes|in:draft,pending,published'
        ]);

        $course->update($validated);

        return new CourseResource($course);
    }

    public function destroy(Course $course)
    {
        $this->authorize('delete', $course);
        $course->delete();
        return response()->json(['message'=>'deleted'], Response::HTTP_NO_CONTENT);
    }
}

<?php

namespace App\Http\Controllers\LMS;

use App\Http\Controllers\Controller;
use App\Models\LMS\Lecture;
use App\Models\LMS\Course;
use Illuminate\Http\Request;
use App\Http\Resources\LMS\LectureResource;

class LectureController extends Controller
{
    public function index(Course $course)
    {
        $lectures = $course->lectures()->get();
        return LectureResource::collection($lectures);
    }

    public function store(Request $request, Course $course)
    {
        $this->authorize('update', $course);
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'nullable|string',
            'video_url' => 'nullable|url',
            'order_index' => 'nullable|integer',
        ]);

        $lecture = $course->lectures()->create($validated);

        return new LectureResource($lecture);
    }

    public function show(Lecture $lecture)
    {
        return new LectureResource($lecture);
    }

    public function update(Request $request, Lecture $lecture)
    {
        $this->authorize('update', $lecture->course);
        $lecture->update($request->only(['title','content','video_url','order_index']));
        return new LectureResource($lecture);
    }

    public function destroy(Lecture $lecture)
    {
        $this->authorize('update', $lecture->course);
        $lecture->delete();
        return response()->json([], 204);
    }
}

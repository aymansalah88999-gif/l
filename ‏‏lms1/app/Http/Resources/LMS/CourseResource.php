<?php

namespace App\Http\Resources\LMS;

use Illuminate\Http\Resources\Json\JsonResource;

class CourseResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'slug' => $this->slug,
            'description' => $this->description,
            'image' => $this->image,
            'level' => $this->level,
            'status' => $this->status,
            'price' => $this->price,
            'instructor' => new \App\Http\Resources\UserResource($this->whenLoaded('instructor')),
            'students_count' => $this->students_count,
        ];
    }
}

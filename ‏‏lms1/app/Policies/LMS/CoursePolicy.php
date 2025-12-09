<?php

namespace App\Policies\LMS;

use App\Models\LMS\Course;
use App\Models\User;

class CoursePolicy
{
    public function create(User $user)
    {
        return in_array($user->role, ['instructor','admin']);
    }

    public function update(User $user, Course $course)
    {
        return $user->role === 'admin' || $course->created_by === $user->id;
    }

    public function delete(User $user, Course $course)
    {
        return $user->role === 'admin' || $course->created_by === $user->id;
    }

    public function view(User $user, Course $course)
    {
        if ($course->status === 'published') return true;
        if ($user->role === 'admin') return true;
        if ($course->created_by === $user->id) return true;
        return false;
    }
}

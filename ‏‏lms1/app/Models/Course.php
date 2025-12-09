<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Course extends Model
{
    /** @use HasFactory<\Database\Factories\CourseFactory> */
    use HasFactory;

    protected $fillable = [
        'instructor_id',
        'title',
        'description',
        'image_url',
        'level',
        'duration_hours',
        'price',
        'students_count',
        'status',
        'what_you_will_learn',
        'requirements',
    ];

    // العلاقات
    public function instructor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'instructor_id');
    }

    public function lessons(): HasMany
    {
        return $this->hasMany(Lesson::class)->orderBy('order');
    }

    public function quizzes(): HasMany
    {
        return $this->hasMany(Quiz::class);
    }

    public function students(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'student_courses', 'course_id', 'student_id')
            ->withPivot('progress', 'completed_lessons', 'enrolled_at', 'completed_at')
            ->withTimestamps();
    }

    public function studentCourses(): HasMany
    {
        return $this->hasMany(StudentCourse::class);
    }
}

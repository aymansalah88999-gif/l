<?php

namespace App\Models\LMS;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Course extends Model
{
    use HasFactory;

    protected $table = 'lms_courses';

    protected $fillable = ['title','slug','description','image','category_id','price','level','status','created_by','students_count'];

    public function instructor(): BelongsTo
    {
        return $this->belongsTo(\App\Models\User::class, 'created_by');
    }

    public function lectures(): HasMany
    {
        return $this->hasMany(Lecture::class, 'course_id')->orderBy('order_index');
    }

    public function quizzes(): HasMany
    {
        return $this->hasMany(Quiz::class, 'course_id');
    }

    public function enrollments(): HasMany
    {
        return $this->hasMany(Enrollment::class, 'course_id');
    }
}

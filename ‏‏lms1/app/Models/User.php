<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    // للمدرسين
    public function courses(): HasMany
    {
        return $this->hasMany(Course::class, 'instructor_id');
    }

    // للطلاب
    public function enrolledCourses(): BelongsToMany
    {
        return $this->belongsToMany(Course::class, 'student_courses', 'student_id', 'course_id')
            ->withPivot('progress', 'completed_lessons', 'enrolled_at', 'completed_at')
            ->withTimestamps();
    }

    public function studentCourses(): HasMany
    {
        return $this->hasMany(StudentCourse::class, 'student_id');
    }

    public function quizResults(): HasMany
    {
        return $this->hasMany(QuizResult::class, 'student_id');
    }
}

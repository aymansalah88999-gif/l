<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // إنشاء مستخدم طالب
        User::factory()->create([
            'name' => 'أحمد الطالب',
            'email' => 'student@example.com',
            'role' => 'student',
        ]);

        // إنشاء مستخدم مدرس
        User::factory()->create([
            'name' => 'محمد المدرس',
            'email' => 'teacher@example.com',
            'role' => 'instructor',
        ]);

        // إنشاء مستخدم إداري
        User::factory()->create([
            'name' => 'الإدارة',
            'email' => 'admin@example.com',
            'role' => 'admin',
        ]);

        // تشغيل باقي الـ Seeders
        $this->call([
            CourseSeeder::class,
            LessonSeeder::class,
            QuizSeeder::class,
        ]);
    }
}

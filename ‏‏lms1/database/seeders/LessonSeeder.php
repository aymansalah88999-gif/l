<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\LMS\Lecture;
use App\Models\LMS\Course;

class LessonSeeder extends Seeder
{
    public function run(): void
    {
        $course = Course::where('slug','intro-to-laravel')->first();
        if (!$course) return;

        Lecture::create([
            'course_id' => $course->id,
            'title' => 'المحاضرة الأولى: التعريف',
            'content' => 'محتوى تعريفي',
            'video_url' => null,
            'order_index' => 1,
        ]);
    }
}
<?php

namespace Database\Seeders;

use App\Models\Course;
use App\Models\Lesson;
use Illuminate\Database\Seeder;

class LessonSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $course = Course::first();

        if (!$course) {
            return;
        }

        // دروس الكورس
        Lesson::create([
            'course_id' => $course->id,
            'title' => 'مقدمة عن PHP',
            'description' => 'تعرف على أساسيات PHP وإعدادات البيئة',
            'content' => 'دعنا نبدأ رحلتنا مع PHP...',
            'video_url' => 'https://www.youtube.com/watch?v=example1',
            'order' => 1,
            'is_free' => true,
            'duration_minutes' => 25,
        ]);

        Lesson::create([
            'course_id' => $course->id,
            'title' => 'المتغيرات والأنواع',
            'description' => 'فهم المتغيرات والأنواع البيانات في PHP',
            'content' => 'يتعامل PHP مع عدة أنواع بيانات...',
            'video_url' => 'https://www.youtube.com/watch?v=example2',
            'order' => 2,
            'is_free' => true,
            'duration_minutes' => 30,
        ]);

        Lesson::create([
            'course_id' => $course->id,
            'title' => 'التحكم بالتدفق والشروط',
            'description' => 'تعلم if, else, switch والحلقات',
            'content' => 'هياكل التحكم بالتدفق...',
            'video_url' => 'https://www.youtube.com/watch?v=example3',
            'order' => 3,
            'is_free' => false,
            'duration_minutes' => 35,
        ]);

        Lesson::create([
            'course_id' => $course->id,
            'title' => 'الدوال والفئات',
            'description' => 'البرمجة الكائنية التوجه مع PHP',
            'content' => 'الدوال والفئات هي أساس OOP...',
            'video_url' => 'https://www.youtube.com/watch?v=example4',
            'order' => 4,
            'is_free' => false,
            'duration_minutes' => 45,
        ]);
    }
}

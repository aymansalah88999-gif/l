<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\LMS\Course;
use App\Models\User;

class CourseSeeder extends Seeder
{
    public function run(): void
    {
        $instructor = User::where('role','instructor')->first();
        if (!$instructor) return;

        Course::create([
            'title' => 'مقدمة في Laravel',
            'slug' => 'intro-to-laravel',
            'description' => 'دورة تمهيدية لتعلم Laravel',
            'image' => null,
            'category_id' => null,
            'price' => 0,
            'level' => 'beginner',
            'status' => 'published',
            'created_by' => $instructor->id,
        ]);
    }
}
<?php

namespace Database\Seeders;

use App\Models\Course;
use App\Models\User;
use Illuminate\Database\Seeder;

class CourseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // الحصول على مدرس أو إنشاء واحد
        $instructor = User::where('role', 'instructor')->first();
        
        if (!$instructor) {
            $instructor = User::create([
                'name' => 'المدرس أحمد',
                'email' => 'instructor@example.com',
                'password' => bcrypt('password'),
                'role' => 'instructor',
            ]);
        }

        // إنشاء كورسات تجريبية
        Course::create([
            'instructor_id' => $instructor->id,
            'title' => 'مقدمة إلى PHP والويب',
            'description' => 'تعلم أساسيات البرمجة مع PHP وبناء مواقع ويب ديناميكية',
            'level' => 'beginner',
            'duration_hours' => 20,
            'price' => 49.99,
            'status' => 'active',
            'what_you_will_learn' => 'تعلم أساسيات PHP - فهم قواعد البيانات - بناء تطبيقات ويب',
            'requirements' => 'معرفة أساسية بالحاسوب - الرغبة في التعلم',
        ]);

        Course::create([
            'instructor_id' => $instructor->id,
            'title' => 'Laravel للمبتدئين',
            'description' => 'تعلم إطار عمل Laravel الشهير لبناء تطبيقات ويب احترافية',
            'level' => 'intermediate',
            'duration_hours' => 30,
            'price' => 79.99,
            'status' => 'active',
            'what_you_will_learn' => 'فهم بنية Laravel - العمل مع Eloquent ORM - إنشاء APIs',
            'requirements' => 'معرفة أساسية بـ PHP - فهم OOP',
        ]);

        Course::create([
            'instructor_id' => $instructor->id,
            'title' => 'React والجافاسكريبت المتقدم',
            'description' => 'كورس متقدم لتعلم React وبناء واجهات مستخدم احترافية',
            'level' => 'advanced',
            'duration_hours' => 40,
            'price' => 99.99,
            'status' => 'active',
            'what_you_will_learn' => 'Hooks في React - State Management - بناء مكونات متقدمة',
            'requirements' => 'معرفة جيدة بالجافاسكريبت - تجربة سابقة مع React',
        ]);
    }
}

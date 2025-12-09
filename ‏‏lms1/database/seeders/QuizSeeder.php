<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\LMS\Quiz;
use App\Models\LMS\Question;
use App\Models\LMS\Course;

class QuizSeeder extends Seeder
{
    public function run(): void
    {
        $course = Course::where('slug','intro-to-laravel')->first();
        if (!$course) return;

        $quiz = Quiz::create(['course_id'=>$course->id,'title'=>'اختبار تمهيدي','instructions'=>'أجب عن الأسئلة']);

        Question::create(['quiz_id'=>$quiz->id,'question_text'=>'هل Laravel إطار عمل؟','type'=>'true_false','options'=>null,'correct_answer'=>'true']);
        Question::create(['quiz_id'=>$quiz->id,'question_text'=>'اختر لغة PHP؟','type'=>'mcq','options'=>json_encode(['PHP','JavaScript','Python']),'correct_answer'=>'PHP']);
    }
}
<?php

namespace Database\Seeders;

use App\Models\Course;
use App\Models\Lesson;
use App\Models\Quiz;
use App\Models\Question;
use App\Models\Answer;
use Illuminate\Database\Seeder;

class QuizSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $course = Course::first();
        $lesson = Lesson::first();

        if (!$course || !$lesson) {
            return;
        }

        // إنشاء اختبار
        $quiz = Quiz::create([
            'course_id' => $course->id,
            'lesson_id' => $lesson->id,
            'title' => 'اختبار مقدمة PHP',
            'description' => 'اختبر معلوماتك حول مقدمة PHP',
            'pass_percentage' => 70,
            'duration_minutes' => 15,
            'show_results' => true,
            'shuffle_questions' => true,
        ]);

        // إنشاء سؤال 1
        $q1 = Question::create([
            'quiz_id' => $quiz->id,
            'type' => 'multiple_choice',
            'question_text' => 'ما اختصار PHP؟',
            'order' => 1,
            'points' => 1,
            'explanation' => 'PHP اختصار لـ Hypertext Preprocessor',
        ]);

        Answer::create([
            'question_id' => $q1->id,
            'answer_text' => 'Personal Home Page',
            'is_correct' => false,
            'order' => 1,
        ]);

        Answer::create([
            'question_id' => $q1->id,
            'answer_text' => 'Hypertext Preprocessor',
            'is_correct' => true,
            'order' => 2,
        ]);

        Answer::create([
            'question_id' => $q1->id,
            'answer_text' => 'PHP Hypertext Protocol',
            'is_correct' => false,
            'order' => 3,
        ]);

        // إنشاء سؤال 2
        $q2 = Question::create([
            'quiz_id' => $quiz->id,
            'type' => 'true_false',
            'question_text' => 'PHP لغة برمجة من جانب الخادم (Server-side)',
            'order' => 2,
            'points' => 1,
            'explanation' => 'صحيح، PHP تعمل على الخادم وليس المتصفح',
        ]);

        Answer::create([
            'question_id' => $q2->id,
            'answer_text' => 'صحيح',
            'is_correct' => true,
            'order' => 1,
        ]);

        Answer::create([
            'question_id' => $q2->id,
            'answer_text' => 'خاطئ',
            'is_correct' => false,
            'order' => 2,
        ]);

        // إنشاء سؤال 3
        $q3 = Question::create([
            'quiz_id' => $quiz->id,
            'type' => 'multiple_choice',
            'question_text' => 'كيف تبدأ ملفات PHP؟',
            'order' => 3,
            'points' => 1,
            'explanation' => 'جميع ملفات PHP يجب أن تبدأ بـ <?php',
        ]);

        Answer::create([
            'question_id' => $q3->id,
            'answer_text' => '<?php',
            'is_correct' => true,
            'order' => 1,
        ]);

        Answer::create([
            'question_id' => $q3->id,
            'answer_text' => '<php>',
            'is_correct' => false,
            'order' => 2,
        ]);

        Answer::create([
            'question_id' => $q3->id,
            'answer_text' => '<? PHP',
            'is_correct' => false,
            'order' => 3,
        ]);
    }
}

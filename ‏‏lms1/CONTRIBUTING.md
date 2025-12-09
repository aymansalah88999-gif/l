# 🤝 دليل المساهمة

شكراً لاهتمامك بالمساهمة في منصة LMS! نرحب بجميع أنواع المساهمات.

---

## 📋 أنواع المساهمات المقبولة

- 🐛 إصلاح الأخطاء (Bugs)
- ✨ إضافة ميزات جديدة (Features)
- 📚 تحسين التوثيق (Documentation)
- 🚀 تحسينات الأداء (Performance)
- 🔒 تحسينات الأمان (Security)

---

## 🚀 البدء

### 1. انسخ المشروع (Fork)

```bash
اضغط على زر "Fork" في صفحة GitHub
```

### 2. انسخه محلياً

```bash
git clone https://github.com/YOUR_USERNAME/lms.git
cd lms
git remote add upstream https://github.com/ORIGINAL_OWNER/lms.git
```

### 3. أنشئ فرع جديد

```bash
git checkout -b feature/your-feature-name
# أو
git checkout -b fix/bug-name
```

**قواعس تسمية الفروع:**
```
feature/add-certificate-system
fix/quiz-scoring-bug
docs/api-documentation
refactor/database-optimization
test/add-unit-tests
```

---

## 💻 عملية التطوير

### قبل البدء

```bash
# تحديث الـ Dependencies
composer update
npm update

# تشغيل الاختبارات
php artisan test

# التحقق من الأخطاء
composer run lint
npm run lint
```

### معايير الكود

#### PHP (Laravel)

```php
// ✅ صحيح
public function storeQuiz(StoreQuizRequest $request, Course $course)
{
    $quiz = $course->quizzes()->create($request->validated());
    
    return response()->json($quiz);
}

// ❌ خطأ
function store($req, $c){
$q=$c->q()->c($req->v());
return $q;
}
```

**القواعد:**
- استخدم camelCase للمتغيرات
- استخدم PascalCase للأصناف
- اكتب comments واضحة
- لا تترك رموز debug

#### JavaScript/React

```javascript
// ✅ صحيح
const CourseCard = ({ course, onEnroll }) => {
  return (
    <div className="course-card">
      <h3>{course.title}</h3>
      <button onClick={onEnroll}>Enroll</button>
    </div>
  );
};

// ❌ خطأ
const CC = ({ c, o }) => {
  return <div><h3>{c.t}</h3><button onClick={o}>E</button></div>;
};
```

### اختبار الكود

```bash
# تشغيل جميع الاختبارات
php artisan test

# اختبار ملف معين
php artisan test tests/Feature/CourseControllerTest.php

# اختبار مع التغطية
php artisan test --coverage
```

### معاينة محلية

```bash
# في Terminal الأول
php artisan serve

# في Terminal الثاني
npm run dev

# اذهب إلى: http://localhost:8000
```

---

## 📝 الـ Commit

### رسالة Commit الجيدة

```
[TYPE] Brief description (50 chars or less)

More detailed explanation if needed (72 chars per line).
Explain what and why, not how.

- Bullet point 1
- Bullet point 2

Closes #ISSUE_NUMBER
```

### أمثلة

```
✅ feat: Add certificate generation for course completion
✅ fix: Resolve quiz scoring calculation bug
✅ docs: Update API documentation for quizzes
✅ refactor: Optimize database queries in CourseController
✅ test: Add unit tests for QuizController

❌ updated stuff
❌ fixed bug
❌ asdf
```

### الـ Types المقبولة

```
feat     - إضافة ميزة جديدة
fix      - إصلاح خطأ
docs     - تحسينات التوثيق
style    - تغييرات التنسيق (لا تؤثر على الكود)
refactor - إعادة هيكلة الكود
perf     - تحسينات الأداء
test     - إضافة/تعديل الاختبارات
chore    - تحديثات البناء والأدوات
```

---

## 🔄 إنشاء Pull Request

### الخطوات

```bash
# 1. تحديث فرعك من الفرع الأساسي
git fetch upstream
git rebase upstream/main

# 2. دفع التغييرات
git push origin feature/your-feature-name

# 3. اذهب إلى GitHub وأنشئ PR
```

### وصف Pull Request

```markdown
## الوصف
وصف مختصر للتغييرات.

## نوع التغيير
- [ ] إضافة ميزة جديدة
- [ ] إصلاح خطأ
- [ ] تحسين التوثيق
- [ ] تحسين الأداء
- [ ] تغيير Breaking

## المتطلبات الأساسية
- [ ] لقد قرأت CONTRIBUTING.md
- [ ] الكود يتبع معايير المشروع
- [ ] أضفت اختبارات
- [ ] أضفت documentation
- [ ] لا توجد أخطاء جديدة

## كيفية اختبار
```bash
php artisan migrate
php artisan db:seed
php artisan test
```

## صور/فيديوهات (إن أمكن)
[الصق الصور هنا]

## الـ Issues ذات الصلة
Closes #123
```

---

## ✅ Checklist قبل الإرسال

```
☑️ الكود يتبع معايير المشروع
☑️ لا توجد تحذيرات في الـ Linter
☑️ جميع الاختبارات تمر بنجاح
☑️ أضفت اختبارات جديدة (إن لزم)
☑️ أضفت documentation
☑️ الـ Commit messages واضحة
☑️ لا توجد conflicts
☑️ النسخة محدثة (CHANGELOG)
```

---

## 📚 هيكل المشروع

### إضافة ميزة جديدة

```
1. Model + Migration
   app/Models/NewModel.php
   database/migrations/create_new_table.php

2. Controller + Routes
   app/Http/Controllers/Api/NewController.php
   routes/api.php (أضف routes)

3. Requests (Validation)
   app/Http/Requests/StoreNewRequest.php
   app/Http/Requests/UpdateNewRequest.php

4. Tests
   tests/Feature/NewControllerTest.php
   tests/Unit/NewModelTest.php

5. Documentation
   - API docs
   - اسم الملف والوصف
```

### مثال عملي: إضافة نظام الشهادات

```
1. Migration: create_certificates_table
2. Model: app/Models/Certificate.php
3. Controller: app/Http/Controllers/Api/CertificateController.php
4. Requests: StoreCertificateRequest.php
5. Routes: في routes/api.php
6. Tests: tests/Feature/CertificateControllerTest.php
7. React Component: resources/js/Pages/Certificate/Show.jsx
8. Documentation: شرح في الـ README
```

---

## 🧪 الاختبارات

### كتابة اختبار جديد

```php
<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\Course;

class CourseControllerTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create();
    }

    public function test_user_can_view_courses()
    {
        $courses = Course::factory(3)->create();
        
        $response = $this->getJson('/api/courses');
        
        $response->assertStatus(200)
                 ->assertJsonCount(3, 'data');
    }

    public function test_authorized_user_can_create_course()
    {
        $this->actingAs($this->user, 'sanctum');
        
        $response = $this->postJson('/api/courses', [
            'title' => 'New Course',
            'description' => 'Test',
            'level' => 'beginner',
            'price' => 49.99,
        ]);
        
        $response->assertStatus(201)
                 ->assertJsonPath('data.title', 'New Course');
    }
}
```

### تشغيل الاختبارات

```bash
# جميع الاختبارات
php artisan test

# اختبار معين
php artisan test --filter CourseControllerTest

# مع التغطية
php artisan test --coverage
```

---

## 📖 التوثيق

### تحديث README

إذا أضفت ميزة جديدة، أضف توثيق:

```markdown
## ميزة جديدة

### الوصف
شرح مختصر

### الاستخدام
```bash
# أمثلة
```

### API
```
POST /api/endpoint
GET /api/endpoint/:id
```
```

### كتابة Docstrings

```php
/**
 * إنشاء امتحان جديد
 *
 * @param StoreQuizRequest $request بيانات الطلب
 * @param Course $course الكورس المعني
 * @return \Illuminate\Http\JsonResponse
 *
 * @example
 * $response = $this->post('/api/quizzes', [
 *     'title' => 'Test Quiz',
 *     'pass_percentage' => 60,
 * ]);
 */
public function store(StoreQuizRequest $request, Course $course)
{
    // ...
}
```

---

## 🐛 الإبلاغ عن الأخطاء

### نموذج الإبلاغ

```markdown
## الوصف
وصف واضح للمشكلة

## الخطوات للتكرار
1. اذهب إلى...
2. انقر على...
3. لاحظ...

## السلوك المتوقع
ما الذي كان يجب أن يحدث

## السلوك الفعلي
ما الذي حدث فعلاً

## لقطات الشاشة
[إرفق الصور]

## البيئة
- OS: Windows / Mac / Linux
- المتصفح: Chrome / Firefox
- الإصدار: 1.0.0

## معلومات إضافية
أي معلومات أخرى مفيدة
```

---

## 💡 نصائح التطوير

### استخدام Tinker

```bash
php artisan tinker

# إنشاء بيانات اختبار
>>> User::factory(10)->create()
>>> Course::factory(5)->create()

# اختبار Relationships
>>> User::find(1)->courses()->count()
```

### تصحيح الأخطاء

```bash
# عرض الأخطاء
tail -f storage/logs/laravel.log

# إعادة تشغيل الخادم
php artisan serve --port=8001

# مسح الـ Cache
php artisan cache:clear
php artisan config:clear
```

### تحسينات الأداء

```php
// ❌ سيء - N+1 queries
$courses = Course::all();
foreach ($courses as $course) {
    echo $course->instructor->name; // 26 queries!
}

// ✅ جيد - Eager loading
$courses = Course::with('instructor')->get(); // 2 queries
```

---

## 🏆 معايير القبول

قبل قبول PR، يجب أن:

- ✅ يمر جميع الاختبارات
- ✅ لا توجد تعارضات مع الفرع الأساسي
- ✅ الكود يتبع معايير المشروع
- ✅ التوثيق محدثة
- ✅ مراجعة الكود صحيحة

---

## 📞 التواصل

### أين تسأل؟

- 📧 البريد: dev@example.com
- 💬 GitHub Discussions
- 🔔 GitHub Issues
- 📝 Wiki المشروع

---

## 📄 الترخيص

بالمساهمة، أنت توافق على أن تكون مساهمتك تحت نفس الترخيص (MIT).

---

<div align="center">

### شكراً على المساهمة! 🙏

منصة LMS أفضل لأنك هنا!

</div>

---

**آخر تحديث:** ديسمبر 2024

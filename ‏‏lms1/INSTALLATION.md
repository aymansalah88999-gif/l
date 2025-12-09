# 🚀 دليل التثبيت الكامل

## متطلبات النظام

```
✓ PHP 8.2 أو أحدث
✓ MySQL 8.0 / MariaDB 10.3+
✓ Node.js 18+
✓ Composer 2.0+
✓ Git
```

---

## خطوات التثبيت

### الخطوة 1️⃣ - نسخ المشروع

```bash
# إذا كان لديك رابط Repository
git clone https://github.com/your-repo/lms.git
cd lms

# أو انسخ الملفات مباشرة
```

### الخطوة 2️⃣ - تثبيت مكتبات PHP

```bash
composer install
```

**الناتج المتوقع:**
```
Installing dependencies from lock file
...
✓ Successfully installed 150+ packages
```

### الخطوة 3️⃣ - تثبيت مكتبات JavaScript

```bash
npm install
```

**الناتج المتوقع:**
```
added 500+ packages
...
```

### الخطوة 4️⃣ - إعداد ملف البيئة

```bash
# على Windows
copy .env.example .env

# على Mac/Linux
cp .env.example .env
```

**قم بتعديل `.env`:**
```ini
APP_NAME="LMS Platform"
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=lms
DB_USERNAME=root
DB_PASSWORD=

# للبريد الإلكتروني (إختياري)
MAIL_DRIVER=log
```

### الخطوة 5️⃣ - توليد مفتاح التطبيق

```bash
php artisan key:generate
```

**الناتج:**
```
✓ Application key set successfully.
```

### الخطوة 6️⃣ - إنشاء قاعدة البيانات

**طريقة 1: استخدام phpMyAdmin**
```
1. فتح: http://localhost/phpmyadmin
2. إضغط على "جديد"
3. اكتب اسم قاعدة البيانات: "lms"
4. اختر utf8mb4 كـ Collation
5. أنشئ
```

**طريقة 2: استخدام سطر الأوامر**
```bash
mysql -u root -p
CREATE DATABASE lms CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EXIT;
```

### الخطوة 7️⃣ - تشغيل الـ Migrations

```bash
php artisan migrate --force
```

**الناتج المتوقع:**
```
Migration table created successfully.
Migrating: 2014_10_12_000000_create_users_table
...
✓ Database migrations completed successfully.
Migrated: 8 migrations
```

### الخطوة 8️⃣ - ملء قاعدة البيانات بـ Seeders

```bash
php artisan db:seed
```

**الناتج:**
```
Database seeding completed successfully.
✓ CourseSeeder: 3 courses
✓ LessonSeeder: 4 lessons
✓ QuizSeeder: 1 quiz with 3 questions
```

### الخطوة 9️⃣ - تشغيل الخادم

**في Terminal الأول - خادم Laravel:**
```bash
php artisan serve
```

**الناتج:**
```
Starting Laravel development server: http://127.0.0.1:8000
```

**في Terminal الثاني - خادم Vite:**
```bash
npm run dev
```

**الناتج:**
```
VITE v5.0.0 ready in 1234 ms

➜ Local: http://localhost:5173/
```

---

## ✅ التحقق من التثبيت

### اختبر الخادم

```bash
# في terminal جديد
curl http://localhost:8000
```

يجب أن تحصل على استجابة HTML.

### تحقق من الـ Migrations

```bash
php artisan migrate:status
```

**يجب أن تراها جميعاً Batch 1 ✓**

### تحقق من الـ Models

```bash
php artisan tinker
>>> User::count()
=> 3
>>> Course::count()
=> 3
>>> Quiz::count()
=> 1
```

---

## 🔐 بيانات الدخول

### حسابات الاختبار الجاهزة

| الدور | البريد | كلمة المرور | الاستخدام |
|------|--------|------------|---------|
| 👤 Student | student@example.com | password | تصفح الكورسات والامتحانات |
| 👨‍🏫 Instructor | teacher@example.com | password | إنشاء كورسات وامتحانات |
| 🔐 Admin | admin@example.com | password | إدارة النظام |

### الدخول

```
1. اذهب إلى: http://localhost:8000
2. انقر على "Login"
3. أدخل البريد وكلمة المرور
4. سيتم نقلك إلى لوحة التحكم
```

---

## 🛠️ أوامر مفيدة

### إعادة تشغيل قاعدة البيانات

```bash
php artisan migrate:fresh --seed
```

### مسح الـ Cache

```bash
php artisan cache:clear
php artisan config:clear
php artisan route:clear
```

### إنشاء مستخدم جديد (Tinker)

```bash
php artisan tinker
>>> User::create([
    'name' => 'اسم المستخدم',
    'email' => 'user@example.com',
    'password' => bcrypt('password'),
    'role' => 'student',
    'email_verified_at' => now()
]);
```

### تشغيل الـ Tests

```bash
php artisan test
```

### عرض قائمة الـ Routes

```bash
php artisan route:list
```

---

## 🐛 حل المشاكل الشائعة

### ❌ "SQLSTATE[HY000]: General error: 2006 MySQL server has gone away"

**الحل:**
```bash
# تأكد من أن MySQL يعمل
# على Windows: ابدأ XAMPP/Laragon
# على Mac: brew services start mysql@8.0
# على Linux: sudo systemctl start mysql
```

### ❌ "Port 8000 already in use"

**الحل:**
```bash
php artisan serve --port=8001
```

### ❌ "Port 5173 already in use"

**الحل:**
```bash
npm run dev -- --port 5174
```

### ❌ "Class not found"

**الحل:**
```bash
composer dump-autoload
php artisan clear-cache
```

### ❌ "permission denied" في storage أو bootstrap

**الحل (على Mac/Linux):**
```bash
chmod -R 775 storage bootstrap/cache
```

### ❌ "No Application Key"

**الحل:**
```bash
php artisan key:generate
```

---

## 📱 اختبر الـ API

### استخدام Postman أو cURL

#### 1️⃣ الحصول على قائمة الكورسات

```bash
curl http://localhost:8000/api/courses
```

**الرد:**
```json
{
  "data": [
    {
      "id": 1,
      "title": "مقدمة إلى PHP",
      "description": "...",
      "level": "beginner",
      "price": 49.99,
      "students_count": 0
    }
  ]
}
```

#### 2️⃣ بدء امتحان

```bash
curl -X POST http://localhost:8000/api/quizzes/1/start \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 🎯 الخطوات التالية

بعد التثبيت الناجح:

1. ✅ اختبر الدخول بالحسابات الجاهزة
2. ✅ استعرض الكورسات المتاحة
3. ✅ حل الامتحان التجريبي
4. ✅ أنشئ كورس جديد (كمدرس)
5. ✅ اقرأ [SYSTEM_DOCUMENTATION.md](SYSTEM_DOCUMENTATION.md)

---

## 📚 الملفات المهمة

| الملف | الوصف |
|------|--------|
| `.env` | إعدادات قاعدة البيانات والتطبيق |
| `routes/api.php` | جميع مسارات API |
| `routes/web.php` | مسارات الويب والصفحات |
| `app/Models/` | نماذج قاعدة البيانات |
| `app/Http/Controllers/Api/` | معالجات API |
| `resources/js/Pages/` | صفحات React |
| `database/migrations/` | نسخ قاعدة البيانات |
| `database/seeders/` | بيانات تجريبية |

---

## 🤝 الدعم والمساعدة

إذا واجهت مشكلة:

1. 📖 اقرأ رسالة الخطأ بعناية
2. 🔍 ابحث عن المشكلة في [حل المشاكل الشائعة](#-حل-المشاكل-الشائعة)
3. 📋 تحقق من [SYSTEM_DOCUMENTATION.md](SYSTEM_DOCUMENTATION.md)
4. 💬 اسأل في مجتمع Laravel
5. 🐛 أرسل Issue على GitHub

---

<div align="center">

### ✨ مبروك! تثبيتك نجح

الآن يمكنك البدء في استخدام المنصة!

🚀 **اذهب إلى:** http://localhost:8000

</div>

---

**آخر تحديث:** ديسمبر 2024  
**الإصدار:** 1.0.0

<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Welcome / Home
|--------------------------------------------------------------------------
*/
Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

/*
|--------------------------------------------------------------------------
| Profile Routes
|--------------------------------------------------------------------------
*/
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';

/*
|--------------------------------------------------------------------------
| Dashboard Routes حسب الدور
|--------------------------------------------------------------------------
*/
Route::middleware(['auth'])->group(function () {
    // صفحة dashboard عام توجه المستخدم حسب دوره
    Route::get('/dashboard', function () {
        $role = auth()->user()->role;
        if ($role === 'admin') {
            return redirect()->route('admin.dashboard');
        } elseif ($role === 'instructor') {
            return redirect()->route('instructor.dashboard');
        } else {
            return redirect()->route('student.dashboard');
        }
    })->name('dashboard');

    // dashboard الطالب
    Route::get('/student/dashboard', function () {
        return Inertia::render('Student/Dashboard');
    })->middleware('role:student')->name('student.dashboard');

    // dashboard المدرس
    Route::get('/instructor/dashboard', function () {
        return Inertia::render('Instructor/Dashboard');
    })->middleware('role:instructor')->name('instructor.dashboard');

    // dashboard المدير
    Route::get('/admin/dashboard', function () {
        return Inertia::render('Admin/Dashboard');
    })->middleware('role:admin')->name('admin.dashboard');

    // كورسات
    Route::get('/courses', function () {
        return Inertia::render('Courses/Index');
    })->name('courses.index');

    Route::get('/courses/{course}', function () {
        return Inertia::render('Courses/Show');
    })->name('courses.show');

    // الاختبارات
    Route::get('/quizzes/{quiz}/take', function () {
        return Inertia::render('Quizzes/Take');
    })->name('quizzes.take');

    // صفحة إنشاء كورس - منشئ متقدم
    Route::get('/instructor/courses/create', function () {
        return Inertia::render('Instructor/AddCourse');
    })->middleware('role:instructor')->name('instructor.courses.create');
});

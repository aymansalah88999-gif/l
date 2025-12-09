<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Response;

class UserController extends Controller
{
    // قائمة جميع المستخدمين
    public function index()
    {
        $users = User::paginate(15);
        
        return response()->json([
            'data' => $users,
        ]);
    }

    // حذف المستخدم
    public function destroy(User $user)
    {
        // عدم حذف المستخدم الحالي
        if ($user->id === auth()->id()) {
            return response()->json([
                'message' => 'لا يمكنك حذف حسابك الخاص',
            ], Response::HTTP_BAD_REQUEST);
        }

        $user->delete();

        return response()->json([
            'message' => 'تم حذف المستخدم بنجاح',
        ]);
    }

    // إحصائيات النظام للإدارة
    public function adminStats()
    {
        $totalUsers = User::count();
        $students = User::where('role', 'student')->count();
        $instructors = User::where('role', 'instructor')->count();
        $courses = \App\Models\Course::count();
        
        return response()->json([
            'data' => [
                'totalUsers' => $totalUsers,
                'totalStudents' => $students,
                'totalInstructors' => $instructors,
                'totalCourses' => $courses,
                'totalRevenue' => 0,
                'averageRating' => 0,
            ]
        ]);
    }
}

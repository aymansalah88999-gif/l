import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function StudentDashboard() {
    const [enrolledCourses, setEnrolledCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalCourses: 0,
        completedLessons: 0,
        passedQuizzes: 0,
        averageScore: 0
    });

    useEffect(() => {
        fetchEnrolledCourses();
        fetchStats();
    }, []);

    const fetchEnrolledCourses = async () => {
        try {
            const response = await axios.get('/api/courses/my-enrolled');
            setEnrolledCourses(response.data.data || []);
        } catch (error) {
            console.error('Error fetching courses:', error);
        }
    };

    const fetchStats = async () => {
        try {
            const response = await axios.get('/api/student/stats');
            setStats(response.data.data || stats);
        } catch (error) {
            console.error('Error fetching stats:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="Student Dashboard" />

            <div className="py-12 bg-gray-50">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-4xl font-bold text-gray-900">
                            📚 لوحة التحكم - الطالب
                        </h1>
                        <p className="text-gray-600 mt-2">مرحباً بك! تابع تقدمك التعليمي</p>
                    </div>

                    {/* Statistics Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        {/* Total Courses */}
                        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-500 text-sm">الكورسات المسجلة</p>
                                    <p className="text-3xl font-bold text-gray-900 mt-2">
                                        {enrolledCourses.length}
                                    </p>
                                </div>
                                <span className="text-4xl">📖</span>
                            </div>
                        </div>

                        {/* Completed Lessons */}
                        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-500 text-sm">الدروس المكتملة</p>
                                    <p className="text-3xl font-bold text-gray-900 mt-2">
                                        {stats.completedLessons}
                                    </p>
                                </div>
                                <span className="text-4xl">✅</span>
                            </div>
                        </div>

                        {/* Passed Quizzes */}
                        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-yellow-500">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-500 text-sm">الاختبارات الناجحة</p>
                                    <p className="text-3xl font-bold text-gray-900 mt-2">
                                        {stats.passedQuizzes}
                                    </p>
                                </div>
                                <span className="text-4xl">🎯</span>
                            </div>
                        </div>

                        {/* Average Score */}
                        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-purple-500">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-500 text-sm">متوسط الدرجات</p>
                                    <p className="text-3xl font-bold text-gray-900 mt-2">
                                        {stats.averageScore.toFixed(1)}%
                                    </p>
                                </div>
                                <span className="text-4xl">📊</span>
                            </div>
                        </div>
                    </div>

                    {/* My Courses Section */}
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                            <h2 className="text-2xl font-bold text-gray-900">
                                🎓 كورساتي الجارية
                            </h2>
                            <Link
                                href="/courses"
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                            >
                                استكشف المزيد
                            </Link>
                        </div>

                        {loading ? (
                            <div className="px-6 py-12 text-center text-gray-500">
                                جاري التحميل...
                            </div>
                        ) : enrolledCourses.length === 0 ? (
                            <div className="px-6 py-12 text-center">
                                <p className="text-gray-500 mb-4">لم تسجل في أي كورس بعد</p>
                                <Link
                                    href="/courses"
                                    className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                                >
                                    تصفح الكورسات الآن
                                </Link>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                                {enrolledCourses.map(course => (
                                    <div
                                        key={course.id}
                                        className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition"
                                    >
                                        <div className="p-4 border-b border-gray-100">
                                            <h3 className="font-bold text-gray-900 mb-2">
                                                {course.title}
                                            </h3>
                                            <p className="text-sm text-gray-600">
                                                المدرس: {course.instructor?.name || 'غير معروف'}
                                            </p>
                                        </div>
                                        <div className="p-4">
                                            {/* Progress Bar */}
                                            <div className="mb-4">
                                                <div className="flex justify-between text-sm mb-2">
                                                    <span className="text-gray-700">التقدم</span>
                                                    <span className="font-semibold text-blue-600">
                                                        {course.progress || 0}%
                                                    </span>
                                                </div>
                                                <div className="w-full bg-gray-200 rounded-full h-2">
                                                    <div
                                                        className="bg-blue-600 h-2 rounded-full transition-all"
                                                        style={{ width: `${course.progress || 0}%` }}
                                                    ></div>
                                                </div>
                                            </div>

                                            <div className="flex gap-2">
                                                <Link
                                                    href={`/courses/${course.id}`}
                                                    className="flex-1 px-4 py-2 bg-blue-600 text-white text-center rounded hover:bg-blue-700 transition text-sm"
                                                >
                                                    استكمل الدراسة
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Quick Actions */}
                    <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Link
                            href="/courses"
                            className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-lg shadow hover:shadow-lg transition"
                        >
                            <h3 className="text-xl font-bold mb-2">🔍 استكشف الكورسات</h3>
                            <p className="text-blue-100">ابحث عن كورسات جديدة لتطوير مهاراتك</p>
                        </Link>

                        <Link
                            href="/profile"
                            className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-lg shadow hover:shadow-lg transition"
                        >
                            <h3 className="text-xl font-bold mb-2">👤 الملف الشخصي</h3>
                            <p className="text-green-100">عدّل بياناتك الشخصية والإعدادات</p>
                        </Link>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

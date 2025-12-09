import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Switch } from '@headlessui/react';

export default function AdminDashboard() {
    const [users, setUsers] = useState([]);
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalStudents: 0,
        totalInstructors: 0,
        totalCourses: 0,
        totalRevenue: 0,
        averageRating: 0
    });

    useEffect(() => {
        fetchData();
        fetchModels();
    }, []);

    const [models, setModels] = useState({});

    const fetchModels = async () => {
        try {
            const res = await axios.get('/api/ai/models');
            setModels(res.data.data || {});
        } catch (err) {
            console.error('Error fetching AI models', err);
        }
    };

    const toggleModel = async (key, enabled) => {
        if (!confirm('هل تريد تغيير حالة النموذج؟')) return;
        try {
            await axios.post(`/api/ai/models/${key}`, { enabled });
            fetchModels();
            alert('تم تحديث حالة النموذج');
        } catch (err) {
            console.error(err);
            alert('فشل التحديث');
        }
    };

    const fetchData = async () => {
        try {
            const [usersRes, coursesRes, statsRes] = await Promise.all([
                axios.get('/api/users', {
                    headers: {
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content,
                    }
                }),
                axios.get('/api/courses', {
                    headers: {
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content,
                    }
                }),
                axios.get('/api/admin/stats', {
                    headers: {
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content,
                    }
                })
            ]);

            setUsers(usersRes.data.data || []);
            setCourses(coursesRes.data.data || []);
            setStats(statsRes.data.data || stats);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const deleteUser = async (userId) => {
        if (confirm('هل أنت متأكد من حذف هذا المستخدم؟')) {
            try {
                await axios.delete(`/api/users/${userId}`, {
                    headers: {
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content,
                    }
                });
                fetchData();
                alert('تم حذف المستخدم بنجاح!');
            } catch (error) {
                console.error('Error deleting user:', error);
            }
        }
    };

    const deleteCourse = async (courseId) => {
        if (confirm('هل أنت متأكد من حذف هذا الكورس؟')) {
            try {
                await axios.delete(`/api/courses/${courseId}`, {
                    headers: {
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content,
                    }
                });
                fetchData();
                alert('تم حذف الكورس بنجاح!');
            } catch (error) {
                console.error('Error deleting course:', error);
            }
        }
    };

    const getRoleLabel = (role) => {
        switch(role) {
            case 'student': return '👤 طالب';
            case 'instructor': return '👨‍🏫 مدرس';
            case 'admin': return '🔐 إداري';
            default: return role;
        }
    };

    const getLevelLabel = (level) => {
        switch(level) {
            case 'beginner': return '🟢 مبتدئ';
            case 'intermediate': return '🟡 متوسط';
            case 'advanced': return '🔴 متقدم';
            default: return level;
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="Admin Dashboard" />

            <div className="py-12 bg-gray-50">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-4xl font-bold text-gray-900">
                            🔐 لوحة تحكم الإدارة
                        </h1>
                        <p className="text-gray-600 mt-2">إدارة النظام والمستخدمين والكورسات</p>
                    </div>

                    {/* Statistics Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
                        {/* Total Users */}
                        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-blue-500">
                            <p className="text-gray-500 text-xs font-semibold mb-1">المستخدمون</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
                            <p className="text-gray-400 text-xs mt-1">👥</p>
                        </div>

                        {/* Total Students */}
                        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-green-500">
                            <p className="text-gray-500 text-xs font-semibold mb-1">الطلاب</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.totalStudents}</p>
                            <p className="text-gray-400 text-xs mt-1">📚</p>
                        </div>

                        {/* Total Instructors */}
                        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-yellow-500">
                            <p className="text-gray-500 text-xs font-semibold mb-1">المدرسون</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.totalInstructors}</p>
                            <p className="text-gray-400 text-xs mt-1">👨‍🏫</p>
                        </div>

                        {/* Total Courses */}
                        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-purple-500">
                            <p className="text-gray-500 text-xs font-semibold mb-1">الكورسات</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.totalCourses}</p>
                            <p className="text-gray-400 text-xs mt-1">🎓</p>
                        </div>

                        {/* Total Revenue */}
                        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-red-500">
                            <p className="text-gray-500 text-xs font-semibold mb-1">الإيرادات</p>
                            <p className="text-2xl font-bold text-gray-900">${stats.totalRevenue.toFixed(0)}</p>
                            <p className="text-gray-400 text-xs mt-1">💰</p>
                        </div>

                        {/* Average Rating */}
                        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-orange-500">
                            <p className="text-gray-500 text-xs font-semibold mb-1">التقييم</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.averageRating.toFixed(1)}⭐</p>
                            <p className="text-gray-400 text-xs mt-1">🏆</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Users Management */}
                        <div className="bg-white rounded-lg shadow overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
                                <h2 className="text-xl font-bold text-gray-900">
                                    👥 المستخدمون ({users.length})
                                </h2>
                            </div>

                            {loading ? (
                                <div className="px-6 py-8 text-center text-gray-500">جاري التحميل...</div>
                            ) : users.length === 0 ? (
                                <div className="px-6 py-8 text-center text-gray-500">لا توجد مستخدمون</div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead className="bg-gray-50 border-b border-gray-200">
                                            <tr>
                                                <th className="px-4 py-3 text-left text-gray-600 font-semibold">الاسم</th>
                                                <th className="px-4 py-3 text-left text-gray-600 font-semibold">الدور</th>
                                                <th className="px-4 py-3 text-left text-gray-600 font-semibold">العمل</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {users.slice(0, 10).map(user => (
                                                <tr key={user.id} className="border-b border-gray-200 hover:bg-gray-50">
                                                    <td className="px-4 py-3 text-gray-900 font-medium">{user.name}</td>
                                                    <td className="px-4 py-3 text-gray-600">
                                                        <span className="text-xs">{getRoleLabel(user.role)}</span>
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <button
                                                            onClick={() => deleteUser(user.id)}
                                                            className="text-red-600 hover:text-red-800 font-semibold"
                                                        >
                                                            🗑️ حذف
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    {users.length > 10 && (
                                        <div className="px-6 py-4 text-center text-gray-500 text-sm">
                                            +{users.length - 10} مستخدمين آخرين
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Courses Management */}
                        <div className="bg-white rounded-lg shadow overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-green-50 to-emerald-50">
                                <h2 className="text-xl font-bold text-gray-900">
                                    🎓 الكورسات ({courses.length})
                                </h2>
                            </div>

                            {loading ? (
                                <div className="px-6 py-8 text-center text-gray-500">جاري التحميل...</div>
                            ) : courses.length === 0 ? (
                                <div className="px-6 py-8 text-center text-gray-500">لا توجد كورسات</div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead className="bg-gray-50 border-b border-gray-200">
                                            <tr>
                                                <th className="px-4 py-3 text-left text-gray-600 font-semibold">العنوان</th>
                                                <th className="px-4 py-3 text-left text-gray-600 font-semibold">المستوى</th>
                                                <th className="px-4 py-3 text-left text-gray-600 font-semibold">الطلاب</th>
                                                <th className="px-4 py-3 text-left text-gray-600 font-semibold">العمل</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {courses.slice(0, 10).map(course => (
                                                <tr key={course.id} className="border-b border-gray-200 hover:bg-gray-50">
                                                    <td className="px-4 py-3 text-gray-900 font-medium">{course.title}</td>
                                                    <td className="px-4 py-3 text-xs">{getLevelLabel(course.level)}</td>
                                                    <td className="px-4 py-3 text-gray-600">{course.students_count || 0}</td>
                                                    <td className="px-4 py-3">
                                                        <button
                                                            onClick={() => deleteCourse(course.id)}
                                                            className="text-red-600 hover:text-red-800 font-semibold"
                                                        >
                                                            🗑️
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    {courses.length > 10 && (
                                        <div className="px-6 py-4 text-center text-gray-500 text-sm">
                                            +{courses.length - 10} كورسات آخرى
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Link
                            href="/courses"
                            className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-lg shadow hover:shadow-lg transition"
                        >
                            <h3 className="text-xl font-bold mb-2">📚 الكورسات</h3>
                            <p className="text-blue-100">إدارة الكورسات والمحتوى</p>
                        </Link>

                        <Link
                            href="/users"
                            className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-lg shadow hover:shadow-lg transition"
                        >
                            <h3 className="text-xl font-bold mb-2">👥 المستخدمون</h3>
                            <p className="text-green-100">إدارة المستخدمين والأدوار</p>
                        </Link>

                        <Link
                            href="/settings"
                            className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-lg shadow hover:shadow-lg transition"
                        >
                            <h3 className="text-xl font-bold mb-2">⚙️ الإعدادات</h3>
                            <p className="text-purple-100">إعدادات النظام العامة</p>
                        </Link>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

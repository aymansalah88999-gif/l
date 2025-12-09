import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function InstructorDashboard() {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        level: 'beginner',
        price: 0
    });
    const [stats, setStats] = useState({
        totalCourses: 0,
        totalStudents: 0,
        totalLessons: 0,
        averageRating: 0
    });

    useEffect(() => {
        fetchCourses();
        fetchStats();
    }, []);

    const fetchCourses = async () => {
        try {
            const response = await axios.get('/api/courses/my-created', {
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content,
                }
            });
            setCourses(response.data.data || []);
        } catch (error) {
            console.error('Error fetching courses:', error);
        }
    };

    const fetchStats = async () => {
        try {
            const response = await axios.get('/api/instructor/stats', {
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content,
                }
            });
            setStats(response.data.data || stats);
        } catch (error) {
            console.error('Error fetching stats:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'price' ? parseFloat(value) : value
        }));
    };

    const handleCreateCourse = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/api/courses', formData, {
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content,
                }
            });

            setFormData({ title: '', description: '', level: 'beginner', price: 0 });
            setShowCreateForm(false);
            fetchCourses();
            fetchStats();
            alert('تم إنشاء الكورس بنجاح!');
        } catch (error) {
            console.error('Error creating course:', error);
            alert('حدث خطأ في إنشاء الكورس');
        }
    };

    const deleteCourse = async (courseId) => {
        if (confirm('هل أنت متأكد من حذف هذا الكورس؟')) {
            try {
                const response = await fetch(`/api/courses/${courseId}`, {
                    method: 'DELETE',
                    headers: {
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content,
                    }
                });

                if (response.ok) {
                    fetchCourses();
                    fetchStats();
                    alert('تم حذف الكورس بنجاح!');
                } else {
                    alert('حدث خطأ في حذف الكورس');
                }
            } catch (error) {
                console.error('Error deleting course:', error);
            }
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="Instructor Dashboard" />

            <div className="py-12 bg-gray-50">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8 flex justify-between items-center">
                        <div>
                            <h1 className="text-4xl font-bold text-gray-900">
                                👨‍🏫 لوحة تحكم المدرس
                            </h1>
                            <p className="text-gray-600 mt-2">أدارة الكورسات والدروس والامتحانات</p>
                        </div>
                        <a href="/instructor/courses/create" className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold">
                            ➕ إنشاء كورس جديد
                        </a>
                    </div>

                    {/* Create Course Form */}
                    {showCreateForm && (
                        <div className="bg-white rounded-lg shadow-lg p-6 mb-8 border-l-4 border-blue-500">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">
                                📝 إنشاء كورس جديد
                            </h2>
                            <form onSubmit={handleCreateCourse} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Title */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            عنوان الكورس *
                                        </label>
                                        <input
                                            type="text"
                                            name="title"
                                            value={formData.title}
                                            onChange={handleInputChange}
                                            placeholder="مثال: مقدمة إلى Laravel"
                                            required
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>

                                    {/* Level */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            المستوى *
                                        </label>
                                        <select
                                            name="level"
                                            value={formData.level}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        >
                                            <option value="beginner">مبتدئ</option>
                                            <option value="intermediate">متوسط</option>
                                            <option value="advanced">متقدم</option>
                                        </select>
                                    </div>

                                    {/* Price */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            السعر (0 = مجاني)
                                        </label>
                                        <input
                                            type="number"
                                            name="price"
                                            value={formData.price}
                                            onChange={handleInputChange}
                                            placeholder="49.99"
                                            step="0.01"
                                            min="0"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>
                                </div>

                                {/* Description */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        وصف الكورس *
                                    </label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        placeholder="اكتب وصفاً شاملاً للكورس..."
                                        rows="4"
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    ></textarea>
                                </div>

                                {/* Buttons */}
                                <div className="flex gap-4">
                                    <button
                                        type="submit"
                                        className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold"
                                    >
                                        ✅ إنشاء الكورس
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setShowCreateForm(false)}
                                        className="px-6 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition font-semibold"
                                    >
                                        ❌ إلغاء
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* Statistics Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        {/* Total Courses */}
                        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-500 text-sm">إجمالي الكورسات</p>
                                    <p className="text-3xl font-bold text-gray-900 mt-2">
                                        {courses.length}
                                    </p>
                                </div>
                                <span className="text-4xl">📚</span>
                            </div>
                        </div>

                        {/* Total Students */}
                        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-500 text-sm">إجمالي الطلاب</p>
                                    <p className="text-3xl font-bold text-gray-900 mt-2">
                                        {courses.reduce((sum, c) => sum + (c.students_count || 0), 0)}
                                    </p>
                                </div>
                                <span className="text-4xl">👥</span>
                            </div>
                        </div>

                        {/* Total Lessons */}
                        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-yellow-500">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-500 text-sm">إجمالي الدروس</p>
                                    <p className="text-3xl font-bold text-gray-900 mt-2">
                                        {stats.totalLessons}
                                    </p>
                                </div>
                                <span className="text-4xl">📖</span>
                            </div>
                        </div>

                        {/* Average Rating */}
                        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-purple-500">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-500 text-sm">متوسط التقييم</p>
                                    <p className="text-3xl font-bold text-gray-900 mt-2">
                                        {stats.averageRating.toFixed(1)} ⭐
                                    </p>
                                </div>
                                <span className="text-4xl">🏆</span>
                            </div>
                        </div>
                    </div>

                    {/* My Courses Section */}
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h2 className="text-2xl font-bold text-gray-900">
                                🎓 الكورسات الخاصة بي
                            </h2>
                        </div>

                        {loading ? (
                            <div className="px-6 py-12 text-center text-gray-500">
                                جاري التحميل...
                            </div>
                        ) : courses.length === 0 ? (
                            <div className="px-6 py-12 text-center">
                                <p className="text-gray-500 mb-4">لم تنشئ أي كورس بعد</p>
                                <button
                                    onClick={() => setShowCreateForm(true)}
                                    className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                                >
                                    ➕ إنشاء أول كورس لك
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                                {courses.map(course => (
                                    <div
                                        key={course.id}
                                        className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition"
                                    >
                                        {/* Course Header */}
                                        <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
                                            <h3 className="font-bold text-gray-900 mb-1">
                                                {course.title}
                                            </h3>
                                            <div className="flex justify-between items-center">
                                                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                                    {course.level === 'beginner' && '🟢 مبتدئ'}
                                                    {course.level === 'intermediate' && '🟡 متوسط'}
                                                    {course.level === 'advanced' && '🔴 متقدم'}
                                                </span>
                                                {course.price > 0 && (
                                                    <span className="text-sm font-semibold text-green-600">
                                                        ${course.price}
                                                    </span>
                                                )}
                                                {course.price === 0 && (
                                                    <span className="text-sm text-blue-600 font-semibold">
                                                        مجاني
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Course Info */}
                                        <div className="p-4">
                                            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                                                {course.description}
                                            </p>

                                            {/* Stats */}
                                            <div className="space-y-2 mb-4">
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-gray-600">👥 الطلاب:</span>
                                                    <span className="font-semibold">
                                                        {course.students_count || 0}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Actions */}
                                            <div className="flex gap-2">
                                                <Link
                                                    href={`/courses/${course.id}`}
                                                    className="flex-1 px-3 py-2 bg-blue-600 text-white text-center rounded hover:bg-blue-700 transition text-sm font-semibold"
                                                >
                                                    📖 عرض التفاصيل
                                                </Link>
                                                <button
                                                    onClick={() => deleteCourse(course.id)}
                                                    className="px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition text-sm font-semibold"
                                                >
                                                    🗑️
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Quick Actions */}
                    {courses.length > 0 && (
                        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Link
                                href="/courses"
                                className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-lg shadow hover:shadow-lg transition"
                            >
                                <h3 className="text-xl font-bold mb-2">📊 إحصائيات الكورسات</h3>
                                <p className="text-blue-100">عرض تفصيلي للأداء والنتائج</p>
                            </Link>

                            <Link
                                href="/profile"
                                className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-lg shadow hover:shadow-lg transition"
                            >
                                <h3 className="text-xl font-bold mb-2">👤 الملف الشخصي</h3>
                                <p className="text-green-100">عدّل بيانات ملفك الشخصي</p>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

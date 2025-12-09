import { useState, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function CoursesIndex() {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/courses');
            const data = await response.json();
            setCourses(data.data);
        } catch (err) {
            setError('حدث خطأ في تحميل الكورسات');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const enrollCourse = async (courseId) => {
        try {
            const response = await fetch(`/api/courses/${courseId}/enroll`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
                },
            });
            const data = await response.json();
            
            if (response.ok) {
                alert('تم التسجيل في الكورس بنجاح!');
                fetchCourses();
            } else {
                alert(data.message || 'حدث خطأ في التسجيل');
            }
        } catch (err) {
            alert('حدث خطأ في التسجيل');
            console.error(err);
        }
    };

    if (loading) {
        return (
            <AuthenticatedLayout>
                <Head title="الكورسات" />
                <div className="py-12">
                    <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                        <div className="text-center">جاري التحميل...</div>
                    </div>
                </div>
            </AuthenticatedLayout>
        );
    }

    return (
        <AuthenticatedLayout>
            <Head title="الكورسات المتاحة" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <h1 className="text-3xl font-bold mb-8 text-gray-900">
                                الكورسات المتاحة
                            </h1>

                            {error && (
                                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                                    {error}
                                </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {courses.map((course) => (
                                    <div key={course.id} className="bg-white border rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
                                        {course.image_url && (
                                            <img 
                                                src={course.image_url} 
                                                alt={course.title}
                                                className="w-full h-40 object-cover"
                                            />
                                        )}
                                        
                                        <div className="p-4">
                                            <h3 className="text-lg font-bold text-gray-900 mb-2">
                                                {course.title}
                                            </h3>

                                            <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                                                {course.description}
                                            </p>

                                            <div className="flex gap-2 mb-3 flex-wrap">
                                                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                                                    {course.level === 'beginner' ? 'مبتدئ' : course.level === 'intermediate' ? 'متوسط' : 'متقدم'}
                                                </span>
                                                <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                                                    {course.duration_hours} ساعة
                                                </span>
                                                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                                                    {course.students_count} طالب
                                                </span>
                                            </div>

                                            <div className="flex justify-between items-center">
                                                <span className="text-xl font-bold text-gray-900">
                                                    ${course.price}
                                                </span>
                                                <button
                                                    onClick={() => enrollCourse(course.id)}
                                                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                                                >
                                                    التسجيل
                                                </button>
                                            </div>

                                            <Link
                                                href={`/courses/${course.id}`}
                                                className="block mt-3 text-blue-600 hover:underline text-sm"
                                            >
                                                عرض التفاصيل →
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {courses.length === 0 && (
                                <div className="text-center py-12">
                                    <p className="text-gray-600">لا توجد كورسات متاحة حالياً</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

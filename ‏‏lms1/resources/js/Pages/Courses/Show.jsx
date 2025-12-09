import { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useRoute } from '@/composables/useRoute';

export default function CourseShow() {
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');
    const route = useRoute();

    useEffect(() => {
        const courseId = window.location.pathname.split('/')[2];
        fetchCourse(courseId);
    }, []);

    const fetchCourse = async (courseId) => {
        try {
            setLoading(true);
            const response = await fetch(`/api/courses/${courseId}`);
            const data = await response.json();
            setCourse(data.data);
        } catch (err) {
            console.error('خطأ في تحميل الكورس:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <AuthenticatedLayout>
                <Head title="تحميل الكورس..." />
                <div className="py-12">
                    <div className="text-center">جاري التحميل...</div>
                </div>
            </AuthenticatedLayout>
        );
    }

    if (!course) {
        return (
            <AuthenticatedLayout>
                <Head title="الكورس غير موجود" />
                <div className="py-12">
                    <div className="text-center text-red-600">الكورس غير موجود</div>
                </div>
            </AuthenticatedLayout>
        );
    }

    return (
        <AuthenticatedLayout>
            <Head title={course.title} />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* رأس الكورس */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg mb-6">
                        <div className="p-6">
                            {course.image_url && (
                                <img 
                                    src={course.image_url}
                                    alt={course.title}
                                    className="w-full h-64 object-cover rounded-lg mb-6"
                                />
                            )}

                            <h1 className="text-4xl font-bold text-gray-900 mb-4">
                                {course.title}
                            </h1>

                            <div className="flex flex-wrap gap-4 mb-6">
                                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded">
                                    {course.level === 'beginner' ? 'مبتدئ' : course.level === 'intermediate' ? 'متوسط' : 'متقدم'}
                                </span>
                                <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded">
                                    {course.duration_hours} ساعة
                                </span>
                                <span className="bg-green-100 text-green-800 px-3 py-1 rounded">
                                    {course.students_count} طالب مسجل
                                </span>
                            </div>

                            <div className="text-2xl font-bold text-gray-900 mb-6">
                                ${course.price}
                            </div>

                            <p className="text-gray-700 text-lg mb-6">
                                {course.description}
                            </p>
                        </div>
                    </div>

                    {/* التبويبات */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="border-b border-gray-200">
                            <div className="flex">
                                {['overview', 'lessons', 'quizzes'].map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        className={`flex-1 py-4 px-6 text-center font-medium transition ${
                                            activeTab === tab
                                                ? 'border-b-2 border-blue-600 text-blue-600'
                                                : 'text-gray-600 hover:text-gray-900'
                                        }`}
                                    >
                                        {tab === 'overview' ? 'نظرة عامة' : tab === 'lessons' ? 'الدروس' : 'الاختبارات'}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="p-6">
                            {activeTab === 'overview' && (
                                <div>
                                    <h3 className="text-xl font-bold mb-4">ستتعلم</h3>
                                    <ul className="space-y-2 mb-6">
                                        {course.what_you_will_learn?.split(' - ').map((item, idx) => (
                                            <li key={idx} className="flex items-start">
                                                <span className="text-green-600 mr-3">✓</span>
                                                <span className="text-gray-700">{item}</span>
                                            </li>
                                        ))}
                                    </ul>

                                    <h3 className="text-xl font-bold mb-4">المتطلبات</h3>
                                    <ul className="space-y-2">
                                        {course.requirements?.split(' - ').map((item, idx) => (
                                            <li key={idx} className="flex items-start">
                                                <span className="text-blue-600 mr-3">•</span>
                                                <span className="text-gray-700">{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {activeTab === 'lessons' && (
                                <div>
                                    <h3 className="text-xl font-bold mb-4">الدروس ({course.lessons?.length || 0})</h3>
                                    <div className="space-y-2">
                                        {course.lessons?.map((lesson, idx) => (
                                            <div key={lesson.id} className="p-4 border rounded hover:bg-gray-50">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <p className="font-medium text-gray-900">
                                                            {idx + 1}. {lesson.title}
                                                        </p>
                                                        <p className="text-sm text-gray-600 mt-1">
                                                            {lesson.duration_minutes} دقيقة
                                                        </p>
                                                    </div>
                                                    {lesson.is_free && (
                                                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                                                            مجاني
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {activeTab === 'quizzes' && (
                                <div>
                                    <h3 className="text-xl font-bold mb-4">الاختبارات ({course.quizzes?.length || 0})</h3>
                                    <div className="space-y-2">
                                        {course.quizzes?.map((quiz) => (
                                            <div key={quiz.id} className="p-4 border rounded hover:bg-gray-50">
                                                <p className="font-medium text-gray-900">{quiz.title}</p>
                                                <p className="text-sm text-gray-600 mt-1">
                                                    {quiz.questions?.length || 0} سؤال • {quiz.duration_minutes} دقيقة
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

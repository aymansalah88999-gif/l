import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import CourseBuilder from '@/Components/CourseBuilder/CourseBuilder';

export default function AddCourse() {
    return (
        <AuthenticatedLayout>
            <Head title="إنشاء كورس جديد" />

            <div className="py-12">
                <div className="mx-auto max-w-5xl sm:px-6 lg:px-8">
                    <div className="mb-6 flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold">إنشاء كورس جديد</h1>
                            <p className="text-gray-600">استخدم منشئ الكورسات المتقدم لبناء محتوى تفاعلي</p>
                        </div>
                        <Link href="/instructor" className="text-sm text-blue-600">رجوع إلى لوحة المدرس</Link>
                    </div>

                    <div className="bg-white shadow rounded-lg p-6">
                        <CourseBuilder onSaved={(resp) => {
                            // بعد الحفظ نعيد التوجيه إلى صفحة الكورس أو لوحة المدرس
                            if (resp?.data?.id) {
                                window.location.href = `/courses/${resp.data.id}`;
                                return;
                            }
                            alert('تم الحفظ');
                        }} />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

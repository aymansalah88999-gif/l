import { Link, Head } from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';

export default function Welcome({ canLogin, canRegister, laravelVersion, phpVersion }) {
    return (
        <GuestLayout>
            <Head title="Welcome" />

            <div className="flex flex-col items-center justify-center">
                <div className="w-full max-w-md">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="px-4 py-6 bg-white sm:px-6">
                            <h1 className="text-3xl font-bold text-center mb-6 text-gray-900">
                                مرحبًا بك في منصة LMS
                            </h1>

                            <p className="text-center text-gray-600 mb-8">
                                منصة إدارة التعلم الإلكتروني
                            </p>

                            <div className="space-y-4">
                                {canLogin && (
                                    <Link
                                        href={route('login')}
                                        className="w-full px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 text-center block transition"
                                    >
                                        تسجيل الدخول
                                    </Link>
                                )}

                                {canRegister && (
                                    <Link
                                        href={route('register')}
                                        className="w-full px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 text-center block transition"
                                    >
                                        إنشاء حساب جديد
                                    </Link>
                                )}
                            </div>

                            <p className="mt-6 text-center text-sm text-gray-600">
                                بعد تسجيل الدخول، سيتم توجيهك تلقائيًا إلى لوحة التحكم الخاصة بك.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </GuestLayout>
    );
}

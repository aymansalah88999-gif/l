import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        role: 'student',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    const roles = [
        { value: 'student', label: '👤 طالب', description: 'للدراسة والتعلم من الكورسات' },
        { value: 'instructor', label: '👨‍🏫 مدرس', description: 'لإنشاء وإدارة الكورسات' },
        { value: 'admin', label: '🔐 إداري', description: 'لإدارة النظام والمستخدمين' },
    ];

    return (
        <GuestLayout>
            <Head title="تسجيل جديد" />

            <div className="max-w-md mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-2 text-center">
                    🎓 منصة LMS
                </h1>
                <p className="text-gray-600 text-center mb-6">
                    أنشئ حساباً جديداً للبدء
                </p>

                <form onSubmit={submit} className="space-y-4">
                    {/* الاسم */}
                    <div>
                        <InputLabel htmlFor="name" value="الاسم الكامل *" />
                        <TextInput
                            id="name"
                            name="name"
                            value={data.name}
                            className="mt-1 block w-full"
                            autoComplete="name"
                            isFocused={true}
                            onChange={(e) => setData('name', e.target.value)}
                            placeholder="أحمد محمد"
                            required
                        />
                        <InputError message={errors.name} className="mt-2" />
                    </div>

                    {/* البريد الإلكتروني */}
                    <div>
                        <InputLabel htmlFor="email" value="البريد الإلكتروني *" />
                        <TextInput
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            className="mt-1 block w-full"
                            autoComplete="username"
                            onChange={(e) => setData('email', e.target.value)}
                            placeholder="example@email.com"
                            required
                        />
                        <InputError message={errors.email} className="mt-2" />
                    </div>

                    {/* كلمة المرور */}
                    <div>
                        <InputLabel htmlFor="password" value="كلمة المرور *" />
                        <TextInput
                            id="password"
                            type="password"
                            name="password"
                            value={data.password}
                            className="mt-1 block w-full"
                            autoComplete="new-password"
                            onChange={(e) => setData('password', e.target.value)}
                            placeholder="••••••••"
                            required
                        />
                        <InputError message={errors.password} className="mt-2" />
                    </div>

                    {/* تأكيد كلمة المرور */}
                    <div>
                        <InputLabel htmlFor="password_confirmation" value="تأكيد كلمة المرور *" />
                        <TextInput
                            id="password_confirmation"
                            type="password"
                            name="password_confirmation"
                            value={data.password_confirmation}
                            className="mt-1 block w-full"
                            autoComplete="new-password"
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            placeholder="••••••••"
                            required
                        />
                        <InputError message={errors.password_confirmation} className="mt-2" />
                    </div>

                    {/* اختيار الدور */}
                    <div>
                        <InputLabel value="اختر دورك *" />
                        <div className="mt-3 space-y-2">
                            {roles.map((role) => (
                                <label
                                    key={role.value}
                                    className={`flex items-center p-3 border-2 rounded-lg cursor-pointer transition ${
                                        data.role === role.value
                                            ? 'border-blue-500 bg-blue-50'
                                            : 'border-gray-300 hover:border-gray-400'
                                    }`}
                                >
                                    <input
                                        type="radio"
                                        name="role"
                                        value={role.value}
                                        checked={data.role === role.value}
                                        onChange={(e) => setData('role', e.target.value)}
                                        className="w-4 h-4 text-blue-600"
                                        required
                                    />
                                    <div className="ms-3">
                                        <p className="font-semibold text-gray-900">
                                            {role.label}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            {role.description}
                                        </p>
                                    </div>
                                </label>
                            ))}
                        </div>
                        <InputError message={errors.role} className="mt-2" />
                    </div>

                    {/* الأزرار */}
                    <div className="mt-6 flex flex-col gap-4">
                        <PrimaryButton
                            className="w-full justify-center"
                            disabled={processing}
                        >
                            {processing ? 'جاري التسجيل...' : 'إنشاء الحساب'}
                        </PrimaryButton>

                        <Link
                            href={route('login')}
                            className="text-center text-sm text-gray-600 hover:text-gray-900 underline"
                        >
                            لديك حساب بالفعل؟ سجّل الدخول
                        </Link>
                    </div>
                </form>
            </div>        </GuestLayout>
    );
}
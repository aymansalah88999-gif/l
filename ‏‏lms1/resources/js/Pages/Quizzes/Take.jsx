import { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function QuizTake() {
    const [quiz, setQuiz] = useState(null);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState({});
    const [loading, setLoading] = useState(true);
    const [submitted, setSubmitted] = useState(false);
    const [result, setResult] = useState(null);

    useEffect(() => {
        const quizId = window.location.pathname.split('/')[2];
        startQuiz(quizId);
    }, []);

    const startQuiz = async (quizId) => {
        try {
            setLoading(true);
            const response = await fetch(`/api/quizzes/${quizId}/start`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
                },
            });
            const data = await response.json();
            setQuiz(data.data);
        } catch (err) {
            console.error('خطأ:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleAnswerSelect = (questionId, answerId) => {
        setAnswers({
            ...answers,
            [questionId]: answerId,
        });
    };

    const handleSubmitQuiz = async () => {
        try {
            // إرسال جميع الإجابات
            for (const [questionId, answerId] of Object.entries(answers)) {
                await fetch(`/api/quizzes/${quiz.id}/submit-answer`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
                    },
                    body: JSON.stringify({
                        quiz_result_id: quiz.id,
                        question_id: questionId,
                        answer_id: answerId,
                    }),
                });
            }

            // إكمال الاختبار والحصول على النتيجة
            const response = await fetch(`/api/quizzes/${quiz.id}/complete`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
                },
                body: JSON.stringify({
                    quiz_result_id: quiz.id,
                }),
            });
            const data = await response.json();
            setResult(data.data);
            setSubmitted(true);
        } catch (err) {
            console.error('خطأ:', err);
            alert('حدث خطأ في إرسال الاختبار');
        }
    };

    if (loading) {
        return (
            <AuthenticatedLayout>
                <Head title="تحميل الاختبار..." />
                <div className="py-12 text-center">جاري التحميل...</div>
            </AuthenticatedLayout>
        );
    }

    if (!quiz) {
        return (
            <AuthenticatedLayout>
                <Head title="خطأ" />
                <div className="py-12 text-center text-red-600">حدث خطأ في تحميل الاختبار</div>
            </AuthenticatedLayout>
        );
    }

    if (submitted && result) {
        const percentage = result.percentage.toFixed(2);
        const passed = result.passed;

        return (
            <AuthenticatedLayout>
                <Head title="نتيجة الاختبار" />

                <div className="py-12">
                    <div className="mx-auto max-w-4xl sm:px-6 lg:px-8">
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6 text-center">
                                <h1 className="text-3xl font-bold mb-4">نتيجة الاختبار</h1>

                                <div className={`text-6xl font-bold mb-6 ${passed ? 'text-green-600' : 'text-red-600'}`}>
                                    {percentage}%
                                </div>

                                <h2 className={`text-2xl font-bold mb-6 ${passed ? 'text-green-600' : 'text-red-600'}`}>
                                    {passed ? 'تهانينا! لقد نجحت ✓' : 'للأسف، لم تتمكن من النجاح'}
                                </h2>

                                <div className="grid grid-cols-2 gap-4 mb-8 max-w-md mx-auto">
                                    <div className="bg-blue-50 p-4 rounded">
                                        <p className="text-gray-600">الإجابات الصحيحة</p>
                                        <p className="text-2xl font-bold text-blue-600">
                                            {result.earned_points}/{result.total_points}
                                        </p>
                                    </div>
                                    <div className="bg-purple-50 p-4 rounded">
                                        <p className="text-gray-600">نسبة النجاح المطلوبة</p>
                                        <p className="text-2xl font-bold text-purple-600">
                                            {quiz.pass_percentage}%
                                        </p>
                                    </div>
                                </div>

                                <button
                                    onClick={() => window.history.back()}
                                    className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
                                >
                                    العودة للكورس
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </AuthenticatedLayout>
        );
    }

    const question = quiz.questions?.[currentQuestion];
    const progress = ((currentQuestion + 1) / (quiz.questions?.length || 1)) * 100;

    return (
        <AuthenticatedLayout>
            <Head title={quiz.title} />

            <div className="py-12">
                <div className="mx-auto max-w-4xl sm:px-6 lg:px-8">
                    {/* شريط التقدم */}
                    <div className="mb-6">
                        <div className="flex justify-between mb-2">
                            <span className="text-sm font-medium text-gray-700">
                                السؤال {currentQuestion + 1} من {quiz.questions?.length || 0}
                            </span>
                            <span className="text-sm font-medium text-gray-700">{Math.round(progress)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                                className="bg-blue-600 h-2 rounded-full transition-all"
                                style={{ width: `${progress}%` }}
                            ></div>
                        </div>
                    </div>

                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-8">
                        {/* السؤال */}
                        <h2 className="text-2xl font-bold text-gray-900 mb-8">
                            {question?.question_text}
                        </h2>

                        {/* الإجابات */}
                        <div className="space-y-3 mb-8">
                            {question?.answers?.map((answer) => (
                                <label key={answer.id} className="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition">
                                    <input
                                        type="radio"
                                        name={`question-${question.id}`}
                                        value={answer.id}
                                        checked={answers[question.id] === answer.id}
                                        onChange={() => handleAnswerSelect(question.id, answer.id)}
                                        className="w-4 h-4"
                                    />
                                    <span className="ml-4 text-gray-800">{answer.answer_text}</span>
                                </label>
                            ))}
                        </div>

                        {/* الأزرار */}
                        <div className="flex justify-between">
                            <button
                                onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
                                disabled={currentQuestion === 0}
                                className="px-6 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 disabled:opacity-50"
                            >
                                السؤال السابق
                            </button>

                            {currentQuestion < (quiz.questions?.length || 0) - 1 ? (
                                <button
                                    onClick={() => setCurrentQuestion(currentQuestion + 1)}
                                    className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                >
                                    السؤال التالي
                                </button>
                            ) : (
                                <button
                                    onClick={handleSubmitQuiz}
                                    className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                                >
                                    إنهاء الاختبار
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

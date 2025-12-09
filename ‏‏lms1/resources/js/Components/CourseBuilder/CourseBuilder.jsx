import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AVAILABLE_FONTS = [
    { key: 'inherit', label: 'المُعرّف الافتراضي' },
    { key: 'Noto+Sans+Arabic', label: 'Noto Sans Arabic' },
    { key: 'Cairo', label: 'Cairo' },
    { key: 'Amiri', label: 'Amiri' },
    { key: 'Tajawal', label: 'Tajawal' },
    { key: 'Arial', label: 'Arial' },
];

function loadGoogleFont(fontKey) {
    if (!fontKey || fontKey === 'inherit') return;
    const href = `https://fonts.googleapis.com/css2?family=${fontKey}:wght@400;700&display=swap`;
    if (document.querySelector(`link[href="${href}"]`)) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    document.head.appendChild(link);
}

export default function CourseBuilder({ onSaved }) {
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);

    const [course, setCourse] = useState({
        title: '',
        description: '',
        level: 'beginner',
        price: 0,
        sections: [],
        quizzes: [],
    });

    useEffect(() => {
        // preload default font
        loadGoogleFont('Noto+Sans+Arabic');
    }, []);

    const update = (patch) => setCourse(prev => ({ ...prev, ...patch }));

    const addSection = () => {
        setCourse(prev => ({
            ...prev,
            sections: [...prev.sections, { id: Date.now(), title: '', lectures: [] }]
        }));
    };

    const addLecture = (sectionId) => {
        setCourse(prev => ({
            ...prev,
            sections: prev.sections.map(s => s.id === sectionId ? ({
                ...s,
                lectures: [...s.lectures, { id: Date.now(), title: '', content: '' }]
            }) : s)
        }));
    };

    const addQuiz = () => {
        setCourse(prev => ({
            ...prev,
            quizzes: [...prev.quizzes, { id: Date.now(), title: '', questions: [] }]
        }));
    };

    const addQuestion = (quizId) => {
        setCourse(prev => ({
            ...prev,
            quizzes: prev.quizzes.map(q => q.id === quizId ? ({
                ...q,
                questions: [...q.questions, { id: Date.now(), text: '', type: 'mcq', options: [], font: 'inherit' }]
            }) : q)
        }));
    };

    const updateQuestion = (quizId, questionId, patch) => {
        const q = course.quizzes.map(qz => qz.id === quizId ? ({
            ...qz,
            questions: qz.questions.map(qn => qn.id === questionId ? ({ ...qn, ...patch }) : qn)
        }) : qz);
        setCourse(prev => ({ ...prev, quizzes: q }));
    };

    const addOption = (quizId, questionId) => {
        setCourse(prev => ({
            ...prev,
            quizzes: prev.quizzes.map(qz => qz.id === quizId ? ({
                ...qz,
                questions: qz.questions.map(qn => qn.id === questionId ? ({
                    ...qn,
                    options: [...(qn.options || []), { id: Date.now(), text: '', correct: false }]
                }) : qn)
            }) : qz)
        }));
    };

    const updateOption = (quizId, questionId, optionId, patch) => {
        setCourse(prev => ({
            ...prev,
            quizzes: prev.quizzes.map(qz => qz.id === quizId ? ({
                ...qz,
                questions: qz.questions.map(qn => qn.id === questionId ? ({
                    ...qn,
                    options: qn.options.map(op => op.id === optionId ? ({ ...op, ...patch }) : op)
                }) : qn)
            }) : qz)
        }));
    };

    const removeSection = (id) => setCourse(prev => ({ ...prev, sections: prev.sections.filter(s => s.id !== id) }));

    const handleSubmit = async (e) => {
        e && e.preventDefault();
        setSaving(true);
        setError(null);
        try {
            const payload = { ...course };
            // API expects nested arrays; send to LMS endpoint
            const url = '/api/lms/courses';
            const resp = await axios.post(url, payload);
            setSaving(false);
            if (onSaved) onSaved(resp.data);
            alert('تم حفظ الكورس بنجاح');
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'خطأ أثناء الحفظ');
            setSaving(false);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold mb-4">منشئ الكورسات المتقدم</h2>

            {error && <div className="mb-4 text-red-600">{error}</div>}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">عنوان الكورس</label>
                        <input className="w-full border rounded px-3 py-2" value={course.title} onChange={e => update({ title: e.target.value })} required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">المستوى</label>
                        <select className="w-full border rounded px-3 py-2" value={course.level} onChange={e => update({ level: e.target.value })}>
                            <option value="beginner">مبتدئ</option>
                            <option value="intermediate">متوسط</option>
                            <option value="advanced">متقدم</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">وصف الكورس</label>
                    <textarea className="w-full border rounded px-3 py-2" rows={4} value={course.description} onChange={e => update({ description: e.target.value })} />
                </div>

                <div>
                    <h3 className="font-semibold mb-2">الأقسام والدروس</h3>
                    <div className="space-y-4">
                        {course.sections.map(section => (
                            <div key={section.id} className="border rounded p-3">
                                <div className="flex justify-between items-center mb-2">
                                    <input className="w-3/4 border rounded px-2 py-1" placeholder="عنوان القسم" value={section.title} onChange={e => setCourse(prev => ({
                                        ...prev,
                                        sections: prev.sections.map(s => s.id === section.id ? ({ ...s, title: e.target.value }) : s)
                                    }))} />
                                    <div className="flex gap-2">
                                        <button type="button" className="px-3 py-1 bg-green-500 text-white rounded" onClick={() => addLecture(section.id)}>إضافة درس</button>
                                        <button type="button" className="px-3 py-1 bg-red-500 text-white rounded" onClick={() => removeSection(section.id)}>حذف</button>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    {(section.lectures || []).map(lec => (
                                        <div key={lec.id} className="p-2 border rounded">
                                            <input className="w-full border rounded px-2 py-1 mb-2" placeholder="عنوان الدرس" value={lec.title} onChange={e => setCourse(prev => ({
                                                ...prev,
                                                sections: prev.sections.map(s => s.id === section.id ? ({
                                                    ...s,
                                                    lectures: s.lectures.map(l => l.id === lec.id ? ({ ...l, title: e.target.value }) : l)
                                                }) : s)
                                            }))} />
                                            <textarea className="w-full border rounded px-2 py-1" rows={3} placeholder="محتوى الدرس" value={lec.content} onChange={e => setCourse(prev => ({
                                                ...prev,
                                                sections: prev.sections.map(s => s.id === section.id ? ({
                                                    ...s,
                                                    lectures: s.lectures.map(l => l.id === lec.id ? ({ ...l, content: e.target.value }) : l)
                                                }) : s)
                                            }))} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}

                        <div>
                            <button type="button" onClick={addSection} className="px-4 py-2 bg-blue-600 text-white rounded">+ إضافة قسم</button>
                        </div>
                    </div>
                </div>

                <div>
                    <h3 className="font-semibold mb-2">الاختبارات</h3>
                    <div className="space-y-4">
                        {course.quizzes.map(quiz => (
                            <div key={quiz.id} className="border rounded p-3">
                                <div className="flex justify-between items-center mb-2">
                                    <input className="w-3/4 border rounded px-2 py-1" placeholder="عنوان الاختبار" value={quiz.title} onChange={e => setCourse(prev => ({
                                        ...prev,
                                        quizzes: prev.quizzes.map(q => q.id === quiz.id ? ({ ...q, title: e.target.value }) : q)
                                    }))} />
                                    <button type="button" onClick={() => addQuestion(quiz.id)} className="px-3 py-1 bg-green-500 text-white rounded">+ سؤال</button>
                                </div>

                                <div className="space-y-3">
                                    {quiz.questions.map(qn => (
                                        <div key={qn.id} className="p-2 border rounded">
                                            <div className="flex gap-2 mb-2 items-start">
                                                <textarea style={{ fontFamily: qn.font && qn.font !== 'inherit' ? qn.font.replace('+',' ') : undefined }} className="flex-1 border rounded p-2" rows={2} value={qn.text} onChange={e => updateQuestion(quiz.id, qn.id, { text: e.target.value })} placeholder="نص السؤال" />

                                                <div className="w-48">
                                                    <label className="text-xs text-gray-600">خط السؤال</label>
                                                    <select value={qn.font} onChange={e => {
                                                        const fontKey = e.target.value;
                                                        updateQuestion(quiz.id, qn.id, { font: fontKey });
                                                        if (fontKey && fontKey !== 'inherit') loadGoogleFont(fontKey);
                                                    }} className="w-full border rounded mt-1 p-1">
                                                        {AVAILABLE_FONTS.map(f => (
                                                            <option key={f.key} value={f.key}>{f.label}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                {(qn.options || []).map(opt => (
                                                    <div key={opt.id} className="flex items-center gap-2">
                                                        <input className="flex-1 border rounded px-2 py-1" value={opt.text} onChange={e => updateOption(quiz.id, qn.id, opt.id, { text: e.target.value })} placeholder="خيار" />
                                                        <label className="flex items-center gap-1 text-sm">
                                                            <input type="checkbox" checked={opt.correct} onChange={e => updateOption(quiz.id, qn.id, opt.id, { correct: e.target.checked })} /> صحيح
                                                        </label>
                                                    </div>
                                                ))}

                                                <div className="flex gap-2">
                                                    <button type="button" onClick={() => addOption(quiz.id, qn.id)} className="px-3 py-1 bg-blue-500 text-white rounded">+ خيار</button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}

                        <div>
                            <button type="button" onClick={addQuiz} className="px-4 py-2 bg-indigo-600 text-white rounded">+ إضافة اختبار</button>
                        </div>
                    </div>
                </div>

                <div className="flex gap-3">
                    <button type="submit" disabled={saving} className="px-6 py-2 bg-green-600 text-white rounded">{saving ? 'جاري الحفظ...' : 'حفظ الكورس'}</button>
                    <button type="button" onClick={() => { setCourse({ title: '', description: '', level: 'beginner', price: 0, sections: [], quizzes: [] }); }} className="px-6 py-2 bg-gray-400 text-white rounded">تفريغ النموذج</button>
                </div>
            </form>
        </div>
    );
}

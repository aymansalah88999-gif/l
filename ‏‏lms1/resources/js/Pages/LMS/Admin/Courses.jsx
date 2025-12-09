import React, {useEffect, useState} from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import axios from 'axios';

export default function AdminCourses() {
    const [courses, setCourses] = useState([]);

    useEffect(() => {
        axios.get('/api/lms/courses').then(res => setCourses(res.data.data || res.data)).catch(err => console.error(err));
    }, []);

    return (
        <AuthenticatedLayout>
            <div className="p-6">
                <h1 className="text-2xl font-bold">All Courses (Admin)</h1>
                <ul>
                    {courses.map(c => (
                        <li key={c.id}>{c.title} — {c.status}</li>
                    ))}
                </ul>
            </div>
        </AuthenticatedLayout>
    );
}

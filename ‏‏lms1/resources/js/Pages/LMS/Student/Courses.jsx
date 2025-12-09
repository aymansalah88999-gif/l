import React, {useEffect, useState} from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import axios from 'axios';

export default function StudentCourses() {
    const [courses, setCourses] = useState([]);

    useEffect(() => {
        axios.get('/api/lms/my/enrollments').then(res => setCourses(res.data.data || res.data)).catch(err => console.error(err));
    }, []);

    return (
        <AuthenticatedLayout>
            <div className="p-6">
                <h1 className="text-2xl font-bold">My Enrolled Courses (Student)</h1>
                <ul>
                    {courses.map(e => (
                        <li key={e.id}>{e.course.title} — {e.completion_percentage}%</li>
                    ))}
                </ul>
            </div>
        </AuthenticatedLayout>
    );
}

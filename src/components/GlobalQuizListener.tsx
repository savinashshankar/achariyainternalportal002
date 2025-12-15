import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { listenForActiveQuiz, LiveQuizSession } from '../services/liveQuizService';

const GlobalQuizListener = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const student = JSON.parse(localStorage.getItem('studentData') || '{}')[1] || {};

    const [hasRedirected, setHasRedirected] = useState<string | null>(null);

    // Only run for students
    const isStudent = user.selectedRole === 'Student' || user.role === 'Student';
    const studentClass = student.class || '8-A';

    useEffect(() => {
        if (!isStudent) return;

        // Skip if already on quiz page
        if (location.pathname.includes('/live-quiz/')) return;

        const unsubscribe = listenForActiveQuiz(studentClass, (quiz) => {
            if (quiz && quiz.id && quiz.status === 'active') {
                const now = Date.now();
                const quizEndTime = quiz.endTime.toDate().getTime();

                // Quiz expired - ignore
                if (now > quizEndTime) {
                    return;
                }

                // INSTANT REDIRECT: If not already redirected to this quiz
                if (hasRedirected !== quiz.id) {
                    console.log('🚀 INSTANT REDIRECT TO QUIZ!', quiz.id);
                    setHasRedirected(quiz.id || null);
                    navigate(`/student/live-quiz/${quiz.id}/take`);
                }
            }
        });

        return () => unsubscribe();
    }, [isStudent, studentClass, hasRedirected, location.pathname, navigate]);

    return null; // No UI - just instant redirect
};

export default GlobalQuizListener;

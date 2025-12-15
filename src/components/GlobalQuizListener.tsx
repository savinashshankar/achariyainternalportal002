import { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { listenForActiveQuiz } from '../services/liveQuizService';

const GlobalQuizListener = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const student = JSON.parse(localStorage.getItem('studentData') || '{}')[1] || {};

    const [hasRedirected, setHasRedirected] = useState<string | null>(null);
    const isFirstLoad = useRef(true);

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
                const quizStartTime = quiz.startTime.toDate().getTime();
                const quizEndTime = quiz.endTime.toDate().getTime();
                const timeSinceStart = now - quizStartTime;

                // Quiz expired - ignore
                if (now > quizEndTime) {
                    isFirstLoad.current = false;
                    return;
                }

                // ONLY redirect if:
                // 1. Quiz JUST started (< 5 seconds ago) - teacher just clicked Start
                // 2. Not already redirected to this quiz
                // 3. Not first page load with stale quiz
                if (timeSinceStart < 5000 && hasRedirected !== quiz.id && !isFirstLoad.current) {
                    console.log('🚀 TEACHER STARTED QUIZ - INSTANT REDIRECT!', quiz.id);
                    setHasRedirected(quiz.id || null);
                    navigate(`/student/live-quiz/${quiz.id}/take`);
                } else if (timeSinceStart < 5000 && hasRedirected !== quiz.id && isFirstLoad.current) {
                    // First load but quiz just started - redirect (student was already logged in)
                    console.log('🚀 QUIZ JUST STARTED ON LOAD - REDIRECT!', quiz.id);
                    setHasRedirected(quiz.id || null);
                    navigate(`/student/live-quiz/${quiz.id}/take`);
                }

                isFirstLoad.current = false;
            } else {
                isFirstLoad.current = false;
            }
        });

        return () => unsubscribe();
    }, [isStudent, studentClass, hasRedirected, location.pathname, navigate]);

    return null; // No UI - just instant redirect on teacher trigger
};

export default GlobalQuizListener;

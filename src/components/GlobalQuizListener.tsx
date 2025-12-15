import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { listenForActiveQuiz, LiveQuizSession } from '../services/liveQuizService';

const GlobalQuizListener = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const student = JSON.parse(localStorage.getItem('studentData') || '{}')[1] || {};

    const [activeQuiz, setActiveQuiz] = useState<LiveQuizSession | null>(null);
    const [hasRedirected, setHasRedirected] = useState<string | null>(null);
    const [showBanner, setShowBanner] = useState(false);

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

                // Quiz expired
                if (now > quizEndTime) {
                    setActiveQuiz(null);
                    setShowBanner(false);
                    return;
                }

                console.log('🔴 GLOBAL QUIZ DETECTED:', {
                    id: quiz.id,
                    timeSinceStart: Math.floor(timeSinceStart / 1000) + 's',
                    hasRedirected,
                    currentPage: location.pathname
                });

                // INSTANT REDIRECT: Quiz just started (< 30 seconds) and not yet redirected
                if (timeSinceStart < 30000 && hasRedirected !== quiz.id) {
                    console.log('🚀 INSTANT REDIRECT TO QUIZ!');
                    setHasRedirected(quiz.id || null);
                    navigate(`/student/live-quiz/${quiz.id}/take`);
                } else if (timeSinceStart >= 30000 && hasRedirected !== quiz.id) {
                    // Late joiner - show banner
                    console.log('📢 SHOWING JOIN BANNER');
                    setActiveQuiz(quiz);
                    setShowBanner(true);
                }
            } else {
                setActiveQuiz(null);
                setShowBanner(false);
            }
        });

        return () => unsubscribe();
    }, [isStudent, studentClass, hasRedirected, location.pathname, navigate]);

    const handleJoinQuiz = () => {
        if (activeQuiz) {
            setHasRedirected(activeQuiz.id || null);
            setShowBanner(false);
            navigate(`/student/live-quiz/${activeQuiz.id}/take`);
        }
    };

    const handleDismiss = () => {
        setShowBanner(false);
        if (activeQuiz) {
            setHasRedirected(activeQuiz.id || null);
        }
    };

    if (!showBanner || !activeQuiz) return null;

    return (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 animate-bounce">
            <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-4">
                <div className="text-3xl">🔴</div>
                <div>
                    <p className="font-bold text-lg">LIVE QUIZ IN PROGRESS!</p>
                    <p className="text-sm opacity-90">Class {activeQuiz.classId}</p>
                </div>
                <button
                    onClick={handleJoinQuiz}
                    className="bg-white text-red-600 px-4 py-2 rounded-lg font-bold hover:bg-gray-100 transition"
                >
                    JOIN NOW
                </button>
                <button
                    onClick={handleDismiss}
                    className="text-white/70 hover:text-white text-xl"
                >
                    ✕
                </button>
            </div>
        </div>
    );
};

export default GlobalQuizListener;

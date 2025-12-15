import { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { listenForActiveQuiz } from '../services/liveQuizService';

interface ActiveQuiz {
    id: string;
    classId: string;
    endTime: Date;
    remainingSeconds: number;
}

const GlobalQuizListener = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const student = JSON.parse(localStorage.getItem('studentData') || '{}')[1] || {};

    const [hasRedirected, setHasRedirected] = useState<string | null>(null);
    const [showBanner, setShowBanner] = useState(false);
    const [activeQuiz, setActiveQuiz] = useState<ActiveQuiz | null>(null);
    const isFirstLoad = useRef(true);
    const lastKnownQuizId = useRef<string | null>(null);

    // Only run for students
    const isStudent = user.selectedRole === 'Student' || user.role === 'Student';
    const studentClass = student.class || '8-A';

    useEffect(() => {
        if (!isStudent) return;

        // Skip if already on quiz page
        if (location.pathname.includes('/live-quiz/')) {
            setShowBanner(false);
            return;
        }

        const unsubscribe = listenForActiveQuiz(studentClass, (quiz) => {
            if (quiz && quiz.id && quiz.status === 'active') {
                const now = Date.now();
                const quizStartTime = quiz.startTime.toDate().getTime();
                const quizEndTime = quiz.endTime.toDate().getTime();
                const timeSinceStart = now - quizStartTime;
                const remainingMs = quizEndTime - now;

                // Quiz expired - ignore
                if (now > quizEndTime) {
                    isFirstLoad.current = false;
                    lastKnownQuizId.current = quiz.id || null;
                    setShowBanner(false);
                    setActiveQuiz(null);
                    return;
                }

                // Check if this is a NEW quiz (teacher just started)
                const isNewQuiz = lastKnownQuizId.current !== quiz.id;

                console.log('📡 QUIZ DETECTED:', {
                    id: quiz.id,
                    timeSinceStart: Math.floor(timeSinceStart / 1000) + 's',
                    remainingTime: Math.floor(remainingMs / 1000) + 's',
                    isNewQuiz,
                    isFirstLoad: isFirstLoad.current,
                    hasRedirected
                });

                // CASE 1: Already logged in + teacher JUST started quiz (< 10 seconds)
                // → INSTANT REDIRECT
                if (isNewQuiz && timeSinceStart < 10000 && hasRedirected !== quiz.id) {
                    console.log('🚀 TEACHER STARTED QUIZ - AUTO REDIRECT!');
                    setHasRedirected(quiz.id || null);
                    lastKnownQuizId.current = quiz.id || null;
                    setShowBanner(false);
                    navigate(`/student/live-quiz/${quiz.id}/take`);
                }
                // CASE 2: Late joiner (quiz started > 10 seconds ago OR first load with existing quiz)
                // → SHOW JOIN BANNER
                else if (hasRedirected !== quiz.id) {
                    console.log('⏰ ONGOING QUIZ - SHOWING JOIN BANNER');
                    lastKnownQuizId.current = quiz.id || null;
                    setActiveQuiz({
                        id: quiz.id || '',
                        classId: quiz.classId,
                        endTime: quiz.endTime.toDate(),
                        remainingSeconds: Math.floor(remainingMs / 1000)
                    });
                    setShowBanner(true);
                }

                isFirstLoad.current = false;
            } else {
                // No active quiz
                isFirstLoad.current = false;
                setShowBanner(false);
                setActiveQuiz(null);
            }
        });

        return () => unsubscribe();
    }, [isStudent, studentClass, hasRedirected, location.pathname, navigate]);

    const handleJoinQuiz = () => {
        if (activeQuiz) {
            setHasRedirected(activeQuiz.id);
            setShowBanner(false);
            navigate(`/student/live-quiz/${activeQuiz.id}/take`);
        }
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    // Update remaining time every second
    useEffect(() => {
        if (!activeQuiz) return;

        const interval = setInterval(() => {
            const now = Date.now();
            const remaining = Math.floor((activeQuiz.endTime.getTime() - now) / 1000);

            if (remaining <= 0) {
                setShowBanner(false);
                setActiveQuiz(null);
            } else {
                setActiveQuiz(prev => prev ? { ...prev, remainingSeconds: remaining } : null);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [activeQuiz?.id]);

    if (!showBanner || !activeQuiz) return null;

    return (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 animate-bounce">
            <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-4">
                <div className="text-3xl animate-pulse">🔴</div>
                <div>
                    <p className="font-bold text-lg">LIVE QUIZ IN PROGRESS!</p>
                    <p className="text-sm opacity-90">
                        Time Remaining: <span className="font-bold">{formatTime(activeQuiz.remainingSeconds)}</span>
                    </p>
                </div>
                <button
                    onClick={handleJoinQuiz}
                    className="bg-white text-red-600 px-4 py-2 rounded-lg font-bold hover:bg-gray-100 transition animate-pulse"
                >
                    JOIN NOW
                </button>
            </div>
        </div>
    );
};

export default GlobalQuizListener;

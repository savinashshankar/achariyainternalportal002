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
    const lastKnownQuizId = useRef<string | null>(null);

    // Check if user is a student - check multiple possible locations
    const role = user.selectedRole || user.role || '';
    const isStudent = role.toLowerCase() === 'student' || location.pathname.startsWith('/student');
    const studentClass = student.class || '8-A';

    console.log('👁️ GlobalQuizListener:', {
        user,
        role,
        isStudent,
        studentClass,
        pathname: location.pathname
    });

    useEffect(() => {
        console.log('🔄 useEffect:', { isStudent, studentClass });

        if (!isStudent) {
            console.log('❌ Not a student - skipping');
            return;
        }

        // Skip if already on quiz page
        if (location.pathname.includes('/live-quiz/')) {
            console.log('📍 Already on quiz page');
            setShowBanner(false);
            return;
        }

        console.log('📡 Listening for quizzes in class:', studentClass);

        const unsubscribe = listenForActiveQuiz(studentClass, (quiz) => {
            console.log('🔔 Firebase callback:', quiz);

            if (quiz && quiz.id && quiz.status === 'active') {
                const now = Date.now();
                const quizStartTime = quiz.startTime.toDate().getTime();
                const quizEndTime = quiz.endTime.toDate().getTime();
                const timeSinceStart = now - quizStartTime;
                const remainingMs = quizEndTime - now;

                if (now > quizEndTime) {
                    console.log('⏰ Quiz expired');
                    setShowBanner(false);
                    setActiveQuiz(null);
                    return;
                }

                const isNewQuiz = lastKnownQuizId.current !== quiz.id;

                console.log('📡 ACTIVE QUIZ:', {
                    id: quiz.id,
                    timeSinceStart: Math.floor(timeSinceStart / 1000) + 's',
                    remaining: Math.floor(remainingMs / 1000) + 's',
                    isNewQuiz,
                    hasRedirected
                });

                // AUTO REDIRECT if quiz just started (< 10 seconds)
                if (isNewQuiz && timeSinceStart < 10000 && hasRedirected !== quiz.id) {
                    console.log('🚀 AUTO REDIRECT!');
                    setHasRedirected(quiz.id || null);
                    lastKnownQuizId.current = quiz.id || null;
                    navigate(`/student/live-quiz/${quiz.id}/take`);
                }
                // SHOW BANNER for ongoing quiz
                else if (hasRedirected !== quiz.id) {
                    console.log('📢 SHOW BANNER');
                    lastKnownQuizId.current = quiz.id || null;
                    setActiveQuiz({
                        id: quiz.id || '',
                        classId: quiz.classId,
                        endTime: quiz.endTime.toDate(),
                        remainingSeconds: Math.floor(remainingMs / 1000)
                    });
                    setShowBanner(true);
                }
            } else {
                console.log('❌ No active quiz');
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

    useEffect(() => {
        if (!activeQuiz) return;
        const interval = setInterval(() => {
            const remaining = Math.floor((activeQuiz.endTime.getTime() - Date.now()) / 1000);
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

import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, Award, TrendingUp, Wallet, Play } from 'lucide-react';
import { sampleData } from '../../data/sampleData';
import { useState, useEffect } from 'react';
import StudentChatbot from '../../components/StudentChatbot';
import CreditPopup from '../../components/CreditPopup';
import StreakWidget from '../../components/StreakWidget';
import SuggestedActions from '../../components/SuggestedActions';
import { listenForActiveQuiz } from '../../services/liveQuizService';
import type { LiveQuizSession } from '../../services/liveQuizService';

const StudentDashboard = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    let student = sampleData.students.find(s => s.email === user.email) || sampleData.students[0];

    const [showCreditPopup, setShowCreditPopup] = useState(false);
    const [creditReward, setCreditReward] = useState(0);
    const [currentStreak, setCurrentStreak] = useState(student.currentStreak || 0);

    // Daily login credit system
    useEffect(() => {
        const today = new Date().toISOString().split('T')[0];
        const studentData = JSON.parse(localStorage.getItem('studentData') || '{}');
        const lastLogin = studentData[student.id]?.lastLoginDate || student.lastLoginDate || '';

        if (lastLogin !== today) {
            // New day! Award credit
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            const yesterdayStr = yesterday.toISOString().split('T')[0];
            const wasYesterday = lastLogin === yesterdayStr;
            const newStreak = wasYesterday ? (student.currentStreak || 0) + 1 : 1;

            // Update student data
            student.credits = (student.credits || 0) + 1;
            student.currentStreak = newStreak;
            student.longestStreak = Math.max(newStreak, student.longestStreak || 0);

            // Save to localStorage
            studentData[student.id] = {
                lastLoginDate: today,
                credits: student.credits,
                currentStreak: newStreak,
                longestStreak: student.longestStreak
            };
            localStorage.setItem('studentData', JSON.stringify(studentData));

            // Show popup
            setCreditReward(1);
            setCurrentStreak(newStreak);
            setShowCreditPopup(true);
        }
    }, []);

    // Live Quiz real-time listener - SMART AUTO-START
    const [activeQuiz, setActiveQuiz] = useState<LiveQuizSession | null>(null);
    const [hasSeenQuiz, setHasSeenQuiz] = useState<string | null>(null);

    useEffect(() => {
        const unsubscribe = listenForActiveQuiz(student.class || '8-A', (quiz) => {
            if (quiz && quiz.id && quiz.status === 'active') {
                const now = Date.now();
                const quizStartTime = quiz.startTime.toDate().getTime();
                const quizEndTime = quiz.endTime.toDate().getTime();
                const timeSinceStart = now - quizStartTime;

                // CRITICAL FIX: Check if quiz has already ended
                if (now > quizEndTime) {
                    console.log('❌ Quiz EXPIRED - Ignoring stale Firebase data');
                    setActiveQuiz(null);
                    return;
                }

                console.log('🔴 QUIZ DETECTED:', {
                    id: quiz.id,
                    timeSinceStart: Math.floor(timeSinceStart / 1000) + 's',
                    hasSeenQuiz,
                    status: quiz.status
                });

                // Only auto-navigate if:
                // 1. Quiz just started (< 30 seconds ago)
                // 2. We haven't seen this quiz before (not a refresh)
                if (timeSinceStart < 30000 && hasSeenQuiz !== quiz.id) {
                    console.log('✅ NEWLY STARTED - Auto-navigating!');
                    setHasSeenQuiz(quiz.id);
                    setTimeout(() => {
                        navigate(`/student/live-quiz/${quiz.id}/take`);
                    }, 100);
                } else if (timeSinceStart >= 30000) {
                    // Quiz already running - show join banner
                    console.log('⏰ ONGOING QUIZ - Showing join banner');
                    setActiveQuiz(quiz);
                } else {
                    // Already seen this quiz (page refresh during quiz)
                    console.log('🔁 Quiz already seen - no action');
                }
            } else {
                // No active quiz
                setActiveQuiz(null);
            }
        });

        return () => unsubscribe();
    }, [student.class, navigate, hasSeenQuiz]);

    // Load student data from localStorage
    const studentData = JSON.parse(localStorage.getItem('studentData') || '{}');
    if (studentData[student.id]) {
        student = { ...student, ...studentData[student.id] };
    }

    const studentEnrollments = sampleData.enrollments.filter(e => e.student_id === student.id);
    const avgCompletion = studentEnrollments.length > 0
        ? Math.round(studentEnrollments.reduce((sum, e) => sum + e.progress, 0) / studentEnrollments.length)
        : 0;

    return (
        <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">Welcome back, {student.name.split(' ')[0]}!</h1>
            <p className="text-sm sm:text-base text-gray-600 mb-6">Here's your learning progress</p>

            {/* Suggested Actions */}
            <SuggestedActions />

            {/* ONGOING QUIZ JOIN BANNER - Shows for late arrivals */}
            {activeQuiz && (
                <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl shadow-xl p-6 mb-6 text-white animate-pulse">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                                <div className="w-4 h-4 bg-white rounded-full animate-ping"></div>
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold mb-1">⏰ Quiz in Progress!</h3>
                                <p className="text-lg opacity-90">{activeQuiz.quizTitle} - {activeQuiz.className}</p>
                                <p className="text-sm opacity-75 mt-1">
                                    Started {Math.floor((Date.now() - activeQuiz.startTime.toDate().getTime()) / 1000)}s ago
                                    {' • '}
                                    Time remaining: {Math.floor((activeQuiz.endTime.toDate().getTime() - Date.now()) / 60000)}:{String(Math.floor(((activeQuiz.endTime.toDate().getTime() - Date.now()) % 60000) / 1000)).padStart(2, '0')}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() => navigate(`/student/live-quiz/${activeQuiz.id}/take`)}
                            className="bg-white text-orange-600 px-8 py-4 rounded-xl font-bold text-lg hover:shadow-2xl transition transform hover:scale-105 flex items-center gap-3">
                            <Play className="w-6 h-6" />
                            Join Now
                        </button>
                    </div>
                </div>
            )}

            {/* Summary Cards - ALL CLICKABLE */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
                <Link to="/student/courses" className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border hover:shadow-md transition">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs sm:text-sm text-gray-600">Active Courses</p>
                            <p className="text-xl sm:text-2xl font-bold text-gray-800 mt-1 sm:mt-2">{studentEnrollments.length}</p>
                        </div>
                        <div className="bg-blue-500 p-3 rounded-lg">
                            <BookOpen className="w-6 h-6 text-white" />
                        </div>
                    </div>
                </Link>

                <Link to="/student/courses" className="bg-white rounded-xl shadow-sm p-6 border hover:shadow-md transition">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Avg Completion</p>
                            <p className="text-2xl font-bold text-gray-800 mt-2">{avgCompletion}%</p>
                        </div>
                        <div className="bg-green-500 p-3 rounded-lg">
                            <TrendingUp className="w-6 h-6 text-white" />
                        </div>
                    </div>
                </Link>

                <Link to="/student/wallet" className="bg-white rounded-xl shadow-sm p-6 border hover:shadow-md transition">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Wallet Balance</p>
                            <p className="text-2xl font-bold text-gray-800 mt-2">{student.credits} credits</p>
                        </div>
                        <div className="bg-purple-500 p-3 rounded-lg">
                            <Wallet className="w-6 h-6 text-white" />
                        </div>
                    </div>
                </Link>

                <Link to="/student/badges" className="bg-white rounded-xl shadow-sm p-6 border hover:shadow-md transition">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Badges Earned</p>
                            <p className="text-2xl font-bold text-gray-800 mt-2">{student.badges}</p>
                        </div>
                        <div className="bg-yellow-500 p-3 rounded-lg">
                            <Award className="w-6 h-6 text-white" />
                        </div>
                    </div>
                </Link>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border">
                <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-3 sm:mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
                    <Link
                        to="/student/courses"
                        className="flex items-center justify-center py-4 px-6 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition"
                    >
                        <BookOpen className="w-5 h-5 text-blue-600 mr-2" />
                        <span className="text-blue-600 font-semibold">View Courses</span>
                    </Link>
                    <Link
                        to="/student/wallet"
                        className="flex items-center justify-center py-4 px-6 bg-purple-50 hover:bg-purple-100 rounded-lg border border-purple-200 transition"
                    >
                        <Wallet className="w-5 h-5 text-purple-600 mr-2" />
                        <span className="text-purple-600 font-semibold">Check Wallet</span>
                    </Link>
                    <Link
                        to="/student/badges"
                        className="flex items-center justify-center py-4 px-6 bg-yellow-50 hover:bg-yellow-100 rounded-lg border border-yellow-200 transition"
                    >
                        <Award className="w-5 h-5 text-yellow-600 mr-2" />
                        <span className="text-yellow-600 font-semibold">My Badges</span>
                    </Link>
                </div>
            </div>

            {/* Streak Widget */}
            <div className="mt-6">
                <StreakWidget
                    currentStreak={1}
                    longestStreak={5}
                />
            </div>

            {/* Credit Popup */}
            {showCreditPopup && (
                <CreditPopup
                    credits={creditReward}
                    message="Daily login bonus"
                    streak={currentStreak}
                    onClose={() => setShowCreditPopup(false)}
                />
            )}

            {/* AI Chatbot - Floating */}
            <StudentChatbot studentId={student.id} />
        </div>
    );
};

export default StudentDashboard;

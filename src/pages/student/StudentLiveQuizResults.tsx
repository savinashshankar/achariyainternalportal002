// Student Live Quiz Results Page
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trophy, CheckCircle, XCircle, ArrowLeft } from 'lucide-react';
import BackButton from '../../components/BackButton';

const StudentLiveQuizResults = () => {
    const navigate = useNavigate();

    // Mock results - in production, fetch from Firebase
    const [results] = useState({
        score: 8,
        totalQuestions: 10,
        timeTaken: 95000, // 1:35
        rank: 3,
        totalStudents: 15,
        correctAnswers: [1, 2, 4, 5, 6, 7, 9, 10],
        incorrectAnswers: [3, 8]
    });

    const formatTime = (ms: number) => {
        const totalSeconds = Math.floor(ms / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes}:${String(seconds).padStart(2, '0')}`;
    };

    const percentage = Math.round((results.score / results.totalQuestions) * 100);
    const isPerfect = results.score === results.totalQuestions;
    const isPass = percentage >= 70;

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-4xl mx-auto p-6">
                <BackButton />

                {/* Results Header */}
                <div className={`rounded-2xl shadow-2xl p-8 mb-6 text-white relative overflow-hidden ${isPerfect ? 'bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500' :
                        isPass ? 'bg-gradient-to-br from-green-500 to-emerald-600' :
                            'bg-gradient-to-br from-gray-600 to-gray-700'
                    }`}>
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -mr-32 -mt-32"></div>

                    <div className="relative z-10 text-center">
                        <div className="text-6xl mb-4">
                            {isPerfect ? '🏆' : isPass ? '🎉' : '💪'}
                        </div>
                        <h1 className="text-4xl font-bold mb-2">
                            {isPerfect ? 'Perfect Score!' : isPass ? 'Great Job!' : 'Keep Practicing!'}
                        </h1>
                        <p className="text-xl opacity-90 mb-6">Quiz Complete</p>

                        <div className="grid grid-cols-3 gap-4">
                            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                                <div className="text-3xl font-bold">{results.score}/{results.totalQuestions}</div>
                                <div className="text-sm opacity-80">Score</div>
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                                <div className="text-3xl font-bold">{formatTime(results.timeTaken)}</div>
                                <div className="text-sm opacity-80">Time</div>
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                                <div className="text-3xl font-bold">#{results.rank}</div>
                                <div className="text-sm opacity-80">Rank</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Performance Breakdown */}
                <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Performance Breakdown</h2>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="border-2 border-green-200 rounded-xl p-4 bg-green-50">
                            <div className="flex items-center gap-3 mb-2">
                                <CheckCircle className="w-6 h-6 text-green-600" />
                                <span className="font-semibold text-gray-800">Correct</span>
                            </div>
                            <div className="text-3xl font-bold text-green-600">{results.correctAnswers.length}</div>
                        </div>

                        <div className="border-2 border-red-200 rounded-xl p-4 bg-red-50">
                            <div className="flex items-center gap-3 mb-2">
                                <XCircle className="w-6 h-6 text-red-600" />
                                <span className="font-semibold text-gray-800">Incorrect</span>
                            </div>
                            <div className="text-3xl font-bold text-red-600">{results.incorrectAnswers.length}</div>
                        </div>
                    </div>

                    <div className="mb-4">
                        <div className="flex justify-between text-sm text-gray-600 mb-2">
                            <span>Accuracy</span>
                            <span className="font-bold">{percentage}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-4">
                            <div
                                className={`h-4 rounded-full transition-all duration-500 ${isPerfect ? 'bg-yellow-500' : isPass ? 'bg-green-500' : 'bg-red-500'
                                    }`}
                                style={{ width: `${percentage}%` }}
                            ></div>
                        </div>
                    </div>
                </div>

                {/* Question Review */}
                <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Question Review</h2>

                    <div className="grid grid-cols-10 gap-2">
                        {[...Array(results.totalQuestions)].map((_, idx) => {
                            const questionNum = idx + 1;
                            const isCorrect = results.correctAnswers.includes(questionNum);

                            return (
                                <div
                                    key={idx}
                                    className={`aspect-square rounded-lg flex items-center justify-center font-bold text-sm ${isCorrect
                                            ? 'bg-green-100 text-green-700 border-2 border-green-500'
                                            : 'bg-red-100 text-red-700 border-2 border-red-500'
                                        }`}>
                                    {questionNum}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Leaderboard Position */}
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl shadow-lg p-6 text-white mb-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-xl font-bold mb-2">Your Ranking</h3>
                            <p className="opacity-90">Out of {results.totalStudents} students</p>
                        </div>
                        <div className="text-center">
                            <div className="text-5xl font-bold mb-1">#{results.rank}</div>
                            <Trophy className="w-8 h-8 mx-auto" />
                        </div>
                    </div>
                </div>

                {/* Next Steps */}
                <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
                    <h3 className="text-lg font-bold text-blue-900 mb-3">What's Next?</h3>
                    <ul className="space-y-2 text-blue-800">
                        <li className="flex items-start gap-2">
                            <span className="text-blue-600 mt-1">•</span>
                            <span>Review incorrect answers with your teacher</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-blue-600 mt-1">•</span>
                            <span>Practice similar questions to improve</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-blue-600 mt-1">•</span>
                            <span>Check the leaderboard to see top performers</span>
                        </li>
                    </ul>
                </div>

                {/* Back Button */}
                <div className="mt-6 flex justify-center">
                    <button
                        onClick={() => navigate('/student/dashboard')}
                        className="flex items-center gap-2 px-6 py-3 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition font-semibold">
                        <ArrowLeft className="w-5 h-5" />
                        Back to Dashboard
                    </button>
                </div>
            </div>
        </div>
    );
};

export default StudentLiveQuizResults;

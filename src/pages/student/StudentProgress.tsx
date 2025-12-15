import BackButton from '../../components/BackButton';
import { TrendingUp, BarChart3 } from 'lucide-react';

const StudentProgress = () => {
    // Weekly activity mock data
    const weeklyActivity = [
        { day: 'Mon', completion: 85, quizzes: 3, timeSpent: 120 },
        { day: 'Tue', completion: 92, quizzes: 4, timeSpent: 145 },
        { day: 'Wed', completion: 78, quizzes: 2, timeSpent: 95 },
        { day: 'Thu', completion: 95, quizzes: 5, timeSpent: 160 },
        { day: 'Fri', completion: 88, quizzes: 3, timeSpent: 130 },
        { day: 'Sat', completion: 70, quizzes: 2, timeSpent: 85 },
        { day: 'Sun', completion: 82, quizzes: 3, timeSpent: 110 }
    ];

    const maxCompletion = Math.max(...weeklyActivity.map(d => d.completion));

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <BackButton />

            <h1 className="text-3xl font-bold text-gray-800 mb-8">📊 My Progress</h1>

            {/* Weekly Activity Graph */}
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                        <BarChart3 className="w-7 h-7 text-blue-600" />
                        Weekly Activity
                    </h2>
                    <div className="text-sm text-gray-600">
                        <TrendingUp className="w-5 h-5 inline mr-1 text-green-600" />
                        +15% from last week
                    </div>
                </div>

                {/* Bar Chart */}
                <div className="flex items-end justify-between gap-3 h-32 mb-4">
                    {weeklyActivity.map((item, idx) => (
                        <div key={idx} className="flex-1 flex flex-col items-center gap-3">
                            <div className="w-full relative group">
                                {/* Hover tooltip */}
                                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                                    <div>{item.completion}% completion</div>
                                    <div>{item.quizzes} quizzes</div>
                                    <div>{item.timeSpent} min</div>
                                </div>

                                {/* Bar container */}
                                <div className="w-full h-32 bg-gray-100 rounded-t-xl overflow-hidden flex flex-col justify-end">
                                    <div
                                        className="w-full bg-gradient-to-t from-blue-600 to-blue-400 transition-all duration-700 ease-out hover:from-blue-700 hover:to-blue-500 cursor-pointer"
                                        style={{
                                            height: `${(item.completion / maxCompletion) * 100}%`,
                                        }}
                                    >
                                        {/* Display percentage on bar if there's space */}
                                        {item.completion > 30 && (
                                            <div className="text-white text-sm font-bold text-center pt-2">
                                                {item.completion}%
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Day label */}
                            <span className="text-sm font-semibold text-gray-700">{item.day}</span>
                        </div>
                    ))}
                </div>

                {/* Legend */}
                <div className="flex items-center justify-center gap-8 text-sm text-gray-600 border-t pt-4">
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-gradient-to-t from-blue-600 to-blue-400 rounded"></div>
                        <span>Completion %</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-green-600" />
                        <span>Hover for details</span>
                    </div>
                </div>
            </div>

            {/* Existing progress content... */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Course Progress */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <h3 className="text-xl font-bold mb-4">📚 Course Progress</h3>
                    <div className="space-y-4">
                        <div>
                            <div className="flex justify-between mb-2">
                                <span className="text-gray-700">Advanced Mathematics</span>
                                <span className="text-blue-600 font-bold">85%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-3">
                                <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full" style={{ width: '85%' }}></div>
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between mb-2">
                                <span className="text-gray-700">Physics Fundamentals</span>
                                <span className="text-green-600 font-bold">92%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-3">
                                <div className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full" style={{ width: '92%' }}></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quiz Performance */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <h3 className="text-xl font-bold mb-4">🎯 Quiz Performance</h3>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-700">Average Score</span>
                            <span className="text-2xl font-bold text-blue-600">92%</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-700">Quizzes Completed</span>
                            <span className="text-2xl font-bold text-green-600">24</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-700">Perfect Scores</span>
                            <span className="text-2xl font-bold text-purple-600">8</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentProgress;

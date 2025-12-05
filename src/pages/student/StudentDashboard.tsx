import { Link } from 'react-router-dom';
import { BookOpen, TrendingUp, Wallet, Award } from 'lucide-react';
import { sampleData } from '../../data/sampleData';
import StudentChatbot from '../../components/StudentChatbot';

const StudentDashboard = () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    // Find student by email
    const student = sampleData.students.find(s => s.email === user.email) || sampleData.students[0];
    const studentEnrollments = sampleData.enrollments.filter(e => e.student_id === student.id);

    // Calculate actual average from enrolled courses
    const avgCompletion = studentEnrollments.length > 0
        ? Math.round(studentEnrollments.reduce((sum, e) => sum + e.progress, 0) / studentEnrollments.length)
        : 0;

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Student Dashboard</h1>
            <p className="text-gray-600 mb-6">Welcome back, {student.name}!</p>

            {/* Summary Cards - ALL CLICKABLE */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Link to="/student/courses" className="bg-white rounded-xl shadow-sm p-6 border hover:shadow-md transition">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Active Courses</p>
                            <p className="text-2xl font-bold text-gray-800 mt-2">{studentEnrollments.length}</p>
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
            <div className="bg-white rounded-xl shadow-sm p-6 border">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

            {/* AI Chatbot - Floating */}
            <StudentChatbot studentId={student.id} />
        </div>
    );
};

export default StudentDashboard;

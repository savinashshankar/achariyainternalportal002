import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Mail, Award, Wallet, BookOpen, TrendingUp } from 'lucide-react';
import { getStudentDetails } from '../../data/sampleData';

const PrincipalStudentDetail = () => {
    const { studentId } = useParams();
    const studentData = getStudentDetails(parseInt(studentId || '0'));

    if (!studentData) {
        return <div>Student not found</div>;
    }

    return (
        <div>
            <Link to="/principal/dashboard" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
            </Link>

            {/* Student Header - Mobile Responsive */}
            <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border mb-4 sm:mb-6">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div>
                        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 mb-2">{studentData.name}</h1>
                        <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600">
                            <span className="flex items-center">
                                <Mail className="w-4 h-4 mr-1" />
                                {studentData.email}
                            </span>
                            <span className="hidden sm:inline">•</span>
                            <span>{studentData.class}</span>
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${studentData.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                                }`}>
                                {studentData.status}
                            </span>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <div className="text-center">
                            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-1">
                                <Award className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-600" />
                            </div>
                            <p className="text-xs text-gray-600">Badges</p>
                            <p className="text-sm sm:text-lg font-bold text-gray-800">{studentData.badges}</p>
                        </div>
                        <div className="text-center">
                            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-purple-100 rounded-full flex items-center justify-center mb-1">
                                <Wallet className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600" />
                            </div>
                            <p className="text-xs text-gray-600">Credits</p>
                            <p className="text-sm sm:text-lg font-bold text-gray-800">{studentData.credits}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Performance Metrics - Mobile Responsive */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
                <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs sm:text-sm text-gray-600">Overall Completion</p>
                            <p className="text-2xl sm:text-3xl font-bold text-green-600 mt-1 sm:mt-2">{studentData.completion}%</p>
                        </div>
                        <div className="bg-green-100 p-2 sm:p-3 rounded-lg">
                            <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs sm:text-sm text-gray-600">Quiz Average</p>
                            <p className="text-2xl sm:text-3xl font-bold text-blue-600 mt-1 sm:mt-2">{studentData.quiz_avg}%</p>
                        </div>
                        <div className="bg-blue-100 p-2 sm:p-3 rounded-lg">
                            <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs sm:text-sm text-gray-600">Active Courses</p>
                            <p className="text-2xl sm:text-3xl font-bold text-purple-600 mt-1 sm:mt-2">{studentData.courses?.length || 0}</p>
                        </div>
                        <div className="bg-purple-100 p-2 sm:p-3 rounded-lg">
                            <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Enrolled Courses - Mobile Responsive */}
            <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border">
                <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-3 sm:mb-4">Enrolled Courses</h2>
                <div className="space-y-3 sm:space-y-4">
                    {studentData.courses?.map((course: any) => (
                        <div key={course.id} className="p-3 sm:p-4 border rounded-lg">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0 mb-3">
                                <div>
                                    <h3 className="font-bold text-gray-800 text-sm sm:text-base">{course.title}</h3>
                                    <p className="text-xs sm:text-sm text-gray-600">{course.subject} • {course.level}</p>
                                </div>
                                <span className="text-xl sm:text-2xl font-bold text-green-600">{course.progress}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                    className="bg-green-600 h-2 rounded-full transition-all"
                                    style={{ width: `${course.progress}%` }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PrincipalStudentDetail;

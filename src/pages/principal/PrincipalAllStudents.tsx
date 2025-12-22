import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import { sampleData } from '../../data/sampleData';

const PrincipalAllStudents = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const schoolId = user.email?.includes('college') ? 2 : 1;
    const students = sampleData.students.filter(s => s.school_id === schoolId);

    return (
        <div>
            <Link to="/principal/dashboard" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
            </Link>

            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 mb-4 sm:mb-6">All Students</h1>

            <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border">
                {/* Desktop Table */}
                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b">
                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Name</th>
                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Class</th>
                                <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Completion</th>
                                <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Quiz Avg</th>
                                <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Badges</th>
                                <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Credits</th>
                                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {students.map((student) => (
                                <tr key={student.id} className="border-b hover:bg-gray-50">
                                    <td className="py-3 px-4">
                                        <p className="font-semibold text-gray-800">{student.name}</p>
                                        <p className="text-xs text-gray-500">{student.email}</p>
                                    </td>
                                    <td className="py-3 px-4 text-sm text-gray-600">{student.class}</td>
                                    <td className="py-3 px-4 text-center">
                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${student.completion >= 85 ? 'bg-green-100 text-green-700' :
                                            student.completion >= 70 ? 'bg-yellow-100 text-yellow-700' :
                                                'bg-red-100 text-red-700'
                                            }`}>
                                            {student.completion}%
                                        </span>
                                    </td>
                                    <td className="py-3 px-4 text-center text-sm font-semibold">{student.quiz_avg}%</td>
                                    <td className="py-3 px-4 text-center text-sm">{student.badges}</td>
                                    <td className="py-3 px-4 text-center text-sm font-semibold text-purple-600">{student.credits}</td>
                                    <td className="py-3 px-4 text-right">
                                        <button
                                            onClick={() => navigate(`/principal/student/${student.id}`)}
                                            className="text-blue-600 hover:text-blue-700 text-sm font-semibold"
                                        >
                                            View Profile
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Mobile Card Layout */}
                <div className="md:hidden space-y-3">
                    {students.map((student) => (
                        <div
                            key={student.id}
                            onClick={() => navigate(`/principal/student/${student.id}`)}
                            className="bg-gray-50 p-4 rounded-lg border hover:bg-gray-100 active:bg-gray-200 transition"
                        >
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <p className="font-semibold text-gray-800">{student.name}</p>
                                    <p className="text-xs text-gray-500">{student.email}</p>
                                </div>
                                <ChevronRight className="w-5 h-5 text-gray-400" />
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{student.class}</p>
                            <div className="flex flex-wrap gap-2">
                                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${student.completion >= 85 ? 'bg-green-100 text-green-700' :
                                    student.completion >= 70 ? 'bg-yellow-100 text-yellow-700' :
                                        'bg-red-100 text-red-700'
                                    }`}>
                                    {student.completion}% Complete
                                </span>
                                <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                                    Quiz: {student.quiz_avg}%
                                </span>
                                <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-semibold">
                                    {student.badges} 🏆
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PrincipalAllStudents;

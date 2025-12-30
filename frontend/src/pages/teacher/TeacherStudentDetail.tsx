import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { sampleData } from '../../data/sampleData';

const TeacherStudentDetail = () => {
    const { studentId } = useParams();
    const student = sampleData.students.find(s => s.id === Number(studentId));
    const enrollments = sampleData.enrollments.filter(e => e.student_id === Number(studentId));

    const courses = enrollments.map(e => {
        const course = sampleData.courses.find(c => c.id === e.course_id);
        return { ...course, ...e };
    });

    if (!student) return <div>Student not found</div>;

    return (
        <div>
            <Link to="/teacher/dashboard" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
            </Link>

            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 mb-2">{student.name}</h1>
            <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">{student.class} • {student.email}</p>

            {/* Metrics - Mobile Responsive */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
                <div className="bg-white rounded-xl shadow-sm p-3 sm:p-4 border text-center">
                    <p className="text-xl sm:text-2xl font-bold text-green-600">{student.completion}%</p>
                    <p className="text-xs sm:text-sm text-gray-600">Completion</p>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-3 sm:p-4 border text-center">
                    <p className="text-xl sm:text-2xl font-bold text-blue-600">{student.quiz_avg}%</p>
                    <p className="text-xs sm:text-sm text-gray-600">Quiz Average</p>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-3 sm:p-4 border text-center">
                    <p className="text-xl sm:text-2xl font-bold text-yellow-600">{student.badges}</p>
                    <p className="text-xs sm:text-sm text-gray-600">Badges</p>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-3 sm:p-4 border text-center">
                    <p className="text-xl sm:text-2xl font-bold text-purple-600">{student.credits}</p>
                    <p className="text-xs sm:text-sm text-gray-600">Credits</p>
                </div>
            </div>

            {/* Enrolled Courses - Mobile Responsive */}
            <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border">
                <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-3 sm:mb-4">Enrolled Courses</h2>

                {/* Desktop Table */}
                <div className="hidden sm:block overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b">
                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Course</th>
                                <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Progress</th>
                                <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Modules</th>
                                <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Last Active</th>
                            </tr>
                        </thead>
                        <tbody>
                            {courses.map((course: any) => (
                                <tr key={course.id} className="border-b hover:bg-gray-50">
                                    <td className="py-3 px-4">
                                        <p className="font-semibold text-gray-800">{course.title}</p>
                                        <p className="text-xs text-gray-500">{course.subject}</p>
                                    </td>
                                    <td className="py-3 px-4 text-center">
                                        <div className="flex items-center justify-center gap-2">
                                            <div className="w-24 bg-gray-200 rounded-full h-2">
                                                <div
                                                    className={`h-2 rounded-full ${course.progress >= 70 ? 'bg-green-500' : 'bg-red-500'}`}
                                                    style={{ width: `${course.progress}%` }}
                                                />
                                            </div>
                                            <span className="text-sm font-semibold">{course.progress}%</span>
                                        </div>
                                    </td>
                                    <td className="py-3 px-4 text-center text-sm">{course.modules_completed}/{course.total_modules}</td>
                                    <td className="py-3 px-4 text-center text-sm text-gray-600">{course.last_active}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Mobile Card Layout */}
                <div className="sm:hidden space-y-3">
                    {courses.map((course: any) => (
                        <div key={course.id} className="bg-gray-50 p-4 rounded-lg border">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <p className="font-semibold text-gray-800">{course.title}</p>
                                    <p className="text-xs text-gray-500">{course.subject}</p>
                                </div>
                                <span className="text-lg font-bold text-green-600">{course.progress}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                                <div
                                    className={`h-2 rounded-full ${course.progress >= 70 ? 'bg-green-500' : 'bg-red-500'}`}
                                    style={{ width: `${course.progress}%` }}
                                />
                            </div>
                            <div className="flex justify-between text-xs text-gray-600">
                                <span>Modules: {course.modules_completed}/{course.total_modules}</span>
                                <span>Last: {course.last_active}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TeacherStudentDetail;

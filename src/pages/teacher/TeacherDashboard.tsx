import { Link, useNavigate } from 'react-router-dom';
import { Users, TrendingUp, BookOpen, Wallet, AlertTriangle, Award } from 'lucide-react';
import { sampleData } from '../../data/sampleData';

const TeacherDashboard = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const teacher = sampleData.teachers.find(t => t.email === user.email) || sampleData.teachers[0];
    const teacherCourses = sampleData.courses.filter(c => c.teacher_id === teacher.id);

    // Get all students enrolled in teacher's courses
    const allStudents = teacherCourses.flatMap(course => {
        const enrollments = sampleData.enrollments.filter(e => e.course_id === course.id);
        return enrollments.map(e => {
            const student = sampleData.students.find(s => s.id === e.student_id);
            return { ...student, ...e, courseName: course.title };
        });
    });

    // Identify at-risk students (completion < 70%)
    const atRiskStudents = allStudents.filter((s: any) => s.progress < 70);

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Teacher Dashboard</h1>
                <p className="text-gray-600">Welcome back, {teacher.name}</p>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <Link to="/teacher/courses" className="bg-white rounded-xl shadow-sm p-6 border hover:shadow-md transition">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">My Courses</p>
                            <p className="text-3xl font-bold text-gray-800 mt-2">{teacher.courses}</p>
                        </div>
                        <div className="bg-blue-500 p-3 rounded-lg">
                            <BookOpen className="w-6 h-6 text-white" />
                        </div>
                    </div>
                </Link>

                <Link to="/teacher/students" className="bg-white rounded-xl shadow-sm p-6 border hover:shadow-md transition cursor-pointer">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Total Students</p>
                            <p className="text-3xl font-bold text-gray-800 mt-2">{allStudents.length}</p>
                            <p className="text-xs text-gray-500 mt-1">Click to view all →</p>
                        </div>
                        <div className="bg-green-500 p-3 rounded-lg">
                            <Users className="w-6 h-6 text-white" />
                        </div>
                    </div>
                </Link>

                <Link to="/teacher/performance" className="bg-white rounded-xl shadow-sm p-6 border hover:shadow-md transition cursor-pointer">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Avg Completion</p>
                            <p className="text-3xl font-bold text-gray-800 mt-2">{teacher.completion_avg}%</p>
                            <p className="text-xs text-gray-500 mt-1">Click for breakdown →</p>
                        </div>
                        <div className="bg-purple-500 p-3 rounded-lg">
                            <TrendingUp className="w-6 h-6 text-white" />
                        </div>
                    </div>
                </Link>

                <Link to="/teacher/credits" className="bg-white rounded-xl shadow-sm p-6 border hover:shadow-md transition cursor-pointer">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Wallet Balance</p>
                            <p className="text-3xl font-bold text-gray-800 mt-2">{teacher.credits}</p>
                            <p className="text-xs text-gray-500 mt-1">Click for details →</p>
                        </div>
                        <div className="bg-yellow-500 p-3 rounded-lg">
                            <Wallet className="w-6 h-6 text-white" />
                        </div>
                    </div>
                </Link>
            </div>

            {/* At-Risk Students Alert */}
            {atRiskStudents.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-8">
                    <div className="flex items-start">
                        <AlertTriangle className="w-6 h-6 text-red-600 mr-3 mt-1" />
                        <div className="flex-1">
                            <h3 className="text-lg font-bold text-red-800 mb-2">
                                {atRiskStudents.length} At-Risk Student{atRiskStudents.length > 1 ? 's' : ''}
                            </h3>
                            <p className="text-sm text-red-700 mb-3">These students have completion rates below 70% and may need additional support.</p>
                            <div className="space-y-2">
                                {atRiskStudents.slice(0, 3).map((student: any) => (
                                    <div key={student.id} className="flex items-center justify-between bg-white p-3 rounded-lg">
                                        <div>
                                            <p className="font-semibold text-gray-800">{student.name}</p>
                                            <p className="text-xs text-gray-600">{student.courseName}</p>
                                        </div>
                                        <span className="text-red-600 font-bold">{student.progress}%</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* My Courses */}
            <div className="bg-white rounded-xl shadow-sm p-6 border mb-8">
                <h2 className="text-xl font-bold text-gray-800 mb-4">My Courses</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {teacherCourses.map((course) => {
                        const courseEnrollments = sampleData.enrollments.filter(e => e.course_id === course.id);
                        return (
                            <div
                                key={course.id}
                                onClick={() => navigate(`/teacher/course/${course.id}`)}
                                className="p-4 border rounded-lg hover:shadow-md cursor-pointer transition"
                            >
                                <h3 className="font-bold text-gray-800 mb-1">{course.title}</h3>
                                <p className="text-sm text-gray-600 mb-3">{course.subject} • {course.level}</p>
                                <div className="flex justify-between text-sm mb-2">
                                    <span className="text-gray-600">{courseEnrollments.length} students</span>
                                    <span className="font-semibold text-green-600">{course.completion_avg}% avg completion</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                        className="bg-green-600 h-2 rounded-full"
                                        style={{ width: `${course.completion_avg}%` }}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Student Progress Overview */}
            <div className="bg-white rounded-xl shadow-sm p-6 border">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Student Progress Overview</h2>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b">
                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Student</th>
                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Course</th>
                                <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Progress</th>
                                <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Last Active</th>
                            </tr>
                        </thead>
                        <tbody>
                            {allStudents.slice(0, 10).map((student: any) => (
                                <tr
                                    key={`${student.id}-${student.course_id}`}
                                    onClick={() => navigate(`/teacher/student/${student.id}`)}
                                    className="border-b hover:bg-gray-50 cursor-pointer"
                                >
                                    <td className="py-3 px-4">
                                        <p className="font-semibold text-gray-800">{student.name}</p>
                                        <p className="text-xs text-gray-500">{student.class}</p>
                                    </td>
                                    <td className="py-3 px-4 text-sm text-gray-600">{student.courseName}</td>
                                    <td className="py-3 px-4">
                                        <div className="flex items-center justify-center">
                                            <div className="w-20 bg-gray-200 rounded-full h-2 mr-2">
                                                <div
                                                    className={`h-2 rounded-full ${student.progress >= 70 ? 'bg-green-600' : 'bg-red-600'}`}
                                                    style={{ width: `${student.progress}%` }}
                                                />
                                            </div>
                                            <span className="text-sm font-semibold">{student.progress}%</span>
                                        </div>
                                    </td>
                                    <td className="py-3 px-4 text-center text-sm text-gray-600">{student.last_active}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default TeacherDashboard;

import { Link } from 'react-router-dom';
import { sampleData } from '../../data/sampleData';
import { ArrowLeft } from 'lucide-react';
import StudentChatbot from '../../components/StudentChatbot';

const StudentCourses = () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const student = sampleData.students.find(s => s.email === user.email) || sampleData.students[0];
    const studentEnrollments = sampleData.enrollments.filter(e => e.student_id === student.id);

    const courses = studentEnrollments.map(enrollment => {
        const course = sampleData.courses.find(c => c.id === enrollment.course_id);
        // CRITICAL: Progress is calculated from completed modules, not arbitrary percentages
        // This enforces sequential module completion logic
        const progress = Math.round((enrollment.modules_completed / enrollment.total_modules) * 100);
        return { ...course, progress, modules_completed: enrollment.modules_completed, total_modules: enrollment.total_modules, status: 'Active' };
    });

    return (
        <div>
            <Link to="/student/dashboard" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
            </Link>

            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 mb-4 sm:mb-6">My Courses</h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {courses.map((course: any) => (
                    <Link
                        key={course.id}
                        to={`/student/course/${course.id}`}
                        className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border hover:shadow-md transition"
                    >
                        <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">{course.title}</h3>
                        <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">{course.subject} • {course.level}</p>

                        <div className="mb-3 sm:mb-4">
                            <div className="flex justify-between text-xs sm:text-sm mb-1">
                                <span className="text-gray-600">Progress</span>
                                <span className="font-semibold text-blue-600">{course.progress}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2 mb-1">
                                <div
                                    className="bg-blue-600 h-2 rounded-full transition-all"
                                    style={{ width: `${course.progress}%` }}
                                />
                            </div>
                            {/* Show module progress for clarity */}
                            <p className="text-xs text-gray-500 text-right">
                                {course.modules_completed}/{course.total_modules} modules
                            </p>
                        </div>

                        <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                            {course.status}
                        </span>
                    </Link>
                ))}
            </div>

            {/* AI Chatbot */}
            <StudentChatbot studentId={student.id} studentName={student.name} />
        </div>
    );
};

export default StudentCourses;

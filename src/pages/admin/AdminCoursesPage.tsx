import { Link } from 'react-router-dom';
import { ArrowLeft, Plus } from 'lucide-react';
import { sampleData } from '../../data/sampleData';

const AdminCoursesPage = () => {
    return (
        <div>
            <Link to="/admin/dashboard" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
            </Link>

            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Course Management</h1>
                <Link to="/admin/courses/create" className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                    <Plus className="w-4 h-4 mr-2" />
                    Create New Course
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sampleData.courses.map((course) => {
                    const school = sampleData.schools.find(s => s.id === course.school_id);
                    const modules = sampleData.modules.filter(m => m.course_id === course.id);

                    return (
                        <div key={course.id} className="bg-white rounded-xl shadow-sm p-6 border">
                            <div className="flex justify-between items-start mb-3">
                                <h3 className="text-lg font-bold text-gray-800">{course.title}</h3>
                                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${course.traffic === 'High' ? 'bg-orange-100 text-orange-700' :
                                    course.traffic === 'Medium' ? 'bg-blue-100 text-blue-700' :
                                        'bg-gray-100 text-gray-700'
                                    }`}>
                                    {course.traffic}
                                </span>
                            </div>

                            <p className="text-sm text-gray-600 mb-1">{course.subject} • {course.level}</p>
                            <p className="text-xs text-gray-500 mb-4">{school?.name}</p>

                            <div className="grid grid-cols-3 gap-2 mb-4 text-center text-sm">
                                <div>
                                    <p className="font-bold text-gray-800">{course.enrollments}</p>
                                    <p className="text-xs text-gray-500">Students</p>
                                </div>
                                <div>
                                    <p className="font-bold text-green-600">{course.completion_avg}%</p>
                                    <p className="text-xs text-gray-500">Completion</p>
                                </div>
                                <div>
                                    <p className="font-bold text-purple-600">{modules.length}</p>
                                    <p className="text-xs text-gray-500">Modules</p>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <Link to={`/admin/courses/edit/${course.id}`} className="flex-1 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-semibold hover:bg-blue-100 transition text-center">
                                    Edit
                                </Link>
                                <button className="flex-1 px-3 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-semibold hover:bg-red-100 transition">
                                    Delete
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default AdminCoursesPage;

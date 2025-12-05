import { Link } from 'react-router-dom';
import { ArrowLeft, Upload } from 'lucide-react';
import { sampleData } from '../../data/sampleData';

const TeacherEvidencePage = () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const teacher = sampleData.teachers.find(t => t.email === user.email) || sampleData.teachers[0];
    const courses = sampleData.courses.filter(c => c.teacher_id === teacher.id);

    return (
        <div>
            <Link to="/teacher/dashboard" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
            </Link>

            <h1 className="text-3xl font-bold text-gray-800 mb-6">Evidence Submission</h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Upload Form */}
                <div className="bg-white rounded-xl shadow-sm p-6 border">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Submit New Evidence</h2>

                    <form className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Select Course</label>
                            <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                                <option value="">Choose a course...</option>
                                {courses.map((course) => (
                                    <option key={course.id} value={course.id}>{course.title}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Evidence Title</label>
                            <input
                                type="text"
                                placeholder="e.g., Module 1 Teaching Session"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                            <textarea
                                rows={4}
                                placeholder="Describe your evidence..."
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Upload Files</label>
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition cursor-pointer">
                                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                                <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
                                <p className="text-xs text-gray-500 mt-1">PDF, JPG, PNG up to 10MB</p>
                            </div>
                        </div>

                        <button
                            type="button"
                            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
                        >
                            Submit Evidence
                        </button>
                    </form>
                </div>

                {/* Submitted Evidence */}
                <div className="bg-white rounded-xl shadow-sm p-6 border">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Previously Submitted</h2>
                    <div className="space-y-3">
                        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                            <div className="flex justify-between items-start mb-2">
                                <h4 className="font-semibold text-gray-800">Module 2 Teaching Materials</h4>
                                <span className="px-2 py-1 bg-green-500 text-white text-xs rounded-full">Approved</span>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">Advanced Mathematics - Module 2</p>
                            <p className="text-xs text-gray-500">Submitted: 2025-12-03</p>
                        </div>

                        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                            <div className="flex justify-between items-start mb-2">
                                <h4 className="font-semibold text-gray-800">Quiz Implementation Evidence</h4>
                                <span className="px-2 py-1 bg-yellow-500 text-white text-xs rounded-full">Pending</span>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">Physics Fundamentals - Module 1</p>
                            <p className="text-xs text-gray-500">Submitted: 2025-12-04</p>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
};

export default TeacherEvidencePage;

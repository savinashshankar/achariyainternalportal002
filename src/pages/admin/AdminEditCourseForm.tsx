import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { sampleData } from '../../data/sampleData';

const AdminEditCourseForm = () => {
    const { courseId } = useParams();
    const course = sampleData.courses.find(c => c.id === Number(courseId)) || sampleData.courses[0];

    const [formData, setFormData] = useState({
        title: course.title,
        subject: course.subject,
        level: course.level,
        teacher_id: course.teacher_id,
        description: `Comprehensive ${course.subject} course covering fundamental and advanced topics.`,
        credits: 3,
        duration: '12 weeks'
    });

    const [saved, setSaved] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    return (
        <div>
            <Link to="/admin/courses" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Course Management
            </Link>

            <h1 className="text-3xl font-bold text-gray-800 mb-2">Edit Course</h1>
            <p className="text-gray-600 mb-6">Course ID: {course.id}</p>

            <div className="bg-white rounded-xl shadow-sm p-8 border max-w-3xl">
                {saved && (
                    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
                        ✓ Course updated successfully! (Demo Mode)
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Title */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Course Title *
                        </label>
                        <input
                            type="text"
                            required
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            placeholder="e.g., Advanced Mathematics"
                        />
                    </div>

                    {/* Subject & Level */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Subject *
                            </label>
                            <input
                                type="text"
                                required
                                value={formData.subject}
                                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Level *
                            </label>
                            <select
                                required
                                value={formData.level}
                                onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="Beginner">Beginner</option>
                                <option value="Intermediate">Intermediate</option>
                                <option value="Advanced">Advanced</option>
                            </select>
                        </div>
                    </div>

                    {/* Teacher Assignment */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Assigned Teacher *
                        </label>
                        <select
                            required
                            value={formData.teacher_id}
                            onChange={(e) => setFormData({ ...formData, teacher_id: Number(e.target.value) })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        >
                            {sampleData.teachers.map(teacher => (
                                <option key={teacher.id} value={teacher.id}>
                                    {teacher.name} - {teacher.department}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Course Description
                        </label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            rows={4}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            placeholder="Describe the course objectives and content..."
                        />
                    </div>

                    {/* Credits & Duration */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Credits
                            </label>
                            <input
                                type="number"
                                value={formData.credits}
                                onChange={(e) => setFormData({ ...formData, credits: Number(e.target.value) })}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                min="1"
                                max="10"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Duration
                            </label>
                            <input
                                type="text"
                                value={formData.duration}
                                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                placeholder="e.g., 12 weeks"
                            />
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4 pt-4 border-t">
                        <button
                            type="submit"
                            className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold flex items-center justify-center"
                        >
                            <Save className="w-5 h-5 mr-2" />
                            Save Changes
                        </button>
                        <Link
                            to="/admin/courses"
                            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-semibold text-center"
                        >
                            Cancel
                        </Link>
                    </div>
                </form>

                <p className="text-sm text-gray-500 mt-6 italic">
                    * Demo mode - Changes are not persisted to database
                </p>
            </div>
        </div>
    );
};

export default AdminEditCourseForm;

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Plus, BookOpen } from 'lucide-react';
import { sampleData } from '../../data/sampleData';

const AdminCreateCourseForm = () => {
    const [formData, setFormData] = useState({
        title: '',
        subject: '',
        level: 'Intermediate',
        teacher_id: sampleData.teachers[0].id,
        description: '',
        credits: 3,
        duration: '12 weeks'
    });

    const [created, setCreated] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setCreated(true);
        setTimeout(() => {
            setCreated(false);
            setFormData({
                title: '',
                subject: '',
                level: 'Intermediate',
                teacher_id: sampleData.teachers[0].id,
                description: '',
                credits: 3,
                duration: '12 weeks'
            });
        }, 3000);
    };

    return (
        <div>
            <Link to="/admin/courses" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Course Management
            </Link>

            <h1 className="text-3xl font-bold text-gray-800 mb-6">Create New Course</h1>

            <div className="bg-white rounded-xl shadow-sm p-8 border max-w-3xl">
                {created && (
                    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
                        ✓ Course created successfully! (Demo Mode)
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Title */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            <BookOpen className="w-4 h-4 inline mr-2" />
                            Course Title *
                        </label>
                        <input
                            type="text"
                            required
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            placeholder="e.g., Introduction to Data Science"
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
                                placeholder="e.g., Computer Science"
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
                            Assign Teacher *
                        </label>
                        <select
                            required
                            value={formData.teacher_id}
                            onChange={(e) => setFormData({ ...formData, teacher_id: Number(e.target.value) })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        >
                            {sampleData.teachers.map(teacher => (
                                <option key={teacher.id} value={teacher.id}>
                                    {teacher.name} - {teacher.subject}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Course Description *
                        </label>
                        <textarea
                            required
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            rows={5}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            placeholder="Provide a detailed description of course objectives, topics covered, and learning outcomes..."
                        />
                    </div>

                    {/* Credits & Duration */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Course Credits *
                            </label>
                            <input
                                type="number"
                                required
                                value={formData.credits}
                                onChange={(e) => setFormData({ ...formData, credits: Number(e.target.value) })}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                min="1"
                                max="10"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Duration *
                            </label>
                            <input
                                type="text"
                                required
                                value={formData.duration}
                                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                placeholder="e.g., 12 weeks, 3 months"
                            />
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4 pt-4 border-t">
                        <button
                            type="submit"
                            className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold flex items-center justify-center"
                        >
                            <Plus className="w-5 h-5 mr-2" />
                            Create Course
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
                    * Demo mode - After creation, you'll need to add modules and content separately
                </p>
            </div>
        </div>
    );
};

export default AdminCreateCourseForm;

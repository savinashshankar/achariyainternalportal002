import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, UserPlus, Mail, User, Building, Shield } from 'lucide-react';

const AdminAddUserForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        role: 'student',
        department: '',
        class: '',
        phone: ''
    });

    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitted(true);
        setTimeout(() => {
            setSubmitted(false);
            setFormData({ name: '', email: '', role: 'student', department: '', class: '', phone: '' });
        }, 3000);
    };

    return (
        <div>
            <Link to="/admin/users" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to User Management
            </Link>

            <h1 className="text-3xl font-bold text-gray-800 mb-6">Add New User</h1>

            <div className="bg-white rounded-xl shadow-sm p-8 border max-w-2xl">
                {submitted && (
                    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
                        ✓ User created successfully! (Demo Mode)
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Name */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            <User className="w-4 h-4 inline mr-2" />
                            Full Name *
                        </label>
                        <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter full name"
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            <Mail className="w-4 h-4 inline mr-2" />
                            Email Address *
                        </label>
                        <input
                            type="email"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="user@achariya.org"
                        />
                    </div>

                    {/* Role */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            <Shield className="w-4 h-4 inline mr-2" />
                            Role *
                        </label>
                        <select
                            required
                            value={formData.role}
                            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="student">Student</option>
                            <option value="teacher">Teacher</option>
                            <option value="principal">Principal</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>

                    {/* Department */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            <Building className="w-4 h-4 inline mr-2" />
                            Department/Subject
                        </label>
                        <input
                            type="text"
                            value={formData.department}
                            onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="e.g., Mathematics, Science"
                        />
                    </div>

                    {/* Class (for students) */}
                    {formData.role === 'student' && (
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Class/Grade
                            </label>
                            <input
                                type="text"
                                value={formData.class}
                                onChange={(e) => setFormData({ ...formData, class: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="e.g., Grade 10A"
                            />
                        </div>
                    )}

                    {/* Phone */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Phone Number
                        </label>
                        <input
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="+91 XXXXX XXXXX"
                        />
                    </div>

                    {/* Submit Buttons */}
                    <div className="flex gap-4 pt-4">
                        <button
                            type="submit"
                            className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold flex items-center justify-center"
                        >
                            <UserPlus className="w-5 h-5 mr-2" />
                            Create User
                        </button>
                        <Link
                            to="/admin/users"
                            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-semibold text-center"
                        >
                            Cancel
                        </Link>
                    </div>
                </form>

                <p className="text-sm text-gray-500 mt-6 italic">
                    * This is a mockup form. In production, this would create a new user account and send credentials via email.
                </p>
            </div>
        </div>
    );
};

export default AdminAddUserForm;

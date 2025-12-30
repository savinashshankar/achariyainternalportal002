import { useState } from 'react';
import { Send, CheckCircle } from 'lucide-react';

const GRADES = ["LKG", "UKG", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];

export default function ParentPortal() {
    const [submitted, setSubmitted] = useState(false);
    const [formData, setFormData] = useState({
        student_name: '',
        grade: '',
        parent_name: '',
        mobile: '',
        email: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitted(true);

        setTimeout(() => {
            setFormData({
                student_name: '',
                grade: '',
                parent_name: '',
                mobile: '',
                email: ''
            });
            setSubmitted(false);
        }, 4000);
    };

    if (submitted) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-50 flex items-center justify-center p-4">
                <div className="card max-w-md text-center">
                    <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
                    <h2 className="text-lg font-bold text-gray-900 mb-2">Enquiry Submitted!</h2>
                    <p className="text-sm text-gray-600 mb-3">
                        Thank you for your interest in Achariya. Our team will contact you within 24 hours.
                    </p>
                    <p className="text-xs text-gray-500">
                        You will receive a confirmation SMS shortly.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-50 py-4 px-4">
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <div className="text-center mb-4">
                    <img src="/logo.png" alt="Achariya" className="h-12 w-12 mx-auto mb-2" />
                    <h1 className="text-xl font-bold text-gray-900 mb-1">Achariya Admissions Enquiry</h1>
                    <p className="text-xs text-gray-600">Submit your details and we'll get back to you</p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="card">
                    <h2 className="text-base font-bold text-gray-900 mb-3">Parent Enquiry Form</h2>

                    <div className="space-y-3">
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                                Student Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                required
                                className="input-field"
                                placeholder="Enter student name"
                                value={formData.student_name}
                                onChange={(e) => setFormData({ ...formData, student_name: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                                Grade Applying For <span className="text-red-500">*</span>
                            </label>
                            <select
                                required
                                className="input-field"
                                value={formData.grade}
                                onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                            >
                                <option value="">Select grade</option>
                                {GRADES.map(g => <option key={g} value={g}>{g}</option>)}
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                                Parent Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                required
                                className="input-field"
                                placeholder="Enter your name"
                                value={formData.parent_name}
                                onChange={(e) => setFormData({ ...formData, parent_name: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                                Mobile Number <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="tel"
                                required
                                pattern="[6-9][0-9]{9}"
                                maxLength={10}
                                className="input-field"
                                placeholder="10-digit mobile number"
                                value={formData.mobile}
                                onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                                Email (Optional)
                            </label>
                            <input
                                type="email"
                                className="input-field"
                                placeholder="your.email@example.com"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>
                    </div>

                    <button type="submit" className="w-full btn-primary mt-4">
                        <Send className="w-3 h-3 inline mr-2" />
                        Submit Enquiry
                    </button>

                    <p className="text-[10px] text-gray-500 text-center mt-3">
                        By submitting, you agree to be contacted by Achariya admissions team
                    </p>
                </form>

                <p className="text-center text-[10px] text-gray-500 mt-4">
                    POC Demo - Parent-facing self-service enquiry form
                </p>
            </div>
        </div>
    );
}

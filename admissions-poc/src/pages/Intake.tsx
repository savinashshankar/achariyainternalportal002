import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, X } from 'lucide-react';

const GRADES = ["LKG", "UKG", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];
const CAMPUSES = ["Campus 1", "Campus 2", "Campus 3"];
const SOURCES = ["Walk-in", "Phone", "WhatsApp", "Website", "Google Form", "Referral", "Campaign", "Other"];

export default function Intake() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        student_name: '',
        grade_applying_for: '',
        parent_name: '',
        mobile_number: '',
        email: '',
        campus: '',
        lead_source: '',
        notes: ''
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validate = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.student_name.trim()) newErrors.student_name = 'Student name is required';
        if (!formData.grade_applying_for) newErrors.grade_applying_for = 'Grade is required';
        if (!formData.parent_name.trim()) newErrors.parent_name = 'Parent name is required';

        if (!formData.mobile_number.trim()) {
            newErrors.mobile_number = 'Mobile number is required';
        } else if (!/^[6-9]\d{9}$/.test(formData.mobile_number)) {
            newErrors.mobile_number = 'Enter valid 10-digit mobile number';
        }

        if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Enter valid email address';
        }

        if (!formData.campus) newErrors.campus = 'Campus is required';
        if (!formData.lead_source) newErrors.lead_source = 'Lead source is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (validate()) {
            // Generate lead ID
            const date = new Date();
            const dateStr = date.toISOString().split('T')[0].replace(/-/g, '');
            const randomNum = Math.floor(Math.random() * 9999).toString().padStart(4, '0');
            const lead_id = `AD-${dateStr}-${randomNum}`;

            // Show success message
            alert(`✓ Lead Created Successfully!\n\nLead ID: ${lead_id}\nStudent: ${formData.student_name}\nGrade: ${formData.grade_applying_for}\n\nRedirecting to dashboard...`);

            // Navigate to dashboard
            setTimeout(() => navigate('/dashboard'), 1000);
        }
    };

    const handleClear = () => {
        setFormData({
            student_name: '',
            grade_applying_for: '',
            parent_name: '',
            mobile_number: '',
            email: '',
            campus: '',
            lead_source: '',
            notes: ''
        });
        setErrors({});
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white border-b border-gray-200">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center gap-4">
                        <Link to="/dashboard" className="text-gray-600 hover:text-gray-900">
                            <ArrowLeft className="w-6 h-6" />
                        </Link>
                        <img src="/logo.png" alt="Achariya" className="h-12 w-12" />
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">New Lead Intake</h1>
                            <p className="text-sm text-gray-600 mt-1">Capture new enquiry in under 30 seconds</p>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <form onSubmit={handleSubmit} className="card">
                    {/* Two-column grid on desktop */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Student Name */}
                        <div>
                            <label htmlFor="student_name" className="block text-sm font-medium text-gray-700 mb-2">
                                Student Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="student_name"
                                name="student_name"
                                value={formData.student_name}
                                onChange={handleChange}
                                className={`input-field ${errors.student_name ? 'border-red-500' : ''}`}
                                placeholder="Enter student name"
                            />
                            {errors.student_name && <p className="text-red-500 text-sm mt-1">{errors.student_name}</p>}
                        </div>

                        {/* Grade */}
                        <div>
                            <label htmlFor="grade_applying_for" className="block text-sm font-medium text-gray-700 mb-2">
                                Grade Applying For <span className="text-red-500">*</span>
                            </label>
                            <select
                                id="grade_applying_for"
                                name="grade_applying_for"
                                value={formData.grade_applying_for}
                                onChange={handleChange}
                                className={`input-field ${errors.grade_applying_for ? 'border-red-500' : ''}`}
                            >
                                <option value="">Select grade</option>
                                {GRADES.map(grade => (
                                    <option key={grade} value={grade}>{grade}</option>
                                ))}
                            </select>
                            {errors.grade_applying_for && <p className="text-red-500 text-sm mt-1">{errors.grade_applying_for}</p>}
                        </div>

                        {/* Parent Name */}
                        <div>
                            <label htmlFor="parent_name" className="block text-sm font-medium text-gray-700 mb-2">
                                Parent Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="parent_name"
                                name="parent_name"
                                value={formData.parent_name}
                                onChange={handleChange}
                                className={`input-field ${errors.parent_name ? 'border-red-500' : ''}`}
                                placeholder="Enter parent name"
                            />
                            {errors.parent_name && <p className="text-red-500 text-sm mt-1">{errors.parent_name}</p>}
                        </div>

                        {/* Mobile Number */}
                        <div>
                            <label htmlFor="mobile_number" className="block text-sm font-medium text-gray-700 mb-2">
                                Mobile Number <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="tel"
                                id="mobile_number"
                                name="mobile_number"
                                value={formData.mobile_number}
                                onChange={handleChange}
                                className={`input-field ${errors.mobile_number ? 'border-red-500' : ''}`}
                                placeholder="10-digit mobile"
                                maxLength={10}
                            />
                            {errors.mobile_number && <p className="text-red-500 text-sm mt-1">{errors.mobile_number}</p>}
                        </div>

                        {/* Email */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                Email (Optional)
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className={`input-field ${errors.email ? 'border-red-500' : ''}`}
                                placeholder="parent@email.com"
                            />
                            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                        </div>

                        {/* Campus */}
                        <div>
                            <label htmlFor="campus" className="block text-sm font-medium text-gray-700 mb-2">
                                Campus <span className="text-red-500">*</span>
                            </label>
                            <select
                                id="campus"
                                name="campus"
                                value={formData.campus}
                                onChange={handleChange}
                                className={`input-field ${errors.campus ? 'border-red-500' : ''}`}
                            >
                                <option value="">Select campus</option>
                                {CAMPUSES.map(campus => (
                                    <option key={campus} value={campus}>{campus}</option>
                                ))}
                            </select>
                            {errors.campus && <p className="text-red-500 text-sm mt-1">{errors.campus}</p>}
                        </div>

                        {/* Lead Source */}
                        <div>
                            <label htmlFor="lead_source" className="block text-sm font-medium text-gray-700 mb-2">
                                Lead Source <span className="text-red-500">*</span>
                            </label>
                            <select
                                id="lead_source"
                                name="lead_source"
                                value={formData.lead_source}
                                onChange={handleChange}
                                className={`input-field ${errors.lead_source ? 'border-red-500' : ''}`}
                            >
                                <option value="">Select source</option>
                                {SOURCES.map(source => (
                                    <option key={source} value={source}>{source}</option>
                                ))}
                            </select>
                            {errors.lead_source && <p className="text-red-500 text-sm mt-1">{errors.lead_source}</p>}
                        </div>
                    </div>

                    {/* Notes - Full width */}
                    <div className="mt-6">
                        <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                            Notes (Optional)
                        </label>
                        <textarea
                            id="notes"
                            name="notes"
                            value={formData.notes}
                            onChange={handleChange}
                            rows={3}
                            className="input-field"
                            placeholder="Any additional information..."
                        />
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-8 flex justify-end gap-4">
                        <button
                            type="button"
                            onClick={handleClear}
                            className="btn-secondary"
                        >
                            <X className="w-4 h-4 inline mr-2" />
                            Clear
                        </button>
                        <button
                            type="submit"
                            className="btn-primary"
                        >
                            <Save className="w-4 h-4 inline mr-2" />
                            Save Lead
                        </button>
                    </div>
                </form>

                {/* Footer Note */}
                <div className="mt-6 text-center text-sm text-gray-500">
                    <p>POC Demo - Data will be saved locally | Built with React + TypeScript</p>
                </div>
            </main>
        </div>
    );
}

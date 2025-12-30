import { useState, type FormEvent, type ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Upload, Loader } from 'lucide-react';
import type { Opening } from '../data/openings';
import { submitApplication } from '../services/applicationService';

interface Props {
    opening: Opening;
    onClose: () => void;
}

export default function ApplyModal({ opening, onClose }: Props) {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [resumeFile, setResumeFile] = useState<File | null>(null);
    const [formData, setFormData] = useState({
        fullName: '',
        age: '',
        dob: '',
        email: '',
        phone: '',
        previousCompany: '',
        previousDOJ: '',
        lastWorkingDate: '',
        noticePeriodDays: '',
        lastWorkingDay: '',
        currentCTC: '',
        expectedCTC: '',
        consent: false
    });

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Validate file type
            const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
            if (!validTypes.includes(file.type)) {
                alert('Please upload only PDF or Word documents');
                return;
            }
            // Validate file size (1MB = 1048576 bytes)
            if (file.size > 1048576) {
                alert('File size must be less than 1MB');
                return;
            }
            setResumeFile(file);
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (!resumeFile) {
            alert('Please upload your resume');
            return;
        }

        if (!formData.consent) {
            alert('Please confirm that the details are correct');
            return;
        }

        setLoading(true);

        try {
            const referenceId = await submitApplication({
                ...formData,
                category: opening.category,
                roleTitle: opening.roleTitle,
                location: opening.location,
                resume: resumeFile
            });

            navigate('/thank-you', {
                state: {
                    referenceId,
                    candidateName: formData.fullName,
                    category: opening.category,
                    role: opening.roleTitle
                }
            });
        } catch (error) {
            console.error('Submission error:', error);
            alert('Failed to submit application. Please try again.');
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-white rounded-lg max-w-3xl w-full my-8 relative">
                <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-lg">
                    <button
                        onClick={onClose}
                        className="absolute top-6 right-6 text-gray-400 hover:text-gray-600"
                    >
                        <X className="w-6 h-6" />
                    </button>
                    <h2 className="text-2xl font-bold text-gray-900">Apply for Position</h2>
                    <p className="text-sm text-gray-600 mt-1">
                        {opening.roleTitle} • {opening.category} • {opening.location}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Personal Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Full Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                required
                                className="input-field"
                                value={formData.fullName}
                                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Age <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                required
                                min="18"
                                max="65"
                                className="input-field"
                                value={formData.age}
                                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Date of Birth <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="date"
                                required
                                className="input-field"
                                value={formData.dob}
                                onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Email <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="email"
                                required
                                className="input-field"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Phone Number <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="tel"
                                required
                                pattern="[6-9][0-9]{9}"
                                maxLength={10}
                                className="input-field"
                                placeholder="10-digit mobile"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* Employment History */}
                    <div className="border-t border-gray-200 pt-6">
                        <h3 className="font-bold text-gray-900 mb-4">Employment History</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Previous Company <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    required
                                    className="input-field"
                                    value={formData.previousCompany}
                                    onChange={(e) => setFormData({ ...formData, previousCompany: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Date of Joining (Previous Company) <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="date"
                                    required
                                    className="input-field"
                                    value={formData.previousDOJ}
                                    onChange={(e) => setFormData({ ...formData, previousDOJ: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Last Working Date <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="date"
                                    required
                                    className="input-field"
                                    value={formData.lastWorkingDate}
                                    onChange={(e) => setFormData({ ...formData, lastWorkingDate: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Notice Period (Days) <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    required
                                    min="0"
                                    className="input-field"
                                    value={formData.noticePeriodDays}
                                    onChange={(e) => setFormData({ ...formData, noticePeriodDays: e.target.value })}
                                />
                            </div>
                            {parseInt(formData.noticePeriodDays) > 0 && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Last Working Day
                                    </label>
                                    <input
                                        type="date"
                                        className="input-field"
                                        value={formData.lastWorkingDay}
                                        onChange={(e) => setFormData({ ...formData, lastWorkingDay: e.target.value })}
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Compensation */}
                    <div className="border-t border-gray-200 pt-6">
                        <h3 className="font-bold text-gray-900 mb-4">Compensation</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Current CTC (in ₹ Lakhs) <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    required
                                    step="0.01"
                                    min="0"
                                    className="input-field"
                                    value={formData.currentCTC}
                                    onChange={(e) => setFormData({ ...formData, currentCTC: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Expected CTC (in ₹ Lakhs) <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    required
                                    step="0.01"
                                    min="0"
                                    className="input-field"
                                    value={formData.expectedCTC}
                                    onChange={(e) => setFormData({ ...formData, expectedCTC: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Resume Upload */}
                    <div className="border-t border-gray-200 pt-6">
                        <h3 className="font-bold text-gray-900 mb-4">Resume Upload</h3>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Upload Resume (PDF or Word, max 1MB) <span className="text-red-500">*</span>
                            </label>
                            <div className="flex items-center gap-4">
                                <label className="btn-secondary cursor-pointer">
                                    <Upload className="w-4 h-4 mr-2" />
                                    Choose File
                                    <input
                                        type="file"
                                        accept=".pdf,.doc,.docx"
                                        onChange={handleFileChange}
                                        className="hidden"
                                    />
                                </label>
                                {resumeFile && (
                                    <span className="text-sm text-green-600 flex items-center">
                                        ✓ {resumeFile.name} ({(resumeFile.size / 1024).toFixed(0)} KB)
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Consent */}
                    <div className="border-t border-gray-200 pt-6">
                        <label className="flex items-start gap-3">
                            <input
                                type="checkbox"
                                required
                                className="mt-1"
                                checked={formData.consent}
                                onChange={(e) => setFormData({ ...formData, consent: e.target.checked })}
                            />
                            <span className="text-sm text-gray-700">
                                I confirm that the above details are correct and I agree to be contacted by Achariya HR team regarding this application.
                            </span>
                        </label>
                    </div>

                    {/* Submit */}
                    <div className="flex gap-3 justify-end pt-6 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={onClose}
                            className="btn-secondary"
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn-primary"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <Loader className="w-4 h-4 mr-2 animate-spin" />
                                    Submitting...
                                </>
                            ) : (
                                'Submit Application'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

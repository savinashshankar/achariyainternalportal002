import { Link } from 'react-router-dom';
import { ArrowLeft, Building, Users, TrendingUp, Award } from 'lucide-react';
import { sampleData } from '../../data/sampleData';

const PrincipalSchoolDetail = () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const role = user.selectedRole?.toLowerCase() || 'principal'; // FIX FOR ISSUE #5
    const schoolId = user.email?.includes('college') ? 2 : 1;
    const school = sampleData.schools.find(s => s.id === schoolId) || sampleData.schools[0];

    const schoolStudents = sampleData.students.filter(s => s.school_id === school.id);
    const avgCompletion = Math.round(
        schoolStudents.reduce((sum, s) => sum + s.completion, 0) / schoolStudents.length
    );

    return (
        <div>
            {/* Use role-aware navigation (FIX FOR ISSUE #5) */}
            <Link
                to={`/${role}/dashboard`}
                className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4"
            >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
            </Link>

            {/* School Header */}
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-4 sm:p-6 lg:p-8 text-white mb-4 sm:mb-6">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">{school.name}</h1>
                        <p className="text-blue-100 mb-4">{school.location} • {school.type}</p>
                        <div className="flex gap-4">
                            <span className="px-3 py-1 bg-white/20 rounded-full text-sm">Est. 2010</span>
                            <span className="px-3 py-1 bg-white/20 rounded-full text-sm">CBSE Affiliated</span>
                        </div>
                    </div>
                    <Building className="w-16 h-16 sm:w-24 sm:h-24 opacity-50 hidden sm:block" />
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mb-6 sm:mb-8">
                <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border">
                    <Users className="w-8 h-8 sm:w-10 sm:h-10 text-blue-600 mb-2 sm:mb-3" />
                    <p className="text-gray-600 text-xs sm:text-sm">Total Students</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800">{schoolStudents.length}</p>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border">
                    <TrendingUp className="w-8 h-8 sm:w-10 sm:h-10 text-green-600 mb-2 sm:mb-3" />
                    <p className="text-gray-600 text-xs sm:text-sm">Avg Completion</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-green-600">{avgCompletion}%</p>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border">
                    <Award className="w-8 h-8 sm:w-10 sm:h-10 text-yellow-600 mb-2 sm:mb-3" />
                    <p className="text-gray-600 text-xs sm:text-sm">Avg Quiz Score</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-yellow-600">
                        {Math.round(schoolStudents.reduce((sum, s) => sum + s.quiz_avg, 0) / schoolStudents.length)}%
                    </p>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border">
                    <Building className="w-8 h-8 sm:w-10 sm:h-10 text-purple-600 mb-2 sm:mb-3" />
                    <p className="text-gray-600 text-xs sm:text-sm">Courses</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-purple-600">{sampleData.courses.length}</p>
                </div>
            </div>

            {/* Performance Overview */}
            <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border mb-4 sm:mb-6">
                <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-3 sm:mb-4">Performance Overview</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                    <div>
                        <p className="text-sm text-gray-600 mb-2">High Performers (≥85%)</p>
                        <div className="flex items-center">
                            <p className="text-2xl font-bold text-green-600">
                                {schoolStudents.filter(s => s.completion >= 85).length}
                            </p>
                            <p className="text-sm text-gray-600 ml-2">students</p>
                        </div>
                    </div>
                    <div>
                        <p className="text-sm text-gray-600 mb-2">On Track (70-84%)</p>
                        <div className="flex items-center">
                            <p className="text-2xl font-bold text-yellow-600">
                                {schoolStudents.filter(s => s.completion >= 70 && s.completion < 85).length}
                            </p>
                            <p className="text-sm text-gray-600 ml-2">students</p>
                        </div>
                    </div>
                    <div>
                        <p className="text-sm text-gray-600 mb-2">Needs Attention (&lt;70%)</p>
                        <div className="flex items-center">
                            <p className="text-2xl font-bold text-red-600">
                                {schoolStudents.filter(s => s.completion < 70).length}
                            </p>
                            <p className="text-sm text-gray-600 ml-2">students</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* School Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl shadow-sm p-6 border">
                    <h3 className="font-bold text-gray-800 mb-4">School Information</h3>
                    <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                            <span className="text-gray-600">Type:</span>
                            <span className="font-semibold">{school.type}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Location:</span>
                            <span className="font-semibold">{school.location}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Board:</span>
                            <span className="font-semibold">CBSE</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Grades:</span>
                            <span className="font-semibold">1-12</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6 border">
                    <h3 className="font-bold text-gray-800 mb-4">Contact Details</h3>
                    <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                            <span className="text-gray-600">Email:</span>
                            <span className="font-semibold">admin@achariya.org</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Phone:</span>
                            <span className="font-semibold">+91 80 1234 5678</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Website:</span>
                            <span className="font-semibold text-blue-600">www.achariya.in</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PrincipalSchoolDetail;

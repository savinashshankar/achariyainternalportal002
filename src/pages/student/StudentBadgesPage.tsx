import { Link } from 'react-router-dom';
import { ArrowLeft, Award } from 'lucide-react';
import { sampleData } from '../../data/sampleData';

const StudentBadgesPage = () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const student = sampleData.students.find(s => s.email === user.email) || sampleData.students[0];

    // Get badges for this student
    const earnedBadges = sampleData.badges.slice(0, student.badges);
    const availableBadges = sampleData.badges.slice(student.badges);

    return (
        <div>
            <Link to="/student/dashboard" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
            </Link>

            <h1 className="text-3xl font-bold text-gray-800 mb-6">My Badges</h1>

            {/* Earned Badges */}
            <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Earned Badges ({student.badges})</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {earnedBadges.map((badge: any) => (
                        <div key={badge.id} className="bg-white rounded-xl shadow-sm p-6 border text-center">
                            <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Award className="w-10 h-10 text-yellow-600" />
                            </div>
                            <h3 className="font-bold text-gray-800 mb-2">{badge.name}</h3>
                            <p className="text-sm text-gray-600 mb-1">{badge.description}</p>
                            <p className="text-xs text-gray-500 mb-3">Earned from: {badge.activity}</p>
                            <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                                Earned
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Available Badges */}
            {availableBadges.length > 0 && (
                <div>
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Available to Earn</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {availableBadges.map((badge: any) => (
                            <div key={badge.id} className="bg-white rounded-xl shadow-sm p-6 border text-center opacity-60">
                                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Award className="w-10 h-10 text-gray-400" />
                                </div>
                                <h3 className="font-bold text-gray-800 mb-2">{badge.name}</h3>
                                <p className="text-sm text-gray-600">{badge.description}</p>
                                <span className="inline-block mt-3 px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-semibold">
                                    Locked
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudentBadgesPage;

import { Link } from 'react-router-dom';
import { ArrowLeft, UserCheck, Award } from 'lucide-react';

const referrals = [
    {
        id: 1,
        referrer: 'Rajesh Kumar',
        mobile: '9876543210',
        relationship: 'Parent (Grade 3)',
        referred_student: 'Amit Singh',
        referred_grade: '1',
        status: 'Converted',
        date: '2024-12-15'
    },
    {
        id: 2,
        referrer: 'Priya Sharma',
        mobile: '9123456789',
        relationship: 'Parent (LKG)',
        referred_student: 'Neha Gupta',
        referred_grade: 'LKG',
        status: 'Visit Scheduled',
        date: '2024-12-20'
    },
    {
        id: 3,
        referrer: 'Venkat Reddy',
        mobile: '9876501234',
        relationship: 'Parent (Grade 12)',
        referred_student: 'Krishna Patel',
        referred_grade: '10',
        status: 'Contacted',
        date: '2024-12-22'
    },
    {
        id: 4,
        referrer: 'Sunita Nair',
        mobile: '9445566778',
        relationship: 'Staff',
        referred_student: 'Arun Nair',
        referred_grade: 'UKG',
        status: 'New',
        date: '2024-12-28'
    }
];

export default function ReferralTracker() {
    const converted = referrals.filter(r => r.status === 'Converted').length;
    const active = referrals.filter(r => r.status !== 'Converted').length;

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center gap-4">
                        <Link to="/" className="text-gray-600 hover:text-gray-900">
                            <ArrowLeft className="w-6 h-6" />
                        </Link>
                        <img src="/logo.png" alt="Achariya" className="h-12 w-12" />
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Referral Tracker</h1>
                            <p className="text-sm text-gray-600 mt-1">Track Referrals & Referrer Success</p>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="card">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Total Referrals</p>
                                <p className="text-3xl font-bold text-gray-900 mt-1">{referrals.length}</p>
                            </div>
                            <UserCheck className="w-12 h-12 text-teal-600 opacity-20" />
                        </div>
                    </div>

                    <div className="card">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Converted</p>
                                <p className="text-3xl font-bold text-green-600 mt-1">{converted}</p>
                            </div>
                            <Award className="w-12 h-12 text-green-600 opacity-20" />
                        </div>
                    </div>

                    <div className="card">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Active Pipeline</p>
                                <p className="text-3xl font-bold text-blue-600 mt-1">{active}</p>
                            </div>
                            <UserCheck className="w-12 h-12 text-blue-600 opacity-20" />
                        </div>
                    </div>
                </div>

                {/* Referrals Table */}
                <div className="card overflow-hidden">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">All Referrals</h2>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Referrer</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mobile</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Relationship</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Referred Student</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Grade</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {referrals.map((ref) => (
                                    <tr key={ref.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{ref.referrer}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{ref.mobile}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{ref.relationship}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{ref.referred_student}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{ref.referred_grade}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${ref.status === 'Converted' ? 'bg-green-100 text-green-800' :
                                                    ref.status === 'Visit Scheduled' ? 'bg-yellow-100 text-yellow-800' :
                                                        ref.status === 'Contacted' ? 'bg-purple-100 text-purple-800' :
                                                            'bg-blue-100 text-blue-800'
                                                }`}>
                                                {ref.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                            {new Date(ref.date).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <p className="text-center text-sm text-gray-500 mt-8">
                    POC Demo - Referral tracking system
                </p>
            </main>
        </div>
    );
}

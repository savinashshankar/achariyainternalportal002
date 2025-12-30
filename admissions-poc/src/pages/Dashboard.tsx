import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, UserPlus, CheckCircle, Clock, Search, Filter } from 'lucide-react';
import { mockLeads } from '../data/mockLeads';

const STATUS_COLORS: Record<string, string> = {
    "New": "bg-blue-100 text-blue-800",
    "Contacted": "bg-purple-100 text-purple-800",
    "Visit Scheduled": "bg-yellow-100 text-yellow-800",
    "Visit Done": "bg-orange-100 text-orange-800",
    "Decision Pending": "bg-pink-100 text-pink-800",
    "Converted": "bg-green-100 text-green-800",
    "Not Interested": "bg-gray-100 text-gray-800",
    "Closed": "bg-red-100 text-red-800",
};

export default function Dashboard() {
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('');

    // Calculate KPIs
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const leadsToday = mockLeads.filter(lead => {
        const leadDate = new Date(lead.created_at);
        leadDate.setHours(0, 0, 0, 0);
        return leadDate.getTime() === today.getTime();
    }).length;

    const newLeads = mockLeads.filter(l => l.status === 'New').length;
    const convertedLeads = mockLeads.filter(l => l.status === 'Converted').length;

    // Filter leads
    const filteredLeads = mockLeads.filter(lead => {
        const matchesSearch = searchQuery === '' ||
            lead.student_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            lead.parent_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            lead.mobile_number.includes(searchQuery);

        const matchesStatus = statusFilter === '' || lead.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    const getLeadAge = (createdAt: Date) => {
        const now = new Date();
        const diff = now.getTime() - new Date(createdAt).getTime();
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        return days === 0 ? 'Today' : `${days}d ago`;
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-4">
                            <img src="/logo.png" alt="Achariya" className="h-12 w-12" />
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Admissions Dashboard</h1>
                                <p className="text-sm text-gray-600 mt-1">Achariya Admissions POC</p>
                            </div>
                        </div>
                        <Link to="/intake" className="btn-primary">
                            <UserPlus className="w-4 h-4 inline mr-2" />
                            New Lead
                        </Link>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="card">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Total Leads</p>
                                <p className="text-3xl font-bold text-gray-900 mt-1">{mockLeads.length}</p>
                            </div>
                            <Users className="w-12 h-12 text-teal-600 opacity-20" />
                        </div>
                    </div>

                    <div className="card">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Leads Today</p>
                                <p className="text-3xl font-bold text-gray-900 mt-1">{leadsToday}</p>
                            </div>
                            <Clock className="w-12 h-12 text-blue-600 opacity-20" />
                        </div>
                    </div>

                    <div className="card">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">New</p>
                                <p className="text-3xl font-bold text-gray-900 mt-1">{newLeads}</p>
                            </div>
                            <UserPlus className="w-12 h-12 text-purple-600 opacity-20" />
                        </div>
                    </div>

                    <div className="card">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Converted</p>
                                <p className="text-3xl font-bold text-gray-900 mt-1">{convertedLeads}</p>
                            </div>
                            <CheckCircle className="w-12 h-12 text-green-600 opacity-20" />
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="card mb-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search by student, parent, or mobile..."
                                    className="input-field pl-10"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="w-full md:w-64">
                            <div className="relative">
                                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <select
                                    className="input-field pl-10"
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                >
                                    <option value="">All Statuses</option>
                                    <option value="New">New</option>
                                    <option value="Contacted">Contacted</option>
                                    <option value="Visit Scheduled">Visit Scheduled</option>
                                    <option value="Converted">Converted</option>
                                    <option value="Decision Pending">Decision Pending</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Leads Table */}
                <div className="card overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lead ID</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grade</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Parent</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mobile</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Source</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Age</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredLeads.map((lead) => (
                                    <tr key={lead.lead_id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{lead.lead_id}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{lead.student_name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{lead.grade_applying_for}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{lead.parent_name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{lead.mobile_number}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{lead.lead_source}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${STATUS_COLORS[lead.status]}`}>
                                                {lead.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{getLeadAge(lead.created_at)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {filteredLeads.length === 0 && (
                        <div className="text-center py-12">
                            <p className="text-gray-500">No leads found matching your filters.</p>
                        </div>
                    )}
                </div>

                {/* Footer Note */}
                <div className="mt-8 text-center text-sm text-gray-500">
                    <p>POC Demo - Using mock data | Built with React + TypeScript</p>
                </div>
            </main>
        </div>
    );
}

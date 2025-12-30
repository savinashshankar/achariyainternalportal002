import { Link } from 'react-router-dom';
import { ArrowLeft, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { mockLeads } from '../data/mockLeads';

export default function SLAMonitor() {
    // Calculate SLA status for each lead
    const leadsWithSLA = mockLeads.map(lead => {
        const created = new Date(lead.created_at);
        const contacted = lead.first_contact_at ? new Date(lead.first_contact_at) : null;

        const minutesToContact = contacted
            ? Math.floor((contacted.getTime() - created.getTime()) / (1000 * 60))
            : Math.floor((new Date().getTime() - created.getTime()) / (1000 * 60));

        let slaStatus: 'ok' | 'warning' | 'breach' = 'ok';
        if (!contacted) {
            if (minutesToContact > 60) slaStatus = 'breach';
            else if (minutesToContact > 30) slaStatus = 'warning';
        }

        return { ...lead, minutesToContact, slaStatus, contacted: !!contacted };
    });

    const breaches = leadsWithSLA.filter(l => l.slaStatus === 'breach').length;
    const warnings = leadsWithSLA.filter(l => l.slaStatus === 'warning').length;
    const onTime = leadsWithSLA.filter(l => l.slaStatus === 'ok').length;

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
                            <h1 className="text-2xl font-bold text-gray-900">SLA Monitor</h1>
                            <p className="text-sm text-gray-600 mt-1">Response Time & Breach Tracking</p>
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
                                <p className="text-sm text-gray-600">On Time</p>
                                <p className="text-3xl font-bold text-green-600 mt-1">{onTime}</p>
                                <p className="text-xs text-gray-500 mt-1">Within 30 min</p>
                            </div>
                            <CheckCircle className="w-12 h-12 text-green-600 opacity-20" />
                        </div>
                    </div>

                    <div className="card">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Warnings</p>
                                <p className="text-3xl font-bold text-yellow-600 mt-1">{warnings}</p>
                                <p className="text-xs text-gray-500 mt-1">30-60 min</p>
                            </div>
                            <Clock className="w-12 h-12 text-yellow-600 opacity-20" />
                        </div>
                    </div>

                    <div className="card">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">SLA Breaches</p>
                                <p className="text-3xl font-bold text-red-600 mt-1">{breaches}</p>
                                <p className="text-xs text-gray-500 mt-1">&gt;60 min</p>
                            </div>
                            <AlertCircle className="w-12 h-12 text-red-600 opacity-20" />
                        </div>
                    </div>
                </div>

                {/* SLA Table */}
                <div className="card overflow-hidden">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">Lead Response Times</h2>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Lead ID</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Response Time</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">SLA</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {leadsWithSLA.map((lead) => (
                                    <tr key={lead.lead_id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{lead.lead_id}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{lead.student_name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                            {new Date(lead.created_at).toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                            {lead.contacted ? `${lead.minutesToContact} min` : 'Not contacted'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{lead.status}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {lead.slaStatus === 'ok' && (
                                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                    On Time
                                                </span>
                                            )}
                                            {lead.slaStatus === 'warning' && (
                                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                                                    Warning
                                                </span>
                                            )}
                                            {lead.slaStatus === 'breach' && (
                                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                                                    Breach
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="mt-6 text-center text-sm text-gray-500">
                    <p>POC Demo - SLA threshold: 30 min warning, 60 min breach</p>
                </div>
            </main>
        </div>
    );
}

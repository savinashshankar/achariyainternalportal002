import { Link } from 'react-router-dom';
import { ArrowLeft, TrendingUp, Users, Target } from 'lucide-react';

export default function AnalyticsDashboard() {
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
                            <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
                            <p className="text-sm text-gray-600 mt-1">Charts, Insights & Trends</p>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* KPI Row */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="card">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">This Month</p>
                                <p className="text-3xl font-bold text-gray-900 mt-1">87</p>
                                <p className="text-xs text-green-600 mt-1">↑ 23% vs last month</p>
                            </div>
                            <TrendingUp className="w-10 h-10 text-green-600 opacity-20" />
                        </div>
                    </div>

                    <div className="card">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Avg. Response</p>
                                <p className="text-3xl font-bold text-gray-900 mt-1">18m</p>
                                <p className="text-xs text-green-600 mt-1">↓ 5 min improvement</p>
                            </div>
                            <Users className="w-10 h-10 text-blue-600 opacity-20" />
                        </div>
                    </div>

                    <div className="card">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Conversion</p>
                                <p className="text-3xl font-bold text-gray-900 mt-1">24%</p>
                                <p className="text-xs text-green-600 mt-1">↑ 4% vs last month</p>
                            </div>
                            <Target className="w-10 h-10 text-teal-600 opacity-20" />
                        </div>
                    </div>

                    <div className="card">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Best Source</p>
                                <p className="text-lg font-bold text-gray-900 mt-1">Referral</p>
                                <p className="text-xs text-gray-600 mt-1">35% conversion</p>
                            </div>
                            <Users className="w-10 h-10 text-purple-600 opacity-20" />
                        </div>
                    </div>
                </div>

                {/* Charts Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    {/* Lead Source Chart */}
                    <div className="card">
                        <h3 className="font-bold text-gray-900 mb-4">Leads by Source</h3>
                        <div className="space-y-3">
                            {[
                                { source: 'Referral', count: 45, color: 'bg-purple-500', percentage: 30 },
                                { source: 'Website', count: 38, color: 'bg-blue-500', percentage: 25 },
                                { source: 'Walk-in', count: 35, color: 'bg-teal-500', percentage: 23 },
                                { source: 'Campaign', count: 20, color: 'bg-orange-500', percentage: 13 },
                                { source: 'Other', count: 12, color: 'bg-gray-500', percentage: 9 }
                            ].map(item => (
                                <div key={item.source}>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-gray-700">{item.source}</span>
                                        <span className="font-medium text-gray-900">{item.count}</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div className={`${item.color} h-2 rounded-full`} style={{ width: `${item.percentage * 3}%` }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Grade Distribution */}
                    <div className="card">
                        <h3 className="font-bold text-gray-900 mb-4">Grade Distribution</h3>
                        <div className="grid grid-cols-3 gap-3">
                            {[
                                { grade: 'LKG-UKG', count: 42, color: 'bg-pink-500' },
                                { grade: '1-5', count: 38, color: 'bg-blue-500' },
                                { grade: '6-8', count: 28, color: 'bg-teal-500' },
                                { grade: '9-10', count: 22, color: 'bg-orange-500' },
                                { grade: '11-12', count: 20, color: 'bg-purple-500' }
                            ].map(item => (
                                <div key={item.grade} className="text-center p-4 bg-gray-50 rounded-lg">
                                    <div className={`${item.color} w-12 h-12 rounded-full mx-auto flex items-center justify-center text-white font-bold text-lg mb-2`}>
                                        {item.count}
                                    </div>
                                    <p className="text-sm font-medium text-gray-700">{item.grade}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Trends */}
                <div className="card">
                    <h3 className="font-bold text-gray-900 mb-4">Monthly Trend (Last 6 Months)</h3>
                    <div className="flex items-end justify-between gap-4 h-64">
                        {[45, 52, 48, 65, 73, 87].map((value, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center gap-2">
                                <div className="text-sm font-bold text-gray-900">{value}</div>
                                <div className="w-full bg-teal-500 rounded-t-lg transition-all hover:bg-teal-600" style={{ height: `${value}%` }} />
                                <div className="text-xs text-gray-600">
                                    {['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i]}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <p className="text-center text-sm text-gray-500 mt-8">
                    POC Demo - Analytics dashboard with charts & insights
                </p>
            </main>
        </div>
    );
}

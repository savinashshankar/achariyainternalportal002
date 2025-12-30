import { Link } from 'react-router-dom';
import { ArrowLeft, TrendingDown } from 'lucide-react';

const funnelStages = [
    { name: 'New Leads', count: 150, percentage: 100, color: 'bg-blue-500' },
    { name: 'Contacted', count: 120, percentage: 80, color: 'bg-purple-500' },
    { name: 'Visit Scheduled', count: 85, percentage: 57, color: 'bg-yellow-500' },
    { name: 'Visit Completed', count: 75, percentage: 50, color: 'bg-orange-500' },
    { name: 'Decision Pending', count: 45, percentage: 30, color: 'bg-pink-500' },
    { name: 'Converted', count: 30, percentage: 20, color: 'bg-green-500' }
];

export default function FunnelVisualizer() {
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
                            <h1 className="text-2xl font-bold text-gray-900">Funnel Visualizer</h1>
                            <p className="text-sm text-gray-600 mt-1">Conversion Stages & Drop-off Analysis</p>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="card">
                        <p className="text-sm text-gray-600">Total Leads</p>
                        <p className="text-3xl font-bold text-gray-900 mt-1">150</p>
                    </div>
                    <div className="card">
                        <p className="text-sm text-gray-600">Conversion Rate</p>
                        <p className="text-3xl font-bold text-green-600 mt-1">20%</p>
                    </div>
                    <div className="card">
                        <p className="text-sm text-gray-600">Biggest Drop</p>
                        <p className="text-3xl font-bold text-red-600 mt-1 flex items-center gap-2">
                            <TrendingDown className="w-6 h-6" />
                            20%
                        </p>
                        <p className="text-xs text-gray-500 mt-1">Contact → Visit</p>
                    </div>
                </div>

                {/* Funnel Visualization */}
                <div className="card">
                    <h2 className="text-xl font-bold text-gray-900 mb-6">Conversion Funnel</h2>

                    <div className="space-y-4">
                        {funnelStages.map((stage, index) => (
                            <div key={stage.name}>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="font-medium text-gray-900">{stage.name}</span>
                                    <span className="text-sm text-gray-600">
                                        {stage.count} leads ({stage.percentage}%)
                                    </span>
                                </div>

                                <div className="relative">
                                    <div className="w-full bg-gray-200 rounded-full h-12 flex items-center">
                                        <div
                                            className={`${stage.color} h-12 rounded-full transition-all duration-500 flex items-center justify-center text-white font-bold`}
                                            style={{ width: `${stage.percentage}%` }}
                                        >
                                            {stage.percentage >= 30 && stage.count}
                                        </div>
                                    </div>
                                </div>

                                {/* Drop-off indicator */}
                                {index < funnelStages.length - 1 && (
                                    <div className="flex items-center gap-2 mt-2 text-xs text-red-600">
                                        <TrendingDown className="w-3 h-3" />
                                        <span>
                                            {stage.count - funnelStages[index + 1].count} leads dropped
                                            ({Math.round(((stage.count - funnelStages[index + 1].count) / stage.count) * 100)}% loss)
                                        </span>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Insights */}
                    <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <h3 className="font-bold text-yellow-900 mb-2">💡 Insights</h3>
                        <ul className="text-sm text-yellow-800 space-y-1">
                            <li>• Biggest drop: Contact → Visit Scheduled (29% loss)</li>
                            <li>• Strong conversion at final stage (67% pending convert)</li>
                            <li>• Consider improving follow-up strategy after first contact</li>
                        </ul>
                    </div>
                </div>

                <p className="text-center text-sm text-gray-500 mt-8">
                    POC Demo - Conversion funnel visualization
                </p>
            </main>
        </div>
    );
}

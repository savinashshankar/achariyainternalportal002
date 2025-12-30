import { Link } from 'react-router-dom';
import { ArrowLeft, Sparkles, Check } from 'lucide-react';

const phases = [
    {
        phase: 'Phase 1',
        title: 'Foundation',
        status: 'complete',
        features: ['Lead Management', 'Dashboard & Reporting', 'Basic Analytics']
    },
    {
        phase: 'Phase 2',
        title: 'Automation',
        status: 'in-progress',
        features: ['WhatsApp Integration', 'Auto Follow-ups', 'Email Campaigns']
    },
    {
        phase: 'Phase 3',
        title: 'Intelligence',
        status: 'planned',
        features: ['AI Lead Scoring', 'Predictive Analytics', 'Smart Recommendations']
    },
    {
        phase: 'Phase 4',
        title: 'Experience',
        status: 'planned',
        features: ['Mobile App (iOS/Android)', 'Parent Portal', 'Virtual Tours']
    },
    {
        phase: 'Phase 5',
        title: 'Integration',
        status: 'planned',
        features: ['LMS Integration', 'Payment Gateway', 'Document Management']
    }
];

export default function VisionShell() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-teal-50">
            <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center gap-4">
                        <Link to="/" className="text-gray-600 hover:text-gray-900">
                            <ArrowLeft className="w-6 h-6" />
                        </Link>
                        <img src="/logo.png" alt="Achariya" className="h-12 w-12" />
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Future Vision</h1>
                            <p className="text-sm text-gray-600 mt-1">Achariya Admissions Platform Roadmap</p>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Hero */}
                <div className="text-center mb-12">
                    <Sparkles className="w-16 h-16 text-teal-600 mx-auto mb-4" />
                    <h2 className="text-4xl font-bold text-gray-900 mb-4">
                        The Complete Admissions Platform
                    </h2>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        From lead capture to enrollment - a comprehensive solution built in-house,
                        no vendor lock-in, fully customizable to Achariya's needs.
                    </p>
                </div>

                {/* Roadmap */}
                <div className="space-y-6">
                    {phases.map((phase, index) => (
                        <div
                            key={phase.phase}
                            className={`card ${phase.status === 'complete' ? 'bg-green-50 border-green-200' :
                                    phase.status === 'in-progress' ? 'bg-blue-50 border-blue-200' :
                                        'bg-gray-50'
                                }`}
                        >
                            <div className="flex items-start gap-4">
                                <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-white font-bold ${phase.status === 'complete' ? 'bg-green-600' :
                                        phase.status === 'in-progress' ? 'bg-blue-600' :
                                            'bg-gray-400'
                                    }`}>
                                    {phase.status === 'complete' ? <Check className="w-6 h-6" /> : index + 1}
                                </div>

                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="text-xl font-bold text-gray-900">{phase.phase}: {phase.title}</h3>
                                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${phase.status === 'complete' ? 'bg-green-200 text-green-800' :
                                                phase.status === 'in-progress' ? 'bg-blue-200 text-blue-800' :
                                                    'bg-gray-200 text-gray-700'
                                            }`}>
                                            {phase.status === 'complete' ? 'Complete' :
                                                phase.status === 'in-progress' ? 'In Progress' :
                                                    'Planned'}
                                        </span>
                                    </div>

                                    <ul className="grid grid-cols-1 md:grid-cols-3 gap-2">
                                        {phase.features.map((feature, i) => (
                                            <li key={i} className="flex items-center gap-2 text-sm text-gray-700">
                                                <Check className="w-4 h-4 text-teal-600 flex-shrink-0" />
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Benefits */}
                <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="card text-center">
                        <div className="text-4xl mb-3">💰</div>
                        <h3 className="font-bold text-gray-900 mb-2">Cost Savings</h3>
                        <p className="text-sm text-gray-600">
                            No monthly SaaS fees. Build once, use forever.
                        </p>
                    </div>

                    <div className="card text-center">
                        <div className="text-4xl mb-3">🎨</div>
                        <h3 className="font-bold text-gray-900 mb-2">Full Customization</h3>
                        <p className="text-sm text-gray-600">
                            Tailored to Achariya's exact workflow and needs.
                        </p>
                    </div>

                    <div className="card text-center">
                        <div className="text-4xl mb-3">🔒</div>
                        <h3 className="font-bold text-gray-900 mb-2">Data Ownership</h3>
                        <p className="text-sm text-gray-600">
                            Your data, your servers, complete control.
                        </p>
                    </div>
                </div>

                <p className="text-center text-sm text-gray-500 mt-12">
                    POC Demo - Platform vision & roadmap
                </p>
            </main>
        </div>
    );
}

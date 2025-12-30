import { Link } from 'react-router-dom';
import {
    LayoutDashboard,
    UserPlus,
    Clock,
    ClipboardList,
    Users,
    Calendar,
    TrendingUp,
    UserCheck,
    BarChart3,
    Sparkles
} from 'lucide-react';

const POCs = [
    {
        id: 1,
        title: 'Lead Dashboard',
        description: 'View all leads with KPIs and filters',
        icon: LayoutDashboard,
        route: '/dashboard',
        color: 'bg-blue-500'
    },
    {
        id: 2,
        title: 'Lead Intake',
        description: 'Capture new enquiries in 30 seconds',
        icon: UserPlus,
        route: '/intake',
        color: 'bg-teal-500'
    },
    {
        id: 3,
        title: 'SLA Monitor',
        description: 'Track response time & SLA breaches',
        icon: Clock,
        route: '/sla-monitor',
        color: 'bg-orange-500'
    },
    {
        id: 4,
        title: 'Task Board',
        description: 'Daily follow-ups for counselors',
        icon: ClipboardList,
        route: '/task-board',
        color: 'bg-purple-500'
    },
    {
        id: 5,
        title: 'Parent Portal',
        description: 'Self-service enquiry form for parents',
        icon: Users,
        route: '/parent-portal',
        color: 'bg-pink-500'
    },
    {
        id: 6,
        title: 'Visit Booking',
        description: 'Schedule campus visits easily',
        icon: Calendar,
        route: '/visit-booking',
        color: 'bg-green-500'
    },
    {
        id: 7,
        title: 'Funnel Visualizer',
        description: 'Conversion stages & drop-off analysis',
        icon: TrendingUp,
        route: '/funnel',
        color: 'bg-indigo-500'
    },
    {
        id: 8,
        title: 'Referral Tracker',
        description: 'Track referrals & referrer success',
        icon: UserCheck,
        route: '/referrals',
        color: 'bg-yellow-500'
    },
    {
        id: 9,
        title: 'Analytics Dashboard',
        description: 'Charts, insights & trends',
        icon: BarChart3,
        route: '/analytics',
        color: 'bg-red-500'
    },
    {
        id: 10,
        title: 'Future Vision',
        description: 'Roadmap & platform vision',
        icon: Sparkles,
        route: '/vision',
        color: 'bg-gray-500'
    }
];

export default function POCGallery() {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex items-center gap-4">
                        <img src="/logo.png" alt="Achariya" className="h-16 w-16" />
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Admissions POC Suite</h1>
                            <p className="text-gray-600 mt-1">10 Technical Demonstrations - Achariya Intelligence</p>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Introduction */}
                <div className="card mb-12">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Welcome to the Admissions POC Gallery</h2>
                    <p className="text-gray-600 mb-4">
                        This suite contains 10 standalone proof-of-concept applications demonstrating how technology
                        can enable and enhance the admissions process. Each POC is independent and can be evaluated separately.
                    </p>
                    <p className="text-gray-600">
                        <strong>Click any card below to explore.</strong> Each POC has its own shareable URL for easy demonstration.
                    </p>
                </div>

                {/* POC Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {POCs.map((poc) => {
                        const Icon = poc.icon;
                        return (
                            <Link
                                key={poc.id}
                                to={poc.route}
                                className="card hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer group"
                            >
                                <div className="flex items-start gap-4">
                                    <div className={`${poc.color} p-3 rounded-lg text-white group-hover:scale-110 transition-transform`}>
                                        <Icon className="w-6 h-6" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-bold text-gray-900 text-lg mb-2 group-hover:text-teal-600 transition-colors">
                                            {poc.title}
                                        </h3>
                                        <p className="text-gray-600 text-sm">
                                            {poc.description}
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-4 flex items-center text-teal-600 font-medium text-sm">
                                    <span>Explore POC</span>
                                    <svg className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </div>
                            </Link>
                        );
                    })}
                </div>

                {/* Footer Note */}
                <div className="mt-12 text-center">
                    <p className="text-gray-500 text-sm">
                        Built with React + TypeScript | All POCs use mock data for demonstration
                    </p>
                    <p className="text-gray-400 text-xs mt-2">
                        Shareable URLs: Each POC accessible via individual route
                    </p>
                </div>
            </main>
        </div>
    );
}

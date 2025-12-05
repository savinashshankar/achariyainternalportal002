import { Outlet, useNavigate, Link } from 'react-router-dom';
import { LogOut, Home, BookOpen, Wallet, Award, Users, FileText, Settings, HelpCircle } from 'lucide-react';

const Layout = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const role = user.selectedRole || user.role;

    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
    };

    const getNavItems = () => {
        switch (role) {
            case 'Student':
                return [
                    { to: '/student/dashboard', icon: Home, label: 'Dashboard' },
                    { to: '/student/courses', icon: BookOpen, label: 'Courses' },
                    { to: '/student/wallet', icon: Wallet, label: 'Wallet' },
                    { to: '/student/badges', icon: Award, label: 'Badges' },
                    { to: '/student/faq', icon: HelpCircle, label: 'FAQ' }
                ];
            case 'Teacher':
                return [
                    { to: '/teacher/dashboard', icon: Home, label: 'Dashboard' },
                    { to: '/teacher/courses', icon: BookOpen, label: 'Courses' },
                    { to: '/teacher/evidence', icon: FileText, label: 'Evidence' },
                    { to: '/teacher/faq', icon: HelpCircle, label: 'FAQ' }
                ];
            case 'Principal':
                return [
                    { to: '/principal/dashboard', icon: Home, label: 'Dashboard' },
                    { to: '/principal/courses', icon: BookOpen, label: 'Courses' },
                    { to: '/principal/faq', icon: HelpCircle, label: 'FAQ' }
                ];
            case 'Admin':
                return [
                    { to: '/admin/dashboard', icon: Home, label: 'Dashboard' },
                    { to: '/admin/courses', icon: BookOpen, label: 'Courses' },
                    { to: '/admin/users', icon: Users, label: 'Users' },
                    { to: '/admin/config', icon: Settings, label: 'Config' },
                    { to: '/admin/faq', icon: HelpCircle, label: 'FAQ' }
                ];
            default:
                return [];
        }
    };

    const navItems = getNavItems();

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Top Navigation */}
            <nav className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <div className="w-10 h-10 mr-3 flex items-center justify-center">
                                <img src="/achariya-logo.jpg" alt="Achariya" className="w-full h-full object-contain" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-gray-800">Achariya Portal</h1>
                                <p className="text-xs text-gray-500">{role}</p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-4">
                            <div className="flex items-center">
                                <div className="w-8 h-8 mr-2 rounded-full overflow-hidden border-2 border-gray-200">
                                    <img src="/achariya-logo.jpg" alt={user.name} className="w-full h-full object-cover" />
                                </div>
                                <span className="text-sm text-gray-700">{user.name || user.email}</span>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="flex items-center px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition"
                            >
                                <LogOut className="w-4 h-4 mr-1" />
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="flex">
                {/* Sidebar */}
                <aside className="w-64 bg-white shadow-sm min-h-[calc(100vh-4rem)] border-r">
                    <nav className="py-4">
                        {navItems.map((item) => (
                            <Link
                                key={item.to}
                                to={item.to}
                                className="flex items-center px-6 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition"
                            >
                                <item.icon className="w-5 h-5 mr-3" />
                                {item.label}
                            </Link>
                        ))}
                    </nav>
                </aside>

                {/* Main Content */}
                <main className="flex-1 p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default Layout;

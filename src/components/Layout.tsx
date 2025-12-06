import { Outlet, useNavigate, Link } from 'react-router-dom';
import { LogOut, Home, BookOpen, Wallet, Award, Users, FileText, Settings, HelpCircle, Menu, X } from 'lucide-react';
import { useState } from 'react';

const Layout = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const role = user.selectedRole || user.role;
    const [sidebarOpen, setSidebarOpen] = useState(false);

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
            <nav className="bg-white shadow-sm border-b sticky top-0 z-30">
                <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
                    <div className="flex justify-between items-center h-14 sm:h-16">
                        {/* Mobile menu button */}
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="lg:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100"
                        >
                            <Menu className="w-6 h-6" />
                        </button>

                        <div className="flex items-center">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 mr-2 sm:mr-3 flex items-center justify-center">
                                <img src="/achariya-logo.jpg" alt="Achariya" className="w-full h-full object-contain" />
                            </div>
                            <div>
                                <h1 className="text-base sm:text-xl font-bold text-gray-800">Achariya Portal</h1>
                                <p className="text-xs text-gray-500">{role}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 sm:gap-4">
                            {/* Hide user name on very small screens */}
                            <div className="hidden sm:flex items-center">
                                <div className="w-8 h-8 mr-2 rounded-full overflow-hidden border-2 border-gray-200">
                                    <img src="/achariya-logo.jpg" alt={user.name} className="w-full h-full object-cover" />
                                </div>
                                <span className="text-sm text-gray-700 hidden md:inline">{user.name || user.email}</span>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="flex items-center px-2 sm:px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition"
                            >
                                <LogOut className="w-4 h-4 sm:mr-1" />
                                <span className="hidden sm:inline">Logout</span>
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="flex relative">
                {/* Mobile sidebar backdrop */}
                {sidebarOpen && (
                    <div
                        className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                        onClick={() => setSidebarOpen(false)}
                    />
                )}

                {/* Sidebar */}
                <aside className={`
                    fixed lg:static inset-y-0 left-0 z-50
                    w-64 bg-white shadow-lg lg:shadow-sm 
                    transform transition-transform duration-300 ease-in-out
                    ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                    min-h-[calc(100vh-3.5rem)] lg:min-h-[calc(100vh-4rem)] 
                    border-r mt-14 sm:mt-16 lg:mt-0
                `}>
                    {/* Mobile close button */}
                    <div className="lg:hidden flex justify-end p-4">
                        <button
                            onClick={() => setSidebarOpen(false)}
                            className="p-2 rounded-md text-gray-500 hover:bg-gray-100"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    <nav className="py-2 lg:py-4">
                        {navItems.map((item) => (
                            <Link
                                key={item.to}
                                to={item.to}
                                onClick={() => setSidebarOpen(false)}
                                className="flex items-center px-6 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition"
                            >
                                <item.icon className="w-5 h-5 mr-3" />
                                {item.label}
                            </Link>
                        ))}
                    </nav>
                </aside>

                {/* Main Content */}
                <main className="flex-1 p-4 sm:p-6 lg:p-8 w-full lg:w-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default Layout;

import { useState, useEffect } from 'react';
import { Outlet, useNavigate, NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    GraduationCap,
    Users,
    BookOpen,
    FileText,
    Settings,
    Menu,
    X,
    LogOut
} from 'lucide-react';

interface UserData {
    role: 'Principal' | 'Teacher' | 'Student';
    email: string;
    teacherName: string | null;
    studentId: string | null;
    studentName: string | null;
}

const Layout = () => {
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [userData, setUserData] = useState<UserData | null>(null);

    useEffect(() => {
        const stored = localStorage.getItem('user');
        if (stored) {
            setUserData(JSON.parse(stored));
        } else {
            navigate('/');
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/');
    };

    const menuItems = [
        { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { path: '/teacher-completion', icon: GraduationCap, label: 'Teacher Completion' },
        { path: '/student-completion', icon: Users, label: 'Student Completion' },
        { path: '/courses', icon: BookOpen, label: 'Courses and Lessons' },
        { path: '/reports', icon: FileText, label: 'Reports' },
        { path: '/settings', icon: Settings, label: 'Settings' },
    ];

    if (!userData) return null;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Top Navigation */}
            <nav className="bg-white border-b border-gray-200 fixed w-full z-30 top-0">
                <div className="px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="p-2 rounded-lg hover:bg-gray-100"
                        >
                            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>

                        {/* Logo */}
                        <div className="flex items-center space-x-3">
                            <img
                                src="/logo.jpg"
                                alt="Achariya Logo"
                                className="w-12 h-12 object-contain"
                            />
                            <div className="hidden md:block">
                                <h1 className="text-lg font-bold text-gray-800">Achariya Learning Portal</h1>
                                <p className="text-xs text-gray-500">Completion Tracking</p>
                            </div>
                        </div>
                    </div>

                    {/* User Info */}
                    <div className="flex items-center space-x-4">
                        <div className="text-right hidden md:block">
                            <p className="text-sm font-medium text-gray-800">
                                {userData.role === 'Teacher' && userData.teacherName}
                                {userData.role === 'Student' && userData.studentName}
                                {userData.role === 'Principal' && 'Principal'}
                            </p>
                            <p className="text-xs text-gray-500">{userData.role}</p>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="p-2 rounded-lg hover:bg-gray-100 text-gray-600"
                            title="Logout"
                        >
                            <LogOut size={20} />
                        </button>
                    </div>
                </div>
            </nav>

            {/* Sidebar */}
            <aside
                className={`fixed left-0 top-0 h-full bg-white border-r border-gray-200 transition-all duration-300 z-20 pt-16 ${sidebarOpen ? 'w-64' : 'w-0'
                    } overflow-hidden`}
            >
                <nav className="p-4 space-y-2">
                    {menuItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) =>
                                `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${isActive
                                    ? 'bg-blue-50 text-blue-600'
                                    : 'text-gray-700 hover:bg-gray-50'
                                }`
                            }
                        >
                            <item.icon size={20} />
                            <span className="font-medium">{item.label}</span>
                        </NavLink>
                    ))}
                </nav>
            </aside>

            {/* Main Content */}
            <main
                className={`transition-all duration-300 pt-16 ${sidebarOpen ? 'ml-64' : 'ml-0'
                    }`}
            >
                <div className="p-6">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default Layout;

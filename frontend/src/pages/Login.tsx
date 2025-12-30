import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Lock, ChevronDown, ChevronUp, BookOpen, Atom, Calculator, PenTool, Lightbulb, GraduationCap, Globe, Music, Microscope, Palette, Code, Brain, Compass, FlaskConical } from 'lucide-react';

// Floating Educational Icons Component (hidden for now - uncomment usage in JSX to enable)
// @ts-ignore - Component kept for future use, currently disabled
const FloatingEducationIcons = () => {
    const icons = [
        // Left edge (0-15%)
        { Icon: BookOpen, left: '3%', top: '8%', delay: '0s', size: 30 },
        { Icon: Atom, left: '10%', top: '28%', delay: '2s', size: 26 },
        { Icon: Calculator, left: '5%', top: '50%', delay: '4s', size: 24 },
        { Icon: Microscope, left: '11%', top: '72%', delay: '3s', size: 28 },
        { Icon: Palette, left: '6%', top: '92%', delay: '5s', size: 24 },

        // Left middle zone (20-32%)
        { Icon: PenTool, left: '22%', top: '18%', delay: '1s', size: 22 },
        { Icon: Compass, left: '28%', top: '42%', delay: '2.5s', size: 20 },
        { Icon: FlaskConical, left: '24%', top: '68%', delay: '4s', size: 22 },

        // Right middle zone (68-80%)
        { Icon: Brain, left: '72%', top: '20%', delay: '3s', size: 22 },
        { Icon: Code, left: '76%', top: '48%', delay: '1.5s', size: 20 },
        { Icon: Music, left: '70%', top: '75%', delay: '3.5s', size: 22 },

        // Right edge (85-95%)
        { Icon: Lightbulb, left: '90%', top: '10%', delay: '1.5s', size: 28 },
        { Icon: GraduationCap, left: '86%', top: '32%', delay: '0.5s', size: 32 },
        { Icon: Globe, left: '92%', top: '55%', delay: '2.5s', size: 26 },
        { Icon: Calculator, left: '88%', top: '78%', delay: '4.5s', size: 24 },
        { Icon: BookOpen, left: '93%', top: '94%', delay: '1s', size: 26 },
    ];

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none hidden md:block">
            {icons.map((item, index) => (
                <div
                    key={index}
                    className="absolute animate-float"
                    style={{
                        left: item.left,
                        top: item.top,
                        animationDelay: item.delay,
                        animationDuration: '12s',
                    }}
                >
                    <item.Icon
                        size={item.size}
                        className="text-blue-400 opacity-50"
                        strokeWidth={1.5}
                    />
                </div>
            ))}
            <style>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0px) rotate(0deg); }
                    25% { transform: translateY(-15px) rotate(5deg); }
                    50% { transform: translateY(-8px) rotate(-3deg); }
                    75% { transform: translateY(-20px) rotate(3deg); }
                }
                .animate-float {
                    animation: float 12s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
};

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showDemoHint, setShowDemoHint] = useState(false);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();

        // Auto-detect role from email
        let role = 'Student';
        const emailLower = email.toLowerCase();

        if (emailLower.includes('admin')) {
            role = 'Admin';
        } else if (emailLower.includes('principal')) {
            role = 'Principal';
        } else if (emailLower.includes('teacher') || emailLower === 'hari@achariya.org' || emailLower === 'meena@achariya.org' || emailLower === 'kumar@achariya.org' || emailLower === 'lakshmi@achariya.org') {
            role = 'Teacher';
        }

        // Store user with auto-detected role
        localStorage.setItem('user', JSON.stringify({
            email,
            name: email.split('@')[0],
            selectedRole: role
        }));

        // Navigate directly to appropriate dashboard
        const dashboardMap: Record<string, string> = {
            'Student': '/student/dashboard',
            'Teacher': '/teacher/dashboard',
            'Principal': '/principal/dashboard',
            'Admin': '/admin/dashboard'
        };

        navigate(dashboardMap[role]);
    };

    return (
        <div className="min-h-[100dvh] bg-gradient-to-br from-blue-50 to-gray-100 flex flex-col items-center justify-center p-4 relative">
            {/* Floating Educational Icons - Hidden for now, uncomment to enable */}
            {/* <FloatingEducationIcons /> */}

            {/* Responsive Logo */}
            <div className="mb-4 md:mb-8 text-center relative z-10">
                <div className="w-20 h-20 md:w-40 md:h-40 mx-auto mb-2 md:mb-4 flex items-center justify-center">
                    <img src="/achariya-logo.jpg" alt="Achariya Logo" className="w-full h-full object-contain" />
                </div>
                <h1 className="text-xl md:text-3xl font-bold text-gray-800">Achariya Learning Portal</h1>
                <p className="text-sm md:text-base text-gray-600 mt-1 md:mt-2">Unified Learning Management System</p>
            </div>

            {/* Login Card */}
            <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 w-full max-w-md">
                <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 md:mb-6">Sign In</h2>

                <form onSubmit={handleLogin} className="space-y-4 md:space-y-6">
                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1 md:mb-2">
                            Email
                        </label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
                                placeholder="your.email@achariya.org"
                                required
                            />
                        </div>
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1 md:mb-2">
                            Password
                        </label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
                                placeholder="Enter your password"
                                required
                            />
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
                    >
                        Sign In
                    </button>
                </form>

                {/* Collapsible Demo Hint - P0-1 Fix */}
                <div className="mt-4 md:mt-6">
                    <button
                        onClick={() => setShowDemoHint(!showDemoHint)}
                        className="w-full flex items-center justify-between p-3 bg-blue-50 rounded-lg text-sm text-blue-800 hover:bg-blue-100 transition"
                    >
                        <span className="font-semibold">Demo Mode - Any email/password works!</span>
                        {showDemoHint ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                    {showDemoHint && (
                        <ul className="mt-2 text-xs text-blue-700 space-y-1 px-3">
                            <li>• student@achariya.org</li>
                            <li>• teacher@achariya.org</li>
                            <li>• principal@achariya.org</li>
                            <li>• admin@achariya.org</li>
                        </ul>
                    )}
                </div>
            </div>

            {/* Footer */}
            <div className="mt-4 md:mt-8 text-center text-gray-500 text-xs md:text-sm">
                <p>© 2025 Achariya Group of Institutions</p>
            </div>
        </div>
    );
};

export default Login;


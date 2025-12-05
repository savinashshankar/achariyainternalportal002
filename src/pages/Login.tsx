import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Lock } from 'lucide-react';

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

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
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex flex-col items-center justify-center p-4">
            {/* Large Centered Logo */}
            <div className="mb-8 text-center">
                <div className="w-40 h-40 mx-auto mb-4 flex items-center justify-center">
                    <img src="/achariya-logo.jpg" alt="Achariya Logo" className="w-full h-full object-contain" />
                </div>
                <h1 className="text-3xl font-bold text-gray-800">Achariya Learning Portal</h1>
                <p className="text-gray-600 mt-2">Unified Learning Management System</p>
            </div>

            {/* Login Card */}
            <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Sign In</h2>

                <form onSubmit={handleLogin} className="space-y-6">
                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email
                        </label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="your.email@achariya.org"
                                required
                            />
                        </div>
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Password
                        </label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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

                {/* Demo Hint */}
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <p className="text-xs text-blue-800 mb-2">
                        <strong>Demo Mode - Any email/password works!</strong>
                    </p>
                    <ul className="text-xs text-blue-700 space-y-1">
                        <li>• Try: student@achariya.org</li>
                        <li>• Try: teacher@achariya.org</li>
                        <li>• Try: principal@achariya.org</li>
                        <li>• Try: admin@achariya.org</li>
                    </ul>
                </div>
            </div>

            {/* Footer */}
            <div className="mt-8 text-center text-gray-500 text-sm">
                <p>© 2025 Achariya Group of Institutions</p>
            </div>
        </div>
    );
};

export default Login;

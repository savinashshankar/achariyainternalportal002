import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Lock, ChevronDown } from 'lucide-react';

type UserRole = 'Principal' | 'Teacher' | 'Student';

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [selectedRole, setSelectedRole] = useState<UserRole>('Principal');

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();

        const userData = {
            role: selectedRole,
            email,
            teacherName: selectedRole === 'Teacher' ? 'Hari' : null,
            studentId: selectedRole === 'Student' ? 'STU-1001' : null,
            studentName: selectedRole === 'Student' ? 'Pranav R' : null,
        };

        localStorage.setItem('user', JSON.stringify(userData));
        navigate('/dashboard');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex flex-col items-center justify-center p-4">
            {/* Large Centered Logo */}
            <div className="mb-8 text-center">
                <img
                    src="/logo.jpg"
                    alt="Achariya Logo"
                    className="w-40 h-40 mx-auto mb-4 object-contain"
                />
                <h1 className="text-3xl font-bold text-gray-800">Achariya Learning Completion Portal</h1>
                <p className="text-gray-600 mt-2">Track teacher and student progress</p>
            </div>

            {/* Login Card */}
            <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Sign In</h2>

                <form onSubmit={handleLogin} className="space-y-6">
                    {/* Role Selector */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Select Role
                        </label>
                        <div className="relative">
                            <select
                                value={selectedRole}
                                onChange={(e) => setSelectedRole(e.target.value as UserRole)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
                            >
                                <option value="Principal">Principal</option>
                                <option value="Teacher">Teacher</option>
                                <option value="Student">Student</option>
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
                        </div>
                        <p className="mt-1 text-xs text-gray-500">
                            {selectedRole === 'Principal' && 'View all teachers and students across campuses'}
                            {selectedRole === 'Teacher' && 'View your classes and student progress'}
                            {selectedRole === 'Student' && 'View your course completion and scores'}
                        </p>
                    </div>

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
                                placeholder={`${selectedRole.toLowerCase()}@achariya.in`}
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
                        Sign In as {selectedRole}
                    </button>
                </form>

                {/* Demo Hint */}
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <p className="text-xs text-blue-800 text-center">
                        <strong>Demo Mode:</strong> Use any email/password combination to login
                    </p>
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

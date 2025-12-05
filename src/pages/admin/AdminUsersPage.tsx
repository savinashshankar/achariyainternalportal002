import { Link } from 'react-router-dom';
import { ArrowLeft, UserPlus } from 'lucide-react';
import { sampleData } from '../../data/sampleData';

const AdminUsersPage = () => {
    const allUsers = [
        ...sampleData.students.map(s => ({ ...s, role: 'Student' })),
        ...sampleData.teachers.map(t => ({ ...t, role: 'Teacher' }))
    ];

    return (
        <div>
            <Link to="/admin/dashboard" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
            </Link>

            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">User Management</h1>
                <Link to="/admin/users/add" className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                    <UserPlus className="w-4 h-4 mr-2" />
                    Add New User
                </Link>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border">
                <table className="w-full">
                    <thead>
                        <tr className="border-b">
                            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Name</th>
                            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Email</th>
                            <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Role</th>
                            <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                            <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Credits</th>
                            <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {allUsers.slice(0, 15).map((user: any) => (
                            <tr key={`${user.role}-${user.id}`} className="border-b hover:bg-gray-50">
                                <td className="py-3 px-4">
                                    <p className="font-semibold text-gray-800">{user.name}</p>
                                    <p className="text-xs text-gray-500">{user.class || user.department}</p>
                                </td>
                                <td className="py-3 px-4 text-sm text-gray-600">{user.email}</td>
                                <td className="py-3 px-4 text-center">
                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${user.role === 'Student' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                                        }`}>
                                        {user.role}
                                    </span>
                                </td>
                                <td className="py-3 px-4 text-center">
                                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                                        {user.status}
                                    </span>
                                </td>
                                <td className="py-3 px-4 text-center text-sm font-semibold text-purple-600">
                                    {user.credits}
                                </td>
                                <td className="py-3 px-4 text-right">
                                    <button className="text-blue-600 hover:text-blue-700 text-sm font-semibold mr-3">
                                        Edit
                                    </button>
                                    <button className="text-red-600 hover:text-red-700 text-sm font-semibold">
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminUsersPage;

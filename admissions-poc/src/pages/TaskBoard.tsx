import { Link } from 'react-router-dom';
import { ArrowLeft, Phone, Calendar, Mail } from 'lucide-react';

const tasks = [
    {
        id: 1,
        student: 'Ravi Kumar',
        parent: 'Sunita Kumar',
        mobile: '9876543210',
        action: 'First contact call',
        grade: '5',
        priority: 'high',
        dueTime: '10:00 AM'
    },
    {
        id: 2,
        student: 'Priya Sharma',
        parent: 'Raj Sharma',
        mobile: '9123456789',
        action: 'Follow-up after visit',
        grade: 'LKG',
        priority: 'medium',
        dueTime: '2:00 PM'
    },
    {
        id: 3,
        student: 'Arjun Patel',
        parent: 'Meera Patel',
        mobile: '9998887776',
        action: 'Send admission form',
        grade: '9',
        priority: 'high',
        dueTime: '11:30 AM'
    },
    {
        id: 4,
        student: 'Ananya Reddy',
        parent: 'Venkat Reddy',
        mobile: '9876501234',
        action: 'Fee discussion call',
        grade: '12',
        priority: 'low',
        dueTime: '4:00 PM'
    }
];

export default function TaskBoard() {
    const high = tasks.filter(t => t.priority === 'high');
    const medium = tasks.filter(t => t.priority === 'medium');
    const low = tasks.filter(t => t.priority === 'low');

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
                            <h1 className="text-2xl font-bold text-gray-900">Counselor Task Board</h1>
                            <p className="text-sm text-gray-600 mt-1">Today's Follow-ups - {new Date().toLocaleDateString()}</p>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="card bg-red-50 border-red-200">
                        <p className="text-sm font-medium text-red-700">High Priority</p>
                        <p className="text-3xl font-bold text-red-600 mt-1">{high.length}</p>
                    </div>
                    <div className="card bg-yellow-50 border-yellow-200">
                        <p className="text-sm font-medium text-yellow-700">Medium Priority</p>
                        <p className="text-3xl font-bold text-yellow-600 mt-1">{medium.length}</p>
                    </div>
                    <div className="card bg-green-50 border-green-200">
                        <p className="text-sm font-medium text-green-700">Low Priority</p>
                        <p className="text-3xl font-bold text-green-600 mt-1">{low.length}</p>
                    </div>
                </div>

                {/* Task Lists */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* High Priority */}
                    <div>
                        <h2 className="text-lg font-bold text-red-600 mb-4">🔴 High Priority</h2>
                        <div className="space-y-4">
                            {high.map(task => (
                                <div key={task.id} className="card bg-red-50 border-red-200 hover:shadow-md transition-shadow">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-bold text-gray-900">{task.student}</h3>
                                        <span className="text-xs bg-red-600 text-white px-2 py-1 rounded">
                                            {task.dueTime}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-600 mb-2">{task.action}</p>
                                    <div className="flex items-center gap-4 text-xs text-gray-500">
                                        <span className="flex items-center gap-1">
                                            <Phone className="w-3 h-3" />
                                            {task.mobile}
                                        </span>
                                        <span>Grade {task.grade}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Medium Priority */}
                    <div>
                        <h2 className="text-lg font-bold text-yellow-600 mb-4">🟡 Medium Priority</h2>
                        <div className="space-y-4">
                            {medium.map(task => (
                                <div key={task.id} className="card bg-yellow-50 border-yellow-200 hover:shadow-md transition-shadow">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-bold text-gray-900">{task.student}</h3>
                                        <span className="text-xs bg-yellow-600 text-white px-2 py-1 rounded">
                                            {task.dueTime}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-600 mb-2">{task.action}</p>
                                    <div className="flex items-center gap-4 text-xs text-gray-500">
                                        <span className="flex items-center gap-1">
                                            <Phone className="w-3 h-3" />
                                            {task.mobile}
                                        </span>
                                        <span>Grade {task.grade}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Low Priority */}
                    <div>
                        <h2 className="text-lg font-bold text-green-600 mb-4">🟢 Low Priority</h2>
                        <div className="space-y-4">
                            {low.map(task => (
                                <div key={task.id} className="card bg-green-50 border-green-200 hover:shadow-md transition-shadow">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-bold text-gray-900">{task.student}</h3>
                                        <span className="text-xs bg-green-600 text-white px-2 py-1 rounded">
                                            {task.dueTime}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-600 mb-2">{task.action}</p>
                                    <div className="flex items-center gap-4 text-xs text-gray-500">
                                        <span className="flex items-center gap-1">
                                            <Phone className="w-3 h-3" />
                                            {task.mobile}
                                        </span>
                                        <span>Grade {task.grade}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="mt-8 text-center text-sm text-gray-500">
                    <p>POC Demo - Task Board for daily counselor follow-ups</p>
                </div>
            </main>
        </div>
    );
}

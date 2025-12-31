import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Plus, Edit2, Trash2, Save, X } from 'lucide-react';

const ADMIN_PASSWORD = 'achariya2025'; // Simple password for POC

interface JobOpening {
    id: string;
    category: 'School' | 'College' | 'Corporate';
    roleTitle: string;
    department: string;
    location: string;
    description: string;
    responsibilities: string[];
    eligibility: string[];
}

export default function AdminPanel() {
    const navigate = useNavigate();
    const [authenticated, setAuthenticated] = useState(false);
    const [password, setPassword] = useState('');
    const [openings, setOpenings] = useState<JobOpening[]>([]);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [formData, setFormData] = useState<Partial<JobOpening>>({
        category: 'School',
        roleTitle: '',
        department: '',
        location: 'Bangalore',
        description: '',
        responsibilities: [''],
        eligibility: ['']
    });

    useEffect(() => {
        if (authenticated) {
            loadOpenings();
        }
    }, [authenticated]);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (password === ADMIN_PASSWORD) {
            setAuthenticated(true);
            localStorage.setItem('admin_auth', 'true');
        } else {
            alert('Incorrect password');
        }
    };

    const loadOpenings = async () => {
        const stored = localStorage.getItem('job_openings');
        if (stored) {
            setOpenings(JSON.parse(stored));
        } else {
            // First time - initialize with mock data
            const { mockOpenings } = await import('../data/openings');
            localStorage.setItem('job_openings', JSON.stringify(mockOpenings));
            setOpenings(mockOpenings);
        }
    };

    const saveOpenings = (newOpenings: JobOpening[]) => {
        localStorage.setItem('job_openings', JSON.stringify(newOpenings));
        setOpenings(newOpenings);
    };

    const handleAdd = () => {
        const newOpening: JobOpening = {
            id: `JOB${Date.now()}`,
            category: formData.category as any,
            roleTitle: formData.roleTitle || '',
            department: formData.department || '',
            location: formData.location || 'Bangalore',
            description: formData.description || '',
            responsibilities: formData.responsibilities?.filter(r => r.trim()) || [],
            eligibility: formData.eligibility?.filter(e => e.trim()) || []
        };
        saveOpenings([...openings, newOpening]);
        setShowAddForm(false);
        resetForm();
    };

    const handleUpdate = () => {
        const updated = openings.map(o =>
            o.id === editingId ? { ...o, ...formData } as JobOpening : o
        );
        saveOpenings(updated);
        setEditingId(null);
        resetForm();
    };

    const handleDelete = (id: string) => {
        if (confirm('Delete this opening?')) {
            saveOpenings(openings.filter(o => o.id !== id));
        }
    };

    const startEdit = (opening: JobOpening) => {
        setEditingId(opening.id);
        setFormData(opening);
    };

    const resetForm = () => {
        setFormData({
            category: 'School',
            roleTitle: '',
            department: '',
            location: 'Bangalore',
            description: '',
            responsibilities: [''],
            eligibility: ['']
        });
    };

    if (!authenticated) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-50 flex items-center justify-center p-4">
                <div className="card max-w-md w-full">
                    <div className="text-center mb-6">
                        <Lock className="w-12 h-12 text-teal-600 mx-auto mb-3" />
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">Admin Panel</h1>
                        <p className="text-sm text-gray-600">Manage job openings</p>
                    </div>
                    <form onSubmit={handleLogin}>
                        <input
                            type="password"
                            className="input-field mb-4"
                            placeholder="Enter admin password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            autoFocus
                        />
                        <button type="submit" className="btn-primary w-full">
                            Login
                        </button>
                    </form>
                    <button
                        onClick={() => navigate('/')}
                        className="btn-secondary w-full mt-3"
                    >
                        Back to Careers
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
                            <p className="text-sm text-gray-600">Manage {openings.length} job openings</p>
                        </div>
                        <div className="flex gap-3">
                            <button onClick={() => setShowAddForm(true)} className="btn-primary">
                                <Plus className="w-4 h-4 mr-2" />
                                Add Opening
                            </button>
                            <button onClick={() => navigate('/')} className="btn-secondary">
                                Back to Site
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {(showAddForm || editingId) && (
                    <div className="card mb-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-gray-900">
                                {editingId ? 'Edit Opening' : 'Add New Opening'}
                            </h2>
                            <button onClick={() => { setShowAddForm(false); setEditingId(null); resetForm(); }}>
                                <X className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                <select
                                    className="input-field"
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                                >
                                    <option value="School">School</option>
                                    <option value="College">College</option>
                                    <option value="Corporate">Corporate</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Role Title</label>
                                <input
                                    type="text"
                                    className="input-field"
                                    value={formData.roleTitle}
                                    onChange={(e) => setFormData({ ...formData, roleTitle: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                                <input
                                    type="text"
                                    className="input-field"
                                    value={formData.department}
                                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                                <input
                                    type="text"
                                    className="input-field"
                                    value={formData.location}
                                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                            <textarea
                                className="input-field"
                                rows={3}
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Responsibilities (one per line)</label>
                            <textarea
                                className="input-field"
                                rows={4}
                                value={formData.responsibilities?.join('\n')}
                                onChange={(e) => setFormData({ ...formData, responsibilities: e.target.value.split('\n') })}
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Eligibility (one per line)</label>
                            <textarea
                                className="input-field"
                                rows={4}
                                value={formData.eligibility?.join('\n')}
                                onChange={(e) => setFormData({ ...formData, eligibility: e.target.value.split('\n') })}
                            />
                        </div>

                        <button
                            onClick={editingId ? handleUpdate : handleAdd}
                            className="btn-primary"
                        >
                            <Save className="w-4 h-4 mr-2" />
                            {editingId ? 'Update' : 'Add'} Opening
                        </button>
                    </div>
                )}

                <div className="space-y-4">
                    {openings.map(opening => (
                        <div key={opening.id} className="card">
                            <div className="flex justify-between items-start">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className={`px-2 py-1 rounded text-xs font-medium ${opening.category === 'School' ? 'bg-blue-100 text-blue-700' :
                                                opening.category === 'College' ? 'bg-purple-100 text-purple-700' :
                                                    'bg-teal-100 text-teal-700'
                                            }`}>
                                            {opening.category}
                                        </span>
                                        <h3 className="text-lg font-bold text-gray-900">{opening.roleTitle}</h3>
                                    </div>
                                    <p className="text-sm text-gray-600 mb-2">{opening.department} • {opening.location}</p>
                                    <p className="text-sm text-gray-700">{opening.description}</p>
                                </div>
                                <div className="flex gap-2 ml-4">
                                    <button onClick={() => startEdit(opening)} className="p-2 text-teal-600 hover:bg-teal-50 rounded">
                                        <Edit2 className="w-4 h-4" />
                                    </button>
                                    <button onClick={() => handleDelete(opening.id)} className="p-2 text-red-600 hover:bg-red-50 rounded">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}

                    {openings.length === 0 && (
                        <div className="card text-center py-12">
                            <p className="text-gray-500">No job openings yet. Click "Add Opening" to create one.</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Search } from 'lucide-react';
import { getOpeningsByCategory } from '../data/openings';
import OpeningCard from '../components/OpeningCard';

interface Props {
    category: 'School' | 'College' | 'Corporate';
}

export default function CategoryOpenings({ category }: Props) {
    const [searchQuery, setSearchQuery] = useState('');
    const openings = getOpeningsByCategory(category);

    const filteredOpenings = openings.filter(opening =>
        opening.roleTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        opening.department.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const categoryColors = {
        School: 'from-blue-500 to-blue-700',
        College: 'from-purple-500 to-purple-700',
        Corporate: 'from-teal-500 to-teal-700'
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className={`bg-gradient-to-r ${categoryColors[category]} text-white`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <Link to="/" className="inline-flex items-center text-white/80 hover:text-white mb-4">
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        Back to All Categories
                    </Link>
                    <div className="flex items-center gap-3 mb-2">
                        <img src="/logo.png" alt="Achariya" className="h-12 w-12 bg-white/20 rounded-lg p-1" />
                        <div>
                            <h1 className="text-3xl font-bold">{category} Openings</h1>
                            <p className="text-white/90">{openings.length} positions available</p>
                        </div>
                    </div>
                </div>
            </header>

            {/* Search */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="card mb-6">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by role or department..."
                            className="input-field pl-10"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                {/* Openings List */}
                <div className="space-y-4">
                    {filteredOpenings.map(opening => (
                        <OpeningCard key={opening.id} opening={opening} />
                    ))}

                    {filteredOpenings.length === 0 && (
                        <div className="card text-center py-12">
                            <p className="text-gray-500">No openings found matching your search.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

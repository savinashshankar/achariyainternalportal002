import { useState } from 'react';
import { ChevronDown, ChevronUp, MapPin, Building } from 'lucide-react';
import type { Opening } from '../data/openings';
import ApplyModal from './ApplyModal';

interface Props {
    opening: Opening;
}

export default function OpeningCard({ opening }: Props) {
    const [expanded, setExpanded] = useState(false);
    const [showApplyModal, setShowApplyModal] = useState(false);

    return (
        <>
            <div className="card">
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{opening.roleTitle}</h3>
                        <div className="flex flex-wrap gap-3 text-sm text-gray-600 mb-3">
                            <span className="flex items-center">
                                <Building className="w-4 h-4 mr-1" />
                                {opening.department}
                            </span>
                            <span className="flex items-center">
                                <MapPin className="w-4 h-4 mr-1" />
                                {opening.location}
                            </span>
                        </div>
                    </div>
                    <button
                        onClick={() => setExpanded(!expanded)}
                        className="btn-secondary ml-4"
                    >
                        {expanded ? 'Collapse' : 'View Details'}
                        {expanded ? <ChevronUp className="w-4 h-4 ml-1" /> : <ChevronDown className="w-4 h-4 ml-1" />}
                    </button>
                </div>

                {expanded && (
                    <div className="mt-6 pt-6 border-t border-gray-200">
                        <div className="prose prose-sm max-w-none">
                            <h4 className="font-bold text-gray-900 mb-2">Job Description</h4>
                            <p className="text-gray-700 mb-4">{opening.description}</p>

                            <h4 className="font-bold text-gray-900 mb-2">Key Responsibilities</h4>
                            <ul className="list-disc list-inside space-y-1 mb-4">
                                {opening.responsibilities.map((resp, idx) => (
                                    <li key={idx} className="text-gray-700">{resp}</li>
                                ))}
                            </ul>

                            <h4 className="font-bold text-gray-900 mb-2">Eligibility & Requirements</h4>
                            <ul className="list-disc list-inside space-y-1 mb-6">
                                {opening.eligibility.map((eli, idx) => (
                                    <li key={idx} className="text-gray-700">{eli}</li>
                                ))}
                            </ul>

                            <button
                                onClick={() => setShowApplyModal(true)}
                                className="btn-primary w-full sm:w-auto"
                            >
                                Apply for this Position
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {showApplyModal && (
                <ApplyModal
                    opening={opening}
                    onClose={() => setShowApplyModal(false)}
                />
            )}
        </>
    );
}

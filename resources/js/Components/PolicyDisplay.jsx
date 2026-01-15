import { useState, useEffect } from 'react';

export default function PolicyDisplay({ policies: initialPolicies = null, showCheckbox = false, onAcknowledge = null }) {
    const [policies, setPolicies] = useState(initialPolicies);
    const [expandedCategories, setExpandedCategories] = useState({});
    const [acknowledged, setAcknowledged] = useState(false);

    useEffect(() => {
        if (!initialPolicies) {
            // Fetch policies from API
            fetch('/api/policies')
                .then(res => res.json())
                .then(data => {
                    setPolicies(data.policies);
                })
                .catch(err => console.error('Error fetching policies:', err));
        }
    }, [initialPolicies]);

    const toggleCategory = (category) => {
        setExpandedCategories(prev => ({
            ...prev,
            [category]: !prev[category]
        }));
    };

    const handleAcknowledge = (e) => {
        setAcknowledged(e.target.checked);
        if (onAcknowledge) {
            onAcknowledge(e.target.checked);
        }
    };

    if (!policies || Object.keys(policies).length === 0) {
        return (
            <div className="glass-card p-4">
                <p className="text-white/70">No policies available.</p>
            </div>
        );
    }

    const categoryLabels = {
        transport: 'Transport Policy',
        payment: 'Payment Policy',
        safety: 'Safety Policy',
        general: 'General Policies',
    };

    return (
        <div className="space-y-4">
            {Object.entries(policies).map(([category, categoryPolicies]) => (
                <div key={category} className="glass-card overflow-hidden">
                    <button
                        type="button"
                        onClick={() => toggleCategory(category)}
                        className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-white/5 transition"
                    >
                        <h3 className="text-lg font-bold text-white">
                            {categoryLabels[category] || category}
                        </h3>
                        <svg
                            className={`w-5 h-5 text-white transition-transform ${expandedCategories[category] ? 'rotate-180' : ''}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>
                    {expandedCategories[category] && (
                        <div className="px-4 pb-4 space-y-3">
                            {categoryPolicies.map((policy) => (
                                <div key={policy.id} className="border-t border-white/10 pt-3">
                                    <h4 className="text-base font-semibold text-white mb-2">{policy.title}</h4>
                                    <div className="text-white/80 whitespace-pre-line text-sm">
                                        {policy.content}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            ))}
            
            {showCheckbox && (
                <div className="glass-card p-4">
                    <label className="flex items-start gap-3 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={acknowledged}
                            onChange={handleAcknowledge}
                            className="mt-1 w-5 h-5 rounded border-white/30 bg-white/10 text-indigo-600 focus:ring-indigo-500"
                            required
                        />
                        <span className="text-white font-semibold">
                            I have read and agree to all policies and procedures listed above.
                        </span>
                    </label>
                </div>
            )}
            
            {/* Disclaimer Footer */}
            <div className="glass-card p-4 mt-4">
                <p className="text-xs text-white/70 italic text-center">
                    <strong className="text-white/90">Disclaimer:</strong> On-Time Transportation for Kids is a private transportation company and is not a school bus service. We do not operate under the authority of any school district or government agency.
                </p>
            </div>
        </div>
    );
}


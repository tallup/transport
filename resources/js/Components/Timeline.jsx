export default function Timeline({ items = [] }) {
    return (
        <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 to-purple-600"></div>
            
            <div className="space-y-6">
                {items.map((item, index) => (
                    <div key={index} className="relative pl-12">
                        {/* Timeline dot */}
                        <div className="absolute left-0 top-1.5 w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full border-4 border-white shadow-lg flex items-center justify-center">
                            {item.icon || (
                                <div className="w-2 h-2 bg-white rounded-full"></div>
                            )}
                        </div>
                        
                        {/* Timeline content */}
                        <div className="glass-card rounded-lg p-4">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h4 className="font-semibold text-gray-900">{item.title}</h4>
                                    {item.description && (
                                        <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                                    )}
                                </div>
                                {item.time && (
                                    <span className="text-xs font-medium text-gray-500 whitespace-nowrap ml-4">
                                        {item.time}
                                    </span>
                                )}
                            </div>
                            {item.status && (
                                <div className="mt-2">
                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                        item.status === 'completed' ? 'bg-green-100 text-green-800' :
                                        item.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                        item.status === 'upcoming' ? 'bg-blue-100 text-blue-800' :
                                        'bg-gray-100 text-gray-800'
                                    }`}>
                                        {item.status}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}


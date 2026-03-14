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
                                <div className="flex-1">
                                    <h4 className="text-base font-bold text-white">{item.title}</h4>
                                    {item.description && (
                                        <p className="text-base font-semibold text-white/90 mt-1">{item.description}</p>
                                    )}
                                    {item.students && item.students.length > 0 && (
                                        <div className="mt-2">
                                            <p className="text-xs font-semibold text-white/80 mb-1">Students:</p>
                                            <div className="flex flex-wrap gap-1">
                                                {item.students.map((student, idx) => {
                                                    // Handle both string and object formats
                                                    const studentName = typeof student === 'string' ? student : (student?.name || 'Unknown');
                                                    const studentKey = typeof student === 'object' && student?.booking_id ? student.booking_id : idx;
                                                    return (
                                                        <span key={studentKey} className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border transition-all ${
                                                            student?.isAbsent 
                                                            ? 'bg-rose-500 text-white border-rose-400 line-through' 
                                                            : 'bg-white/20 text-white border-white/30'
                                                        }`}>
                                                            {studentName}
                                                            {student?.isAbsent && <span className="ml-1 text-[8px] uppercase no-underline font-bold">(Absent)</span>}
                                                        </span>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}
                                </div>
                                {item.time && (
                                    <span className="text-sm font-bold text-white/80 whitespace-nowrap ml-4">
                                        {item.time}
                                    </span>
                                )}
                            </div>
                            {item.status && (
                                <div className="mt-2">
                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${
                                        item.status === 'completed' ? 'bg-amber-500/30 text-amber-100 border-amber-400/50' :
                                        item.status === 'pending' ? 'bg-yellow-500/30 text-yellow-100 border-yellow-400/50' :
                                        item.status === 'upcoming' ? 'bg-blue-500/30 text-blue-100 border-blue-400/50' :
                                        'bg-gray-500/30 text-gray-200 border-gray-400/50'
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


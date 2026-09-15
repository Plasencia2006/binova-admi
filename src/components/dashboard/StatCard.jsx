export default function StatCard({ title, value, subtitle, icon: Icon, color = 'green' }) {
    const colors = {
        green: 'bg-[#6EA838]/10 text-[#6EA838]',
        blue: 'bg-blue-50 text-blue-600',
        amber: 'bg-amber-50 text-amber-600',
        red: 'bg-red-50 text-red-600',
        gray: 'bg-gray-100 text-gray-600',
    }

    return (
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm text-gray-500 font-medium">{title}</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
                    {subtitle && (
                        <p className="text-xs text-gray-400 mt-1">{subtitle}</p>
                    )}
                </div>
                {Icon && (
                    <div className={`p-3 rounded-xl ${colors[color]}`}>
                        <Icon size={22} />
                    </div>
                )}
            </div>
        </div>
    )
}
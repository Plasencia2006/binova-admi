import { AlertTriangle, Truck, Link2, CheckCircle } from 'lucide-react'

const iconMap = {
    alerta: { icon: AlertTriangle, color: 'text-amber-500 bg-amber-50' },
    recoleccion: { icon: CheckCircle, color: 'text-emerald-500 bg-emerald-50' },
    asignacion: { icon: Link2, color: 'text-blue-500 bg-blue-50' },
}

export default function RecentActivity({ items }) {
    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
            <div className="px-5 py-4 border-b border-gray-100">
                <h3 className="font-semibold text-gray-900">Actividad reciente</h3>
                <p className="text-xs text-gray-400 mt-0.5">Últimos eventos del sistema</p>
            </div>

            <div className="divide-y divide-gray-50">
                {items.map((item) => {
                    const { icon: Icon, color } = iconMap[item.tipo] || iconMap.alerta
                    return (
                        <div
                            key={item.id}
                            className="px-5 py-3.5 flex items-start gap-3 hover:bg-gray-50/80 transition-colors"
                        >
                            <div className={`p-2 rounded-lg ${color} flex-shrink-0`}>
                                <Icon size={16} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm text-gray-800 leading-snug">{item.mensaje}</p>
                                <p className="text-xs text-gray-400 mt-0.5">
                                    {item.ubicacion} · {item.hora}
                                </p>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
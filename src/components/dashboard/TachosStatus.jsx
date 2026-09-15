export default function TachosStatus({ data }) {
    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h3 className="font-semibold text-gray-900 mb-1">Estado de tachos</h3>
            <p className="text-xs text-gray-400 mb-5">Distribución por nivel de llenado</p>

            <div className="space-y-4">
                {data.map((item) => (
                    <div key={item.estado}>
                        <div className="flex items-center justify-between mb-1.5">
                            <span className="text-sm text-gray-700 font-medium">{item.estado}</span>
                            <span className="text-sm text-gray-500">{item.cantidad}</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div
                                className={`h-full rounded-full ${item.color} transition-all duration-700`}
                                style={{ width: `${item.porcentaje}%` }}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
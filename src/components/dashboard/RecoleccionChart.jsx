export default function RecoleccionChart({ data }) {
    const max = Math.max(...data.map((d) => d.cantidad))

    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h3 className="font-semibold text-gray-900 mb-1">Recolecciones esta semana</h3>
            <p className="text-xs text-gray-400 mb-5">Cantidad de rutas completadas por día</p>

            <div className="flex items-end justify-between gap-2 h-40">
                {data.map((item) => (
                    <div key={item.dia} className="flex-1 flex flex-col items-center gap-2">
                        <span className="text-xs font-semibold text-gray-600">{item.cantidad}</span>
                        <div className="w-full flex items-end justify-center h-28">
                            <div
                                className="w-full max-w-[32px] rounded-t-lg bg-gradient-to-t from-[#6EA838] to-[#8BC34A] transition-all duration-500 hover:opacity-90"
                                style={{ height: `${(item.cantidad / max) * 100}%` }}
                            />
                        </div>
                        <span className="text-xs text-gray-400 font-medium">{item.dia}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}
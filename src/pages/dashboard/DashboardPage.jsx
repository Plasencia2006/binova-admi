import { useEffect, useState } from 'react'
import { Trash2, AlertCircle, Truck, Activity, CheckCircle2 } from 'lucide-react'
import StatCard from '../../components/dashboard/StatCard'
import RecoleccionChart from '../../components/dashboard/RecoleccionChart'
import { dashboardService } from '../../services/dashboardService'

/** Si viene un objeto, toma .total o el primer número; si es número, lo deja */
function num(val, fallback = 0) {
    if (val == null) return fallback
    if (typeof val === 'number') return val
    if (typeof val === 'object') {
        if (typeof val.total === 'number') return val.total
        if (typeof val.cantidad === 'number') return val.cantidad
        if (typeof val.count === 'number') return val.count
    }
    const n = Number(val)
    return Number.isFinite(n) ? n : fallback
}

export default function DashboardPage() {
    const [resumen, setResumen] = useState(null)
    const [serie, setSerie] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        const load = async () => {
            setLoading(true)
            setError('')
            try {
                const [r, s] = await Promise.all([
                    dashboardService.getResumen(),
                    dashboardService.getRecoleccionesPorDia(7).catch(() => []),
                ])
                setResumen(r)

                const arr = Array.isArray(s) ? s : s?.data || s?.serie || []
                const normalizada = arr.map((item) => ({
                    dia: String(item.dia || item.fecha || item.label || ''),
                    cantidad: num(item.cantidad ?? item.total ?? item.recolecciones, 0),
                }))
                setSerie(normalizada)
            } catch (err) {
                setError(
                    err.response?.data?.message ||
                    'No se pudieron cargar las estadísticas'
                )
            } finally {
                setLoading(false)
            }
        }
        load()
    }, [])

    const c = resumen || {}

    // Contenedores: puede ser número u objeto { total, verde, ambar, rojo, sin_lectura }
    const contenedoresObj =
        typeof c.contenedores === 'object' && c.contenedores !== null
            ? c.contenedores
            : null

    const totalContenedores = contenedoresObj
        ? num(contenedoresObj.total)
        : num(
            c.contenedores_total ??
            c.total_contenedores ??
            c.contenedores
        )

    const verde = num(contenedoresObj?.verde ?? c.verde)
    const ambar = num(contenedoresObj?.ambar ?? c.ambar)
    const rojo = num(contenedoresObj?.rojo ?? c.rojo)
    const sinLectura = num(contenedoresObj?.sin_lectura ?? c.sin_lectura)

    const alertasPendientes = num(
        c.alertas_pendientes ??
        c.alertas?.pendientes ??
        (typeof c.alertas === 'number' ? c.alertas : c.alertas?.total)
    )

    const recoleccionesHoy = num(
        c.recolecciones_hoy ?? c.vaciados_hoy ?? c.recolecciones?.hoy
    )

    const turnosAbiertos = num(
        c.turnos_abiertos ?? c.turnos?.abiertos ?? (typeof c.turnos === 'number' ? c.turnos : null)
    )

    const nivelPromedioRaw = c.nivel_promedio ?? c.promedio_nivel
    const nivelPromedio =
        nivelPromedioRaw != null && typeof nivelPromedioRaw !== 'object'
            ? Math.round(num(nivelPromedioRaw))
            : null

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-500 text-sm mt-1">
                    Resumen de tu organización · datos en vivo desde la API
                </p>
            </div>

            {error && (
                <div className="p-3 bg-amber-50 border border-amber-100 text-amber-800 text-sm rounded-xl">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                <StatCard
                    title="Contenedores"
                    value={loading ? '…' : totalContenedores}
                    subtitle={
                        contenedoresObj
                            ? `${verde} verde · ${ambar} ámbar · ${rojo} rojo`
                            : 'En la organización'
                    }
                    icon={Trash2}
                    color="green"
                />
                <StatCard
                    title="Alertas pendientes"
                    value={loading ? '…' : alertasPendientes}
                    subtitle="Requieren atención"
                    icon={AlertCircle}
                    color="amber"
                />
                <StatCard
                    title="Recolecciones hoy"
                    value={loading ? '…' : recoleccionesHoy}
                    subtitle="Vaciados registrados"
                    icon={CheckCircle2}
                    color="green"
                />
                <StatCard
                    title="Turnos abiertos"
                    value={loading ? '…' : turnosAbiertos}
                    subtitle="Operarios en campo"
                    icon={Truck}
                    color="blue"
                />
            </div>

            {/* Detalle de estados de contenedores */}
            {contenedoresObj && !loading && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
                        <p className="text-xs text-gray-400">Verde</p>
                        <p className="text-2xl font-bold text-emerald-600">{verde}</p>
                    </div>
                    <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
                        <p className="text-xs text-gray-400">Ámbar</p>
                        <p className="text-2xl font-bold text-amber-500">{ambar}</p>
                    </div>
                    <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
                        <p className="text-xs text-gray-400">Rojo</p>
                        <p className="text-2xl font-bold text-red-500">{rojo}</p>
                    </div>
                    <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
                        <p className="text-xs text-gray-400">Sin lectura</p>
                        <p className="text-2xl font-bold text-gray-500">{sinLectura}</p>
                    </div>
                </div>
            )}

            {nivelPromedio != null && (
                <StatCard
                    title="Nivel promedio de llenado"
                    value={loading ? '…' : `${nivelPromedio}%`}
                    subtitle="Contenedores activos"
                    icon={Activity}
                    color="gray"
                />
            )}

            {serie.length > 0 && <RecoleccionChart data={serie} />}
        </div>
    )
}
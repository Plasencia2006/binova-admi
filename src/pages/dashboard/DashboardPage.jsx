import {
    Trash2,
    Truck,
    Link2,
    Activity,
    AlertCircle,
    CheckCircle2,
} from 'lucide-react'
import StatCard from '../../components/dashboard/StatCard'
import RecentActivity from '../../components/dashboard/RecentActivity'
import TachosStatus from '../../components/dashboard/TachosStatus'
import RecoleccionChart from '../../components/dashboard/RecoleccionChart'
import {
    stats,
    actividadReciente,
    estadoTachos,
    resumenRecoleccion,
} from '../../data/dashboard'

export default function DashboardPage() {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-500 text-sm mt-1">
                    Resumen general del sistema de gestión de residuos BINOVA
                </p>
            </div>

            {/* Stats principales */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                <StatCard
                    title="Total de tachos"
                    value={stats.totalTachos}
                    subtitle={`${stats.tachosActivos} activos`}
                    icon={Trash2}
                    color="green"
                />
                <StatCard
                    title="Tachos pendientes"
                    value={stats.tachosPendientes}
                    subtitle="Requieren atención"
                    icon={AlertCircle}
                    color="amber"
                />
                <StatCard
                    title="Carritos"
                    value={stats.totalCarritos}
                    subtitle={`${stats.carritosDisponibles} disponibles`}
                    icon={Truck}
                    color="blue"
                />
                <StatCard
                    title="Asignaciones activas"
                    value={stats.asignacionesActivas}
                    subtitle="En operación"
                    icon={Link2}
                    color="green"
                />
            </div>

            {/* Stats secundarias */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <StatCard
                    title="Nivel promedio de llenado"
                    value={`${stats.nivelPromedio}%`}
                    subtitle="Todos los tachos activos"
                    icon={Activity}
                    color="gray"
                />
                <StatCard
                    title="Recolecciones hoy"
                    value={stats.recoleccionesHoy}
                    subtitle="Rutas completadas"
                    icon={CheckCircle2}
                    color="green"
                />
            </div>

            {/* Contenido inferior */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* Gráfico + Estado */}
                <div className="xl:col-span-2 space-y-6">
                    <RecoleccionChart data={resumenRecoleccion} />
                    <TachosStatus data={estadoTachos} />
                </div>

                {/* Actividad */}
                <div>
                    <RecentActivity items={actividadReciente} />
                </div>
            </div>
        </div>
    )
}
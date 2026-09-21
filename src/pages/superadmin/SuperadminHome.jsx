import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
    Building2,
    Clock,
    CheckCircle,
    XCircle,
    Cpu,
    ArrowUpRight,
    Users,
    Activity,
    Shield,
} from 'lucide-react'
import { organizacionService } from '../../services/organizacionService'
import { useAuth } from '../../context/AuthContext'

export default function SuperadminHome() {
    const { user } = useAuth()
    const [orgs, setOrgs] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const load = async () => {
            try {
                const data = await organizacionService.listar()
                const list = Array.isArray(data) ? data : data.data || data.organizaciones || []
                setOrgs(list)
            } catch {
                setOrgs([])
            } finally {
                setLoading(false)
            }
        }
        load()
    }, [])

    const stats = {
        total: orgs.length,
        pendientes: orgs.filter((o) => o.estado === 'pendiente').length,
        activas: orgs.filter((o) => o.estado === 'activa').length,
        suspendidas: orgs.filter((o) => o.estado === 'suspendida').length,
        rechazadas: orgs.filter((o) => o.estado === 'rechazada').length,
        empresas: orgs.filter((o) => o.tipo === 'empresa').length,
        individuales: orgs.filter((o) => o.tipo === 'individual').length,
    }

    // Barras simples por estado (proporción visual)
    const maxBar = Math.max(stats.pendientes, stats.activas, stats.suspendidas, stats.rechazadas, 1)
    const bars = [
        { label: 'Pendientes', value: stats.pendientes, color: 'bg-amber-400' },
        { label: 'Activas', value: stats.activas, color: 'bg-[#6EA838]' },
        { label: 'Suspendidas', value: stats.suspendidas, color: 'bg-red-400' },
        { label: 'Rechazadas', value: stats.rechazadas, color: 'bg-gray-300' },
    ]

    // Últimas solicitudes (pendientes primero, luego el resto)
    const recientes = [...orgs]
        .sort((a, b) => {
            if (a.estado === 'pendiente' && b.estado !== 'pendiente') return -1
            if (b.estado === 'pendiente' && a.estado !== 'pendiente') return 1
            return (b.id || 0) - (a.id || 0)
        })
        .slice(0, 6)

    const estadoColor = {
        pendiente: 'bg-amber-50 text-amber-700',
        activa: 'bg-emerald-50 text-emerald-700',
        suspendida: 'bg-red-50 text-red-600',
        rechazada: 'bg-gray-100 text-gray-500',
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                    <p className="text-sm text-gray-400">Panel de control</p>
                    <h1 className="text-2xl font-bold text-gray-900">
                        Hola, {user?.nombre?.split(' ')[0] || 'Superadmin'}
                    </h1>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-400 bg-white border border-gray-100 rounded-xl px-3 py-2">
                    <Shield size={14} className="text-[#6EA838]" />
                    Acceso global BINOVA
                </div>
            </div>

            {/* KPI row */}
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
                {[
                    {
                        label: 'Organizaciones',
                        value: loading ? '—' : stats.total,
                        sub: `${stats.empresas} empresas · ${stats.individuales} individuales`,
                        icon: Building2,
                        accent: 'from-[#6EA838]/15 to-transparent',
                        iconBg: 'bg-[#6EA838]/10 text-[#6EA838]',
                    },
                    {
                        label: 'Pendientes',
                        value: loading ? '—' : stats.pendientes,
                        sub: 'Solicitudes por revisar',
                        icon: Clock,
                        accent: 'from-amber-400/15 to-transparent',
                        iconBg: 'bg-amber-50 text-amber-600',
                    },
                    {
                        label: 'Activas',
                        value: loading ? '—' : stats.activas,
                        sub: 'Operando en el sistema',
                        icon: CheckCircle,
                        accent: 'from-emerald-400/15 to-transparent',
                        iconBg: 'bg-emerald-50 text-emerald-600',
                    },
                    {
                        label: 'Suspendidas',
                        value: loading ? '—' : stats.suspendidas,
                        sub: 'Acceso temporalmente cortado',
                        icon: XCircle,
                        accent: 'from-red-400/15 to-transparent',
                        iconBg: 'bg-red-50 text-red-500',
                    },
                ].map((card) => {
                    const Icon = card.icon
                    return (
                        <div
                            key={card.label}
                            className={`relative overflow-hidden bg-white rounded-2xl border border-gray-100 p-5 shadow-sm`}
                        >
                            <div
                                className={`absolute inset-0 bg-gradient-to-br ${card.accent} pointer-events-none`}
                            />
                            <div className="relative flex items-start justify-between">
                                <div>
                                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                                        {card.label}
                                    </p>
                                    <p className="text-3xl font-bold text-gray-900 mt-2">{card.value}</p>
                                    <p className="text-xs text-gray-400 mt-1">{card.sub}</p>
                                </div>
                                <div className={`p-2.5 rounded-xl ${card.iconBg}`}>
                                    <Icon size={18} />
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* Middle row: chart + distribution */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Distribución por estado */}
                <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="font-semibold text-gray-900">Distribución por estado</h2>
                            <p className="text-xs text-gray-400 mt-0.5">Organizaciones en la plataforma</p>
                        </div>
                        <Activity size={18} className="text-gray-300" />
                    </div>

                    <div className="flex items-end justify-between gap-3 h-40 px-2">
                        {bars.map((b) => (
                            <div key={b.label} className="flex-1 flex flex-col items-center gap-2">
                                <span className="text-xs font-semibold text-gray-600">{b.value}</span>
                                <div className="w-full flex items-end justify-center h-28">
                                    <div
                                        className={`w-full max-w-[48px] rounded-t-lg ${b.color} transition-all duration-500`}
                                        style={{
                                            height: `${Math.max((b.value / maxBar) * 100, b.value > 0 ? 8 : 2)}%`,
                                        }}
                                    />
                                </div>
                                <span className="text-[10px] text-gray-400 text-center leading-tight">
                                    {b.label}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Donut-like summary */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col">
                    <h2 className="font-semibold text-gray-900 mb-1">Resumen rápido</h2>
                    <p className="text-xs text-gray-400 mb-5">Proporción del total</p>

                    <div className="flex-1 flex flex-col justify-center gap-3">
                        {bars.map((b) => {
                            const pct = stats.total ? Math.round((b.value / stats.total) * 100) : 0
                            return (
                                <div key={b.label}>
                                    <div className="flex justify-between text-xs mb-1">
                                        <span className="text-gray-600">{b.label}</span>
                                        <span className="font-medium text-gray-800">{pct}%</span>
                                    </div>
                                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full rounded-full ${b.color}`}
                                            style={{ width: `${pct}%` }}
                                        />
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>

            {/* Bottom row: activity + quick actions */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Solicitudes recientes */}
                <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm">
                    <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
                        <div>
                            <h2 className="font-semibold text-gray-900">Solicitudes y organizaciones</h2>
                            <p className="text-xs text-gray-400">Pendientes prioritarias primero</p>
                        </div>
                        <Link
                            to="/superadmin/organizaciones"
                            className="text-xs font-medium text-[#6EA838] hover:underline inline-flex items-center gap-1"
                        >
                            Ver todas <ArrowUpRight size={12} />
                        </Link>
                    </div>

                    <div className="divide-y divide-gray-50">
                        {loading ? (
                            <p className="px-5 py-8 text-sm text-gray-400 text-center">Cargando...</p>
                        ) : recientes.length === 0 ? (
                            <p className="px-5 py-8 text-sm text-gray-400 text-center">
                                Aún no hay organizaciones
                            </p>
                        ) : (
                            recientes.map((org) => (
                                <div
                                    key={org.id}
                                    className="px-5 py-3.5 flex items-center gap-3 hover:bg-gray-50/80 transition-colors"
                                >
                                    <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 flex-shrink-0">
                                        <Building2 size={16} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-900 truncate">{org.nombre}</p>
                                        <p className="text-xs text-gray-400 truncate">
                                            {org.contacto_nombre || '—'} · {org.contacto_correo || org.tipo || ''}
                                        </p>
                                    </div>
                                    <span
                                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize ${estadoColor[org.estado] || 'bg-gray-100 text-gray-500'
                                            }`}
                                    >
                                        {org.estado}
                                    </span>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Accesos rápidos */}
                <div className="space-y-4">
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                        <h2 className="font-semibold text-gray-900 mb-4">Acciones rápidas</h2>
                        <div className="space-y-2">
                            <Link
                                to="/superadmin/organizaciones"
                                className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group"
                            >
                                <div className="p-2 rounded-lg bg-[#6EA838]/10 text-[#6EA838]">
                                    <Building2 size={18} />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-900">Organizaciones</p>
                                    <p className="text-xs text-gray-400">Aprobar y gestionar</p>
                                </div>
                                <ArrowUpRight
                                    size={14}
                                    className="text-gray-300 group-hover:text-[#6EA838]"
                                />
                            </Link>
                            <Link
                                to="/superadmin/inventario"
                                className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group"
                            >
                                <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
                                    <Cpu size={18} />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-900">Inventario IoT</p>
                                    <p className="text-xs text-gray-400">Provisionar ESP32</p>
                                </div>
                                <ArrowUpRight
                                    size={14}
                                    className="text-gray-300 group-hover:text-blue-600"
                                />
                            </Link>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-[#0B1220] to-[#1a3a2a] rounded-2xl p-5 text-white">
                        <div className="flex items-center gap-2 mb-2">
                            <Users size={16} className="text-[#6EA838]" />
                            <span className="text-xs font-medium text-gray-300">Cola de revisión</span>
                        </div>
                        <p className="text-3xl font-bold">{stats.pendientes}</p>
                        <p className="text-xs text-gray-400 mt-1 mb-4">
                            solicitudes de empresa esperando aprobación
                        </p>
                        <Link
                            to="/superadmin/organizaciones"
                            className="inline-flex items-center gap-1 text-xs font-semibold text-[#6EA838] hover:underline"
                        >
                            Revisar ahora <ArrowUpRight size={12} />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
import { useEffect, useState, useMemo } from 'react'
import {
    Search,
    RefreshCw,
    Hand,
    Unlock,
    CheckCircle,
    Filter,
    AlertTriangle,
} from 'lucide-react'
import { alertaService } from '../../services/alertaService'
import { carritoService } from '../../services/carritoService'
import { useAuth } from '../../context/AuthContext'
import Badge from '../../components/ui/Badge'
import Modal from '../../components/ui/Modal'

const TIPO_LABEL = {
    llenado_critico: 'Llenado crítico',
    bateria_baja: 'Batería baja',
    sin_reporte: 'Sin reporte',
}

function tipoBadge(tipo) {
    const map = {
        llenado_critico: { label: TIPO_LABEL[tipo] || tipo, variant: 'danger' },
        bateria_baja: { label: TIPO_LABEL[tipo] || tipo, variant: 'warning' },
        sin_reporte: { label: TIPO_LABEL[tipo] || tipo, variant: 'default' },
    }
    return map[tipo] || { label: tipo || '—', variant: 'default' }
}

export default function AlertasPage() {
    const { rol } = useAuth()
    const [alertas, setAlertas] = useState([])
    const [carritos, setCarritos] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [search, setSearch] = useState('')
    const [filtroEstado, setFiltroEstado] = useState('pendiente')
    const [filtroTipo, setFiltroTipo] = useState('todos')
    const [actionId, setActionId] = useState(null)
    const [asignarModal, setAsignarModal] = useState(null)
    const [carritoId, setCarritoId] = useState('')

    const esOperario = rol === 'operario'
    const esAdminOSupervisor = rol === 'admin' || rol === 'supervisor'

    const load = async () => {
        setLoading(true)
        setError('')
        try {
            const params = {}
            if (filtroEstado !== 'todos') params.estado = filtroEstado
            if (filtroTipo !== 'todos') params.tipo = filtroTipo

            const [list, cars] = await Promise.all([
                alertaService.getAll(params),
                esAdminOSupervisor
                    ? carritoService.getAll().catch(() => [])
                    : Promise.resolve([]),
            ])
            setAlertas(list)
            setCarritos(cars)
        } catch (err) {
            setError(err.response?.data?.message || 'Error al cargar alertas')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        load()
    }, [filtroEstado, filtroTipo])

    const filtered = useMemo(() => {
        const q = search.toLowerCase()
        return alertas.filter((a) => {
            const cod = a.contenedor?.codigo || a.contenedor_codigo || ''
            const nom = a.contenedor?.nombre || ''
            return (
                cod.toLowerCase().includes(q) ||
                nom.toLowerCase().includes(q) ||
                (a.tipo || '').toLowerCase().includes(q)
            )
        })
    }, [alertas, search])

    const run = async (id, fn) => {
        setActionId(id)
        try {
            await fn()
            await load()
        } catch (err) {
            alert(err.response?.data?.message || err.response?.data?.error || 'Error en la acción')
        } finally {
            setActionId(null)
        }
    }

    const confirmarAsignar = async () => {
        if (!carritoId || !asignarModal) return
        await run(asignarModal.id, () =>
            alertaService.asignar(asignarModal.id, Number(carritoId))
        )
        setAsignarModal(null)
        setCarritoId('')
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Alertas</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Llenado crítico, batería baja y sin reporte
                    </p>
                </div>
                <button
                    onClick={load}
                    className="inline-flex items-center gap-2 px-3 py-2.5 border border-gray-200 rounded-xl text-sm hover:bg-gray-50"
                >
                    <RefreshCw size={16} />
                    Actualizar
                </button>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Buscar contenedor o tipo..."
                        className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#6EA838]"
                    />
                </div>
                <select
                    value={filtroEstado}
                    onChange={(e) => setFiltroEstado(e.target.value)}
                    className="px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-white"
                >
                    <option value="pendiente">Pendientes</option>
                    <option value="atendida">Atendidas</option>
                    <option value="todos">Todos</option>
                </select>
                <select
                    value={filtroTipo}
                    onChange={(e) => setFiltroTipo(e.target.value)}
                    className="px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-white"
                >
                    <option value="todos">Todos los tipos</option>
                    <option value="llenado_critico">Llenado crítico</option>
                    <option value="bateria_baja">Batería baja</option>
                    <option value="sin_reporte">Sin reporte</option>
                </select>
            </div>

            {error && (
                <div className="p-3 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100">
                    {error}
                </div>
            )}

            <div className="space-y-3">
                {loading ? (
                    <p className="text-center text-gray-400 py-12 text-sm">Cargando...</p>
                ) : filtered.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center text-gray-400">
                        <AlertTriangle className="mx-auto mb-2 opacity-40" size={28} />
                        No hay alertas
                    </div>
                ) : (
                    filtered.map((a) => {
                        const badge = tipoBadge(a.tipo)
                        const cod = a.contenedor?.codigo || a.contenedor_codigo || '—'
                        const busy = actionId === a.id
                        const pendiente = a.estado === 'pendiente' || !a.atendida_en

                        return (
                            <div
                                key={a.id}
                                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-col sm:flex-row sm:items-center gap-3"
                            >
                                <div className="flex-1 min-w-0">
                                    <div className="flex flex-wrap items-center gap-2 mb-1">
                                        <span className="font-semibold text-gray-900">{cod}</span>
                                        <Badge variant={badge.variant}>{badge.label}</Badge>
                                        {pendiente ? (
                                            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-amber-50 text-amber-700">
                                                Pendiente
                                            </span>
                                        ) : (
                                            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">
                                                Atendida
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-xs text-gray-400">
                                        {a.contenedor?.nombre || ''}
                                        {a.carrito_id || a.carrito
                                            ? ` · Carrito asignado: ${a.carrito?.codigo || a.carrito_id}`
                                            : ' · Sin carrito'}
                                        {a.hay_carrito_en_turno ? ' · Hay carrito en turno en zona' : ''}
                                    </p>
                                </div>

                                {pendiente && (
                                    <div className="flex flex-wrap gap-1">
                                        {esOperario && (
                                            <button
                                                disabled={busy}
                                                onClick={() => run(a.id, () => alertaService.tomar(a.id))}
                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-[#6EA838] text-white hover:bg-[#5a8f2e] disabled:opacity-50"
                                            >
                                                <Hand size={14} />
                                                Tomar
                                            </button>
                                        )}
                                        {(esOperario || esAdminOSupervisor) && (a.carrito_id || a.carrito) && (
                                            <button
                                                disabled={busy}
                                                onClick={() => run(a.id, () => alertaService.soltar(a.id))}
                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                                            >
                                                <Unlock size={14} />
                                                Soltar
                                            </button>
                                        )}
                                        {esAdminOSupervisor && (
                                            <>
                                                <button
                                                    disabled={busy}
                                                    onClick={() => {
                                                        setAsignarModal(a)
                                                        setCarritoId('')
                                                    }}
                                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                                                >
                                                    Asignar
                                                </button>
                                                <button
                                                    disabled={busy}
                                                    onClick={() => run(a.id, () => alertaService.atender(a.id))}
                                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-gray-800 text-white hover:bg-gray-900 disabled:opacity-50"
                                                >
                                                    <CheckCircle size={14} />
                                                    Atender
                                                </button>
                                            </>
                                        )}
                                    </div>
                                )}
                            </div>
                        )
                    })
                )}
            </div>

            <p className="text-xs text-gray-400">{filtered.length} alerta(s)</p>

            <Modal
                isOpen={!!asignarModal}
                onClose={() => setAsignarModal(null)}
                title="Asignar alerta a carrito"
                size="sm"
            >
                <div className="space-y-4">
                    <p className="text-sm text-gray-600">
                        Alerta de{' '}
                        <strong>
                            {asignarModal?.contenedor?.codigo || asignarModal?.contenedor_codigo}
                        </strong>
                    </p>
                    <select
                        value={carritoId}
                        onChange={(e) => setCarritoId(e.target.value)}
                        className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm"
                    >
                        <option value="">Seleccionar carrito...</option>
                        {carritos.map((c) => (
                            <option key={c.id} value={c.id}>
                                {c.codigo} {c.placa ? `· ${c.placa}` : ''}
                            </option>
                        ))}
                    </select>
                    <div className="flex justify-end gap-2">
                        <button
                            onClick={() => setAsignarModal(null)}
                            className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={confirmarAsignar}
                            disabled={!carritoId}
                            className="px-4 py-2 text-sm text-white bg-[#6EA838] rounded-lg disabled:opacity-50"
                        >
                            Asignar
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    )
}
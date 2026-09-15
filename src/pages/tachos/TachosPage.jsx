import { useState, useMemo } from 'react'
import {
    Plus,
    Search,
    Eye,
    Pencil,
    Trash2,
    Power,
    Filter,
} from 'lucide-react'
import { tachosMock } from '../../data/tachos'
import Badge from '../../components/ui/Badge'
import Modal from '../../components/ui/Modal'
import TachoForm from './TachoForm'

function getEstadoBadge(estado) {
    const map = {
        activo: { label: 'Activo', variant: 'success' },
        inactivo: { label: 'Inactivo', variant: 'default' },
        mantenimiento: { label: 'Mantenimiento', variant: 'warning' },
    }
    return map[estado] || map.inactivo
}

function getNivelColor(nivel) {
    if (nivel >= 85) return 'bg-red-500'
    if (nivel >= 60) return 'bg-amber-400'
    return 'bg-emerald-500'
}

export default function TachosPage() {
    const [tachos, setTachos] = useState(tachosMock)
    const [search, setSearch] = useState('')
    const [filtroEstado, setFiltroEstado] = useState('todos')
    const [modalOpen, setModalOpen] = useState(false)
    const [modalMode, setModalMode] = useState('create') // create | edit | view
    const [selected, setSelected] = useState(null)
    const [deleteConfirm, setDeleteConfirm] = useState(null)

    const filtered = useMemo(() => {
        return tachos.filter((t) => {
            const matchSearch =
                t.codigo.toLowerCase().includes(search.toLowerCase()) ||
                t.nombre.toLowerCase().includes(search.toLowerCase()) ||
                t.ubicacion.toLowerCase().includes(search.toLowerCase())

            const matchEstado = filtroEstado === 'todos' || t.estado === filtroEstado

            return matchSearch && matchEstado
        })
    }, [tachos, search, filtroEstado])

    const openCreate = () => {
        setSelected(null)
        setModalMode('create')
        setModalOpen(true)
    }

    const openEdit = (tacho) => {
        setSelected(tacho)
        setModalMode('edit')
        setModalOpen(true)
    }

    const openView = (tacho) => {
        setSelected(tacho)
        setModalMode('view')
        setModalOpen(true)
    }

    const handleSubmit = (data) => {
        if (modalMode === 'create') {
            const newTacho = {
                ...data,
                id: Date.now(),
                nivel: 0,
                fechaRegistro: new Date().toISOString().split('T')[0],
            }
            setTachos((prev) => [newTacho, ...prev])
        } else if (modalMode === 'edit') {
            setTachos((prev) =>
                prev.map((t) => (t.id === selected.id ? { ...t, ...data } : t))
            )
        }
        setModalOpen(false)
    }

    const toggleEstado = (tacho) => {
        const nuevoEstado = tacho.estado === 'activo' ? 'inactivo' : 'activo'
        setTachos((prev) =>
            prev.map((t) => (t.id === tacho.id ? { ...t, estado: nuevoEstado } : t))
        )
    }

    const handleDelete = () => {
        setTachos((prev) => prev.filter((t) => t.id !== deleteConfirm.id))
        setDeleteConfirm(null)
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Tachos</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Gestión de contenedores inteligentes
                    </p>
                </div>
                <button
                    onClick={openCreate}
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#6EA838] hover:bg-[#5a8f2e] text-white text-sm font-medium rounded-xl transition-colors shadow-sm"
                >
                    <Plus size={18} />
                    Registrar tacho
                </button>
            </div>

            {/* Filtros */}
            <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Buscar por código, nombre o ubicación..."
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#6EA838] focus:border-transparent"
                        />
                    </div>
                    <div className="relative">
                        <Filter size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <select
                            value={filtroEstado}
                            onChange={(e) => setFiltroEstado(e.target.value)}
                            className="pl-9 pr-8 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#6EA838] appearance-none bg-white min-w-[160px]"
                        >
                            <option value="todos">Todos los estados</option>
                            <option value="activo">Activo</option>
                            <option value="inactivo">Inactivo</option>
                            <option value="mantenimiento">Mantenimiento</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Tabla */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100">
                                <th className="text-left px-4 py-3 font-semibold text-gray-600">Código</th>
                                <th className="text-left px-4 py-3 font-semibold text-gray-600">Nombre</th>
                                <th className="text-left px-4 py-3 font-semibold text-gray-600 hidden md:table-cell">Ubicación</th>
                                <th className="text-left px-4 py-3 font-semibold text-gray-600 hidden lg:table-cell">Capacidad</th>
                                <th className="text-left px-4 py-3 font-semibold text-gray-600">Nivel</th>
                                <th className="text-left px-4 py-3 font-semibold text-gray-600">Estado</th>
                                <th className="text-right px-4 py-3 font-semibold text-gray-600">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-4 py-12 text-center text-gray-400">
                                        No se encontraron tachos
                                    </td>
                                </tr>
                            ) : (
                                filtered.map((tacho) => {
                                    const badge = getEstadoBadge(tacho.estado)
                                    return (
                                        <tr key={tacho.id} className="hover:bg-gray-50/80 transition-colors">
                                            <td className="px-4 py-3 font-medium text-gray-900">{tacho.codigo}</td>
                                            <td className="px-4 py-3 text-gray-700 max-w-[180px] truncate">{tacho.nombre}</td>
                                            <td className="px-4 py-3 text-gray-500 hidden md:table-cell max-w-[160px] truncate">
                                                {tacho.ubicacion}
                                            </td>
                                            <td className="px-4 py-3 text-gray-500 hidden lg:table-cell">
                                                {tacho.capacidad} L
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-2 min-w-[90px]">
                                                    <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                                        <div
                                                            className={`h-full rounded-full ${getNivelColor(tacho.nivel)}`}
                                                            style={{ width: `${tacho.nivel}%` }}
                                                        />
                                                    </div>
                                                    <span className="text-xs text-gray-500 w-8">{tacho.nivel}%</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <Badge variant={badge.variant}>{badge.label}</Badge>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center justify-end gap-1">
                                                    <button
                                                        onClick={() => openView(tacho)}
                                                        className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                                                        title="Ver detalles"
                                                    >
                                                        <Eye size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => openEdit(tacho)}
                                                        className="p-1.5 rounded-lg text-gray-400 hover:text-[#6EA838] hover:bg-green-50 transition-colors"
                                                        title="Editar"
                                                    >
                                                        <Pencil size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => toggleEstado(tacho)}
                                                        className="p-1.5 rounded-lg text-gray-400 hover:text-amber-600 hover:bg-amber-50 transition-colors"
                                                        title={tacho.estado === 'activo' ? 'Desactivar' : 'Activar'}
                                                    >
                                                        <Power size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => setDeleteConfirm(tacho)}
                                                        className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                                                        title="Eliminar"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Footer */}
                <div className="px-4 py-3 border-t border-gray-100 text-xs text-gray-400">
                    Mostrando {filtered.length} de {tachos.length} tachos
                </div>
            </div>

            {/* Modal Crear / Editar */}
            <Modal
                isOpen={modalOpen && modalMode !== 'view'}
                onClose={() => setModalOpen(false)}
                title={modalMode === 'create' ? 'Registrar tacho' : 'Editar tacho'}
                size="lg"
            >
                <TachoForm
                    tacho={modalMode === 'edit' ? selected : null}
                    onSubmit={handleSubmit}
                    onCancel={() => setModalOpen(false)}
                />
            </Modal>

            {/* Modal Ver detalles */}
            <Modal
                isOpen={modalOpen && modalMode === 'view'}
                onClose={() => setModalOpen(false)}
                title="Detalle del tacho"
            >
                {selected && (
                    <div className="space-y-5 text-sm">
                        {/* General */}
                        <div>
                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">General</p>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <p className="text-gray-400">Código</p>
                                    <p className="font-medium text-gray-900">{selected.codigo}</p>
                                </div>
                                <div>
                                    <p className="text-gray-400">Estado</p>
                                    <Badge variant={getEstadoBadge(selected.estado).variant}>
                                        {getEstadoBadge(selected.estado).label}
                                    </Badge>
                                </div>
                                <div className="col-span-2">
                                    <p className="text-gray-400">Nombre</p>
                                    <p className="font-medium text-gray-900">{selected.nombre}</p>
                                </div>
                                <div className="col-span-2">
                                    <p className="text-gray-400">Ubicación</p>
                                    <p className="font-medium text-gray-900">{selected.ubicacion}</p>
                                </div>
                                <div>
                                    <p className="text-gray-400">Capacidad</p>
                                    <p className="font-medium text-gray-900">{selected.capacidad} L</p>
                                </div>
                                <div>
                                    <p className="text-gray-400">Nivel</p>
                                    <p className="font-medium text-gray-900">{selected.nivel}%</p>
                                </div>
                                <div>
                                    <p className="text-gray-400">Umbral alerta</p>
                                    <p className="font-medium text-gray-900">{selected.umbralAlerta ?? 80}%</p>
                                </div>
                                <div>
                                    <p className="text-gray-400">Registro</p>
                                    <p className="font-medium text-gray-900">{selected.fechaRegistro}</p>
                                </div>
                            </div>
                        </div>

                        {/* IoT */}
                        <div className="border-t border-gray-100 pt-4">
                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">ESP32 / IoT</p>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <p className="text-gray-400">Device ID</p>
                                    <p className="font-medium text-gray-900 font-mono text-xs">{selected.deviceId || '—'}</p>
                                </div>
                                <div>
                                    <p className="text-gray-400">MAC</p>
                                    <p className="font-medium text-gray-900 font-mono text-xs">{selected.macAddress || '—'}</p>
                                </div>
                                <div>
                                    <p className="text-gray-400">Firmware</p>
                                    <p className="font-medium text-gray-900">{selected.firmwareVersion || '—'}</p>
                                </div>
                                <div>
                                    <p className="text-gray-400">Conexión</p>
                                    <Badge variant={selected.connectionStatus === 'online' ? 'success' : 'default'}>
                                        {selected.connectionStatus === 'online' ? 'Online' : 'Offline'}
                                    </Badge>
                                </div>
                                <div>
                                    <p className="text-gray-400">WiFi SSID</p>
                                    <p className="font-medium text-gray-900">{selected.wifiSSID || '—'}</p>
                                </div>
                                <div>
                                    <p className="text-gray-400">IP</p>
                                    <p className="font-medium text-gray-900 font-mono text-xs">{selected.ipAddress || '—'}</p>
                                </div>
                                <div>
                                    <p className="text-gray-400">RSSI</p>
                                    <p className="font-medium text-gray-900">{selected.rssi != null ? `${selected.rssi} dBm` : '—'}</p>
                                </div>
                                <div>
                                    <p className="text-gray-400">Batería</p>
                                    <p className="font-medium text-gray-900">
                                        {selected.batteryLevel != null ? `${selected.batteryLevel}%` : 'Red eléctrica'}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-gray-400">Sensor ultrasónico</p>
                                    <p className="font-medium text-gray-900">{selected.hasUltrasonic ? 'Sí' : 'No'}</p>
                                </div>
                                <div>
                                    <p className="text-gray-400">Servomotor</p>
                                    <p className="font-medium text-gray-900">{selected.hasServo ? 'Sí' : 'No'}</p>
                                </div>
                                <div>
                                    <p className="text-gray-400">Altura sensor</p>
                                    <p className="font-medium text-gray-900">
                                        {selected.alturaSensorCm != null ? `${selected.alturaSensorCm} cm` : '—'}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-gray-400">Última conexión</p>
                                    <p className="font-medium text-gray-900 text-xs">
                                        {selected.lastSeen
                                            ? new Date(selected.lastSeen).toLocaleString('es-PE')
                                            : '—'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end pt-2">
                            <button
                                onClick={() => setModalOpen(false)}
                                className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg"
                            >
                                Cerrar
                            </button>
                        </div>
                    </div>
                )}
            </Modal>

            {/* Confirmar eliminación */}
            <Modal
                isOpen={!!deleteConfirm}
                onClose={() => setDeleteConfirm(null)}
                title="Eliminar tacho"
                size="sm"
            >
                <p className="text-sm text-gray-600 mb-6">
                    ¿Estás seguro de eliminar el tacho{' '}
                    <strong>{deleteConfirm?.codigo}</strong>? Esta acción no se puede deshacer.
                </p>
                <div className="flex justify-end gap-3">
                    <button
                        onClick={() => setDeleteConfirm(null)}
                        className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleDelete}
                        className="px-4 py-2 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-lg"
                    >
                        Eliminar
                    </button>
                </div>
            </Modal>
        </div>
    )
}
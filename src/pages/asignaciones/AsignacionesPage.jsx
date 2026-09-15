import { useState, useMemo } from 'react'
import { Plus, Search, Eye, Trash2, CheckCircle, Filter } from 'lucide-react'
import { asignacionesMock } from '../../data/asignaciones'
import { carritosMock } from '../../data/carritos'
import { tachosMock } from '../../data/tachos'
import Badge from '../../components/ui/Badge'
import Modal from '../../components/ui/Modal'
import AsignacionForm from '../../components/asignaciones/AsignacionForm'

function getEstadoBadge(estado) {
    const map = {
        activa: { label: 'Activa', variant: 'success' },
        completada: { label: 'Completada', variant: 'info' },
        cancelada: { label: 'Cancelada', variant: 'default' },
    }
    return map[estado] || map.cancelada
}

export default function AsignacionesPage() {
    const [asignaciones, setAsignaciones] = useState(asignacionesMock)
    const [search, setSearch] = useState('')
    const [filtroEstado, setFiltroEstado] = useState('todos')
    const [modalOpen, setModalOpen] = useState(false)
    const [selected, setSelected] = useState(null)
    const [deleteConfirm, setDeleteConfirm] = useState(null)

    const filtered = useMemo(() => {
        return asignaciones.filter((a) => {
            const matchSearch =
                a.carritoCodigo.toLowerCase().includes(search.toLowerCase()) ||
                a.carritoNombre.toLowerCase().includes(search.toLowerCase()) ||
                a.tachos.some(
                    (t) =>
                        t.codigo.toLowerCase().includes(search.toLowerCase()) ||
                        t.nombre.toLowerCase().includes(search.toLowerCase())
                )
            const matchEstado = filtroEstado === 'todos' || a.estado === filtroEstado
            return matchSearch && matchEstado
        })
    }, [asignaciones, search, filtroEstado])

    const handleCreate = (data) => {
        const nueva = { ...data, id: Date.now() }
        setAsignaciones((prev) => [nueva, ...prev])
        setModalOpen(false)
    }

    const marcarCompletada = (asig) => {
        setAsignaciones((prev) =>
            prev.map((a) => (a.id === asig.id ? { ...a, estado: 'completada' } : a))
        )
    }

    const handleDelete = () => {
        setAsignaciones((prev) => prev.filter((a) => a.id !== deleteConfirm.id))
        setDeleteConfirm(null)
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Asignaciones</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Asigna tachos a carritos recolectores
                    </p>
                </div>
                <button
                    onClick={() => setModalOpen(true)}
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#6EA838] hover:bg-[#5a8f2e] text-white text-sm font-medium rounded-xl transition-colors shadow-sm"
                >
                    <Plus size={18} />
                    Nueva asignación
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
                            placeholder="Buscar por carrito o tacho..."
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#6EA838]"
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
                            <option value="activa">Activa</option>
                            <option value="completada">Completada</option>
                            <option value="cancelada">Cancelada</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Lista de asignaciones */}
            <div className="space-y-3">
                {filtered.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center text-gray-400">
                        No hay asignaciones
                    </div>
                ) : (
                    filtered.map((asig) => {
                        const badge = getEstadoBadge(asig.estado)
                        return (
                            <div
                                key={asig.id}
                                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow"
                            >
                                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap mb-2">
                                            <span className="font-semibold text-gray-900">
                                                {asig.carritoCodigo}
                                            </span>
                                            <span className="text-gray-400">·</span>
                                            <span className="text-gray-600 text-sm">{asig.carritoNombre}</span>
                                            <Badge variant={badge.variant}>{badge.label}</Badge>
                                        </div>

                                        <div className="flex flex-wrap gap-1.5 mb-2">
                                            {asig.tachos.map((t) => (
                                                <span
                                                    key={t.id}
                                                    className="inline-flex px-2.5 py-1 bg-gray-50 border border-gray-100 rounded-lg text-xs font-medium text-gray-700"
                                                >
                                                    {t.codigo}
                                                </span>
                                            ))}
                                        </div>

                                        <div className="flex items-center gap-3 text-xs text-gray-400">
                                            <span>{asig.tachos.length} tacho{asig.tachos.length !== 1 ? 's' : ''}</span>
                                            <span>·</span>
                                            <span>{asig.fecha}</span>
                                            {asig.observaciones && (
                                                <>
                                                    <span>·</span>
                                                    <span className="truncate max-w-[200px]">{asig.observaciones}</span>
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-1 flex-shrink-0">
                                        <button
                                            onClick={() => setSelected(asig)}
                                            className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                                            title="Ver detalle"
                                        >
                                            <Eye size={16} />
                                        </button>
                                        {asig.estado === 'activa' && (
                                            <button
                                                onClick={() => marcarCompletada(asig)}
                                                className="p-1.5 rounded-lg text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors"
                                                title="Marcar como completada"
                                            >
                                                <CheckCircle size={16} />
                                            </button>
                                        )}
                                        <button
                                            onClick={() => setDeleteConfirm(asig)}
                                            className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                                            title="Eliminar"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )
                    })
                )}
            </div>

            <p className="text-xs text-gray-400">
                Mostrando {filtered.length} de {asignaciones.length} asignaciones
            </p>

            {/* Modal crear */}
            <Modal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                title="Nueva asignación"
                size="lg"
            >
                <AsignacionForm
                    carritos={carritosMock}
                    tachos={tachosMock}
                    asignaciones={asignaciones}
                    onSubmit={handleCreate}
                    onCancel={() => setModalOpen(false)}
                />
            </Modal>

            {/* Modal detalle */}
            <Modal
                isOpen={!!selected}
                onClose={() => setSelected(null)}
                title="Detalle de asignación"
            >
                {selected && (
                    <div className="space-y-4 text-sm">
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <p className="text-gray-400">Carrito</p>
                                <p className="font-medium text-gray-900">
                                    {selected.carritoCodigo} — {selected.carritoNombre}
                                </p>
                            </div>
                            <div>
                                <p className="text-gray-400">Estado</p>
                                <Badge variant={getEstadoBadge(selected.estado).variant}>
                                    {getEstadoBadge(selected.estado).label}
                                </Badge>
                            </div>
                            <div>
                                <p className="text-gray-400">Fecha</p>
                                <p className="font-medium text-gray-900">{selected.fecha}</p>
                            </div>
                            <div>
                                <p className="text-gray-400">Tachos</p>
                                <p className="font-medium text-gray-900">{selected.tachos.length}</p>
                            </div>
                        </div>

                        <div>
                            <p className="text-gray-400 mb-2">Tachos asignados</p>
                            <ul className="space-y-1.5">
                                {selected.tachos.map((t) => (
                                    <li
                                        key={t.id}
                                        className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg"
                                    >
                                        <span className="font-medium text-gray-900">{t.codigo}</span>
                                        <span className="text-gray-500">{t.nombre}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {selected.observaciones && (
                            <div>
                                <p className="text-gray-400">Observaciones</p>
                                <p className="font-medium text-gray-900">{selected.observaciones}</p>
                            </div>
                        )}

                        <div className="flex justify-end pt-2">
                            <button
                                onClick={() => setSelected(null)}
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
                title="Eliminar asignación"
                size="sm"
            >
                <p className="text-sm text-gray-600 mb-6">
                    ¿Eliminar la asignación de <strong>{deleteConfirm?.carritoCodigo}</strong> con{' '}
                    {deleteConfirm?.tachos.length} tacho(s)?
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
import { useState, useMemo } from 'react'
import { Plus, Search, Eye, Pencil, Trash2, Power, Filter } from 'lucide-react'
import { carritosMock } from '../../data/carritos'
import Badge from '../../components/ui/Badge'
import Modal from '../../components/ui/Modal'
import CarritoForm from '../../components/carritos/CarritoForm'

function getEstadoBadge(estado) {
    const map = {
        disponible: { label: 'Disponible', variant: 'success' },
        en_ruta: { label: 'En ruta', variant: 'info' },
        mantenimiento: { label: 'Mantenimiento', variant: 'warning' },
        inactivo: { label: 'Inactivo', variant: 'default' },
    }
    return map[estado] || map.inactivo
}

export default function CarritosPage() {
    const [carritos, setCarritos] = useState(carritosMock)
    const [search, setSearch] = useState('')
    const [filtroEstado, setFiltroEstado] = useState('todos')
    const [modalOpen, setModalOpen] = useState(false)
    const [modalMode, setModalMode] = useState('create')
    const [selected, setSelected] = useState(null)
    const [deleteConfirm, setDeleteConfirm] = useState(null)

    const filtered = useMemo(() => {
        return carritos.filter((c) => {
            const matchSearch =
                c.codigo.toLowerCase().includes(search.toLowerCase()) ||
                c.nombre.toLowerCase().includes(search.toLowerCase()) ||
                c.responsable.toLowerCase().includes(search.toLowerCase()) ||
                (c.zona || '').toLowerCase().includes(search.toLowerCase())

            const matchEstado = filtroEstado === 'todos' || c.estado === filtroEstado
            return matchSearch && matchEstado
        })
    }, [carritos, search, filtroEstado])

    const openCreate = () => {
        setSelected(null)
        setModalMode('create')
        setModalOpen(true)
    }

    const openEdit = (carrito) => {
        setSelected(carrito)
        setModalMode('edit')
        setModalOpen(true)
    }

    const openView = (carrito) => {
        setSelected(carrito)
        setModalMode('view')
        setModalOpen(true)
    }

    const handleSubmit = (data) => {
        if (modalMode === 'create') {
            const nuevo = {
                ...data,
                id: Date.now(),
                fechaRegistro: new Date().toISOString().split('T')[0],
            }
            setCarritos((prev) => [nuevo, ...prev])
        } else if (modalMode === 'edit') {
            setCarritos((prev) =>
                prev.map((c) => (c.id === selected.id ? { ...c, ...data } : c))
            )
        }
        setModalOpen(false)
    }

    const toggleEstado = (carrito) => {
        const nuevoEstado = carrito.estado === 'inactivo' ? 'disponible' : 'inactivo'
        setCarritos((prev) =>
            prev.map((c) => (c.id === carrito.id ? { ...c, estado: nuevoEstado } : c))
        )
    }

    const handleDelete = () => {
        setCarritos((prev) => prev.filter((c) => c.id !== deleteConfirm.id))
        setDeleteConfirm(null)
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Carritos</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Gestión de carritos recolectores
                    </p>
                </div>
                <button
                    onClick={openCreate}
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#6EA838] hover:bg-[#5a8f2e] text-white text-sm font-medium rounded-xl transition-colors shadow-sm"
                >
                    <Plus size={18} />
                    Registrar carrito
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
                            placeholder="Buscar por código, nombre, responsable o zona..."
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#6EA838] focus:border-transparent"
                        />
                    </div>
                    <div className="relative">
                        <Filter size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <select
                            value={filtroEstado}
                            onChange={(e) => setFiltroEstado(e.target.value)}
                            className="pl-9 pr-8 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#6EA838] appearance-none bg-white min-w-[170px]"
                        >
                            <option value="todos">Todos los estados</option>
                            <option value="disponible">Disponible</option>
                            <option value="en_ruta">En ruta</option>
                            <option value="mantenimiento">Mantenimiento</option>
                            <option value="inactivo">Inactivo</option>
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
                                <th className="text-left px-4 py-3 font-semibold text-gray-600 hidden md:table-cell">Responsable</th>
                                <th className="text-left px-4 py-3 font-semibold text-gray-600 hidden lg:table-cell">Capacidad</th>
                                <th className="text-left px-4 py-3 font-semibold text-gray-600 hidden lg:table-cell">Zona</th>
                                <th className="text-left px-4 py-3 font-semibold text-gray-600">Estado</th>
                                <th className="text-right px-4 py-3 font-semibold text-gray-600">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-4 py-12 text-center text-gray-400">
                                        No se encontraron carritos
                                    </td>
                                </tr>
                            ) : (
                                filtered.map((carrito) => {
                                    const badge = getEstadoBadge(carrito.estado)
                                    return (
                                        <tr key={carrito.id} className="hover:bg-gray-50/80 transition-colors">
                                            <td className="px-4 py-3 font-medium text-gray-900">{carrito.codigo}</td>
                                            <td className="px-4 py-3 text-gray-700 max-w-[160px] truncate">{carrito.nombre}</td>
                                            <td className="px-4 py-3 text-gray-500 hidden md:table-cell">{carrito.responsable}</td>
                                            <td className="px-4 py-3 text-gray-500 hidden lg:table-cell">{carrito.capacidad} L</td>
                                            <td className="px-4 py-3 text-gray-500 hidden lg:table-cell">{carrito.zona || '—'}</td>
                                            <td className="px-4 py-3">
                                                <Badge variant={badge.variant}>{badge.label}</Badge>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center justify-end gap-1">
                                                    <button
                                                        onClick={() => openView(carrito)}
                                                        className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                                                        title="Ver detalles"
                                                    >
                                                        <Eye size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => openEdit(carrito)}
                                                        className="p-1.5 rounded-lg text-gray-400 hover:text-[#6EA838] hover:bg-green-50 transition-colors"
                                                        title="Editar"
                                                    >
                                                        <Pencil size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => toggleEstado(carrito)}
                                                        className="p-1.5 rounded-lg text-gray-400 hover:text-amber-600 hover:bg-amber-50 transition-colors"
                                                        title={carrito.estado === 'inactivo' ? 'Activar' : 'Desactivar'}
                                                    >
                                                        <Power size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => setDeleteConfirm(carrito)}
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
                <div className="px-4 py-3 border-t border-gray-100 text-xs text-gray-400">
                    Mostrando {filtered.length} de {carritos.length} carritos
                </div>
            </div>

            {/* Modal Crear / Editar */}
            <Modal
                isOpen={modalOpen && modalMode !== 'view'}
                onClose={() => setModalOpen(false)}
                title={modalMode === 'create' ? 'Registrar carrito' : 'Editar carrito'}
                size="lg"
            >
                <CarritoForm
                    carrito={modalMode === 'edit' ? selected : null}
                    onSubmit={handleSubmit}
                    onCancel={() => setModalOpen(false)}
                />
            </Modal>

            {/* Modal Ver */}
            <Modal
                isOpen={modalOpen && modalMode === 'view'}
                onClose={() => setModalOpen(false)}
                title="Detalle del carrito"
            >
                {selected && (
                    <div className="space-y-4 text-sm">
                        <div className="grid grid-cols-2 gap-4">
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
                            <div>
                                <p className="text-gray-400">Responsable</p>
                                <p className="font-medium text-gray-900">{selected.responsable}</p>
                            </div>
                            <div>
                                <p className="text-gray-400">Capacidad</p>
                                <p className="font-medium text-gray-900">{selected.capacidad} L</p>
                            </div>
                            <div>
                                <p className="text-gray-400">Tipo</p>
                                <p className="font-medium text-gray-900 capitalize">{selected.tipo}</p>
                            </div>
                            <div>
                                <p className="text-gray-400">Placa</p>
                                <p className="font-medium text-gray-900">{selected.placa || '—'}</p>
                            </div>
                            <div>
                                <p className="text-gray-400">Zona</p>
                                <p className="font-medium text-gray-900">{selected.zona || '—'}</p>
                            </div>
                            <div>
                                <p className="text-gray-400">Fecha de registro</p>
                                <p className="font-medium text-gray-900">{selected.fechaRegistro}</p>
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
                title="Eliminar carrito"
                size="sm"
            >
                <p className="text-sm text-gray-600 mb-6">
                    ¿Estás seguro de eliminar el carrito{' '}
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
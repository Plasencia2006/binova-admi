import { useState, useEffect, useMemo } from 'react'
import { Plus, Search, Eye, Pencil, Filter, RefreshCw } from 'lucide-react'
import { carritoService } from '../../services/carritoService'
import { zonaService } from '../../services/zonaService'
import Badge from '../../components/ui/Badge'
import Modal from '../../components/ui/Modal'
import CarritoForm from '../../components/carritos/CarritoForm'

function getEstadoBadge(estado) {
    // La API puede usar activo/inactivo u otros; mantenemos compatibilidad
    const map = {
        disponible: { label: 'Disponible', variant: 'success' },
        en_ruta: { label: 'En ruta', variant: 'info' },
        mantenimiento: { label: 'Mantenimiento', variant: 'warning' },
        inactivo: { label: 'Inactivo', variant: 'default' },
        activo: { label: 'Activo', variant: 'success' },
    }
    return map[estado] || { label: estado || '—', variant: 'default' }
}

export default function CarritosPage() {
    const [carritos, setCarritos] = useState([])
    const [zonas, setZonas] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [search, setSearch] = useState('')
    const [filtroEstado, setFiltroEstado] = useState('todos')
    const [modalOpen, setModalOpen] = useState(false)
    const [modalMode, setModalMode] = useState('create')
    const [selected, setSelected] = useState(null)
    const [saving, setSaving] = useState(false)

    const load = async () => {
        setLoading(true)
        setError('')
        try {
            const [list, zs] = await Promise.all([
                carritoService.getAll(),
                zonaService.getAll().catch(() => []),
            ])
            setCarritos(list)
            setZonas(zs)
        } catch (err) {
            setError(
                err.response?.data?.message ||
                err.response?.data?.error ||
                'Error al cargar carritos'
            )
            setCarritos([])
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        load()
    }, [])

    const filtered = useMemo(() => {
        const q = search.toLowerCase()
        return carritos.filter((c) => {
            const matchSearch =
                (c.codigo || '').toLowerCase().includes(q) ||
                (c.nombre || '').toLowerCase().includes(q) ||
                (c.placa || '').toLowerCase().includes(q) ||
                (c.zona?.nombre || c.zona || '').toString().toLowerCase().includes(q)

            const estado = c.estado || (c.activo === false ? 'inactivo' : 'activo')
            const matchEstado = filtroEstado === 'todos' || estado === filtroEstado
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

    const handleSubmit = async (data) => {
        setSaving(true)
        try {
            // Body según API: codigo, placa, capacidad, zona (o zona_id)
            const payload = {
                codigo: data.codigo,
                placa: data.placa || undefined,
                capacidad: Number(data.capacidad),
            }
            if (data.zona_id) payload.zona_id = Number(data.zona_id)
            if (data.zona && !data.zona_id) payload.zona = data.zona

            if (modalMode === 'create') {
                await carritoService.create(payload)
            } else if (modalMode === 'edit' && selected?.id) {
                await carritoService.update(selected.id, payload)
            }
            setModalOpen(false)
            await load()
        } catch (err) {
            alert(
                err.response?.data?.message ||
                err.response?.data?.error ||
                'Error al guardar el carrito'
            )
        } finally {
            setSaving(false)
        }
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
                <div className="flex gap-2">
                    <button
                        onClick={load}
                        className="inline-flex items-center gap-2 px-3 py-2.5 border border-gray-200 rounded-xl text-sm hover:bg-gray-50 transition-colors"
                        title="Actualizar"
                    >
                        <RefreshCw size={16} />
                    </button>
                    <button
                        onClick={openCreate}
                        className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#6EA838] hover:bg-[#5a8f2e] text-white text-sm font-medium rounded-xl transition-colors shadow-sm"
                    >
                        <Plus size={18} />
                        Registrar carrito
                    </button>
                </div>
            </div>

            {/* Filtros */}
            <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                        <Search
                            size={18}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                        />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Buscar por código, placa o zona..."
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#6EA838] focus:border-transparent"
                        />
                    </div>
                    <div className="relative">
                        <Filter
                            size={16}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                        />
                        <select
                            value={filtroEstado}
                            onChange={(e) => setFiltroEstado(e.target.value)}
                            className="pl-9 pr-8 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#6EA838] appearance-none bg-white min-w-[170px]"
                        >
                            <option value="todos">Todos los estados</option>
                            <option value="activo">Activo</option>
                            <option value="disponible">Disponible</option>
                            <option value="en_ruta">En ruta</option>
                            <option value="mantenimiento">Mantenimiento</option>
                            <option value="inactivo">Inactivo</option>
                        </select>
                    </div>
                </div>
            </div>

            {error && (
                <div className="p-3 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl">
                    {error}
                </div>
            )}

            {/* Tabla */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100">
                                <th className="text-left px-4 py-3 font-semibold text-gray-600">Código</th>
                                <th className="text-left px-4 py-3 font-semibold text-gray-600">Placa</th>
                                <th className="text-left px-4 py-3 font-semibold text-gray-600 hidden md:table-cell">
                                    Capacidad
                                </th>
                                <th className="text-left px-4 py-3 font-semibold text-gray-600 hidden lg:table-cell">
                                    Zona
                                </th>
                                <th className="text-left px-4 py-3 font-semibold text-gray-600">Estado</th>
                                <th className="text-right px-4 py-3 font-semibold text-gray-600">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="px-4 py-12 text-center text-gray-400">
                                        Cargando...
                                    </td>
                                </tr>
                            ) : filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-4 py-12 text-center text-gray-400">
                                        No se encontraron carritos
                                    </td>
                                </tr>
                            ) : (
                                filtered.map((carrito) => {
                                    const estado =
                                        carrito.estado ||
                                        (carrito.activo === false ? 'inactivo' : 'activo')
                                    const badge = getEstadoBadge(estado)
                                    const zonaLabel =
                                        carrito.zona?.nombre || carrito.zona || '—'

                                    return (
                                        <tr
                                            key={carrito.id}
                                            className="hover:bg-gray-50/80 transition-colors"
                                        >
                                            <td className="px-4 py-3 font-medium text-gray-900">
                                                {carrito.codigo}
                                            </td>
                                            <td className="px-4 py-3 text-gray-700">
                                                {carrito.placa || '—'}
                                            </td>
                                            <td className="px-4 py-3 text-gray-500 hidden md:table-cell">
                                                {carrito.capacidad != null ? `${carrito.capacidad} L` : '—'}
                                            </td>
                                            <td className="px-4 py-3 text-gray-500 hidden lg:table-cell">
                                                {zonaLabel}
                                            </td>
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
                onClose={() => !saving && setModalOpen(false)}
                title={modalMode === 'create' ? 'Registrar carrito' : 'Editar carrito'}
                size="lg"
            >
                <CarritoForm
                    carrito={modalMode === 'edit' ? selected : null}
                    zonas={zonas}
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
                                <Badge
                                    variant={
                                        getEstadoBadge(
                                            selected.estado ||
                                            (selected.activo === false ? 'inactivo' : 'activo')
                                        ).variant
                                    }
                                >
                                    {
                                        getEstadoBadge(
                                            selected.estado ||
                                            (selected.activo === false ? 'inactivo' : 'activo')
                                        ).label
                                    }
                                </Badge>
                            </div>
                            <div>
                                <p className="text-gray-400">Placa</p>
                                <p className="font-medium text-gray-900">{selected.placa || '—'}</p>
                            </div>
                            <div>
                                <p className="text-gray-400">Capacidad</p>
                                <p className="font-medium text-gray-900">
                                    {selected.capacidad != null ? `${selected.capacidad} L` : '—'}
                                </p>
                            </div>
                            <div className="col-span-2">
                                <p className="text-gray-400">Zona</p>
                                <p className="font-medium text-gray-900">
                                    {selected.zona?.nombre || selected.zona || '—'}
                                </p>
                            </div>
                            {(selected.ult_lat != null || selected.ult_lng != null) && (
                                <div className="col-span-2">
                                    <p className="text-gray-400">Última posición</p>
                                    <p className="font-medium text-gray-900 text-xs">
                                        {selected.ult_lat ?? '—'}, {selected.ult_lng ?? '—'}
                                    </p>
                                </div>
                            )}
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
        </div>
    )
}
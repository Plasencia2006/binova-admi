import { useState, useEffect, useMemo } from 'react'
import { Plus, Search, Eye, Pencil, Filter, RefreshCw } from 'lucide-react'
import { contenedorService } from '../../services/contenedorService'
import { zonaService } from '../../services/zonaService'
import Badge from '../../components/ui/Badge'
import Modal from '../../components/ui/Modal'
import TachoForm from '../../components/tachos/TachoForm'

function estadoFill(estado) {
    // estado de llenado: verde | ambar | rojo (API)
    const map = {
        verde: { label: 'Verde', variant: 'success' },
        ambar: { label: 'Ámbar', variant: 'warning' },
        rojo: { label: 'Rojo', variant: 'danger' },
    }
    return map[estado] || { label: estado || '—', variant: 'default' }
}

function nivelColor(nivel) {
    if (nivel >= 80) return 'bg-red-500'
    if (nivel >= 50) return 'bg-amber-400'
    return 'bg-emerald-500'
}

export default function TachosPage() {
    const [items, setItems] = useState([])
    const [zonas, setZonas] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [search, setSearch] = useState('')
    const [filtroEstado, setFiltroEstado] = useState('todos')
    const [modalOpen, setModalOpen] = useState(false)
    const [modalMode, setModalMode] = useState('create')
    const [selected, setSelected] = useState(null)
    const [tokenInfo, setTokenInfo] = useState(null)
    const [saving, setSaving] = useState(false)

    const load = async () => {
        setLoading(true)
        setError('')
        try {
            const params = {}
            if (filtroEstado !== 'todos') params.estado = filtroEstado
            const [list, zs] = await Promise.all([
                contenedorService.getAll(params),
                zonaService.getAll().catch(() => []),
            ])
            setItems(list)
            setZonas(zs)
        } catch (err) {
            setError(err.response?.data?.message || 'Error al cargar contenedores')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        load()
    }, [filtroEstado])

    const filtered = useMemo(() => {
        const q = search.toLowerCase()
        return items.filter(
            (t) =>
                (t.codigo || '').toLowerCase().includes(q) ||
                (t.nombre || '').toLowerCase().includes(q)
        )
    }, [items, search])

    const openCreate = () => {
        setSelected(null)
        setModalMode('create')
        setModalOpen(true)
    }

    const openEdit = (t) => {
        setSelected(t)
        setModalMode('edit')
        setModalOpen(true)
    }

    const openView = (t) => {
        setSelected(t)
        setModalMode('view')
        setModalOpen(true)
    }

    const handleSubmit = async (payload) => {
        setSaving(true)
        try {
            if (modalMode === 'create') {
                const data = await contenedorService.create(payload)
                // token de dispositivo si la API lo devuelve
                const token = data.token || data.dispositivo_token || data.contenedor?.token
                if (token) {
                    setTokenInfo({ codigo: payload.codigo, token })
                }
            } else {
                await contenedorService.update(selected.id, payload)
            }
            setModalOpen(false)
            await load()
        } catch (err) {
            alert(err.response?.data?.message || 'Error al guardar')
        } finally {
            setSaving(false)
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Contenedores</h1>
                    <p className="text-sm text-gray-500 mt-1">Gestión de bins y sensores IoT</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={load}
                        className="inline-flex items-center gap-2 px-3 py-2.5 border border-gray-200 rounded-xl text-sm hover:bg-gray-50"
                    >
                        <RefreshCw size={16} />
                    </button>
                    <button
                        onClick={openCreate}
                        className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#6EA838] hover:bg-[#5a8f2e] text-white text-sm font-medium rounded-xl"
                    >
                        <Plus size={18} />
                        Registrar
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Buscar código o nombre..."
                        className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#6EA838]"
                    />
                </div>
                <div className="relative">
                    <Filter size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <select
                        value={filtroEstado}
                        onChange={(e) => setFiltroEstado(e.target.value)}
                        className="pl-8 pr-8 py-2.5 border border-gray-200 rounded-xl text-sm bg-white"
                    >
                        <option value="todos">Todos</option>
                        <option value="verde">Verde</option>
                        <option value="ambar">Ámbar</option>
                        <option value="rojo">Rojo</option>
                    </select>
                </div>
            </div>

            {error && (
                <div className="p-3 bg-red-50 text-red-600 text-sm rounded-xl">{error}</div>
            )}

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100">
                                <th className="text-left px-4 py-3 font-semibold text-gray-600">Código</th>
                                <th className="text-left px-4 py-3 font-semibold text-gray-600">Nombre</th>
                                <th className="text-left px-4 py-3 font-semibold text-gray-600">Nivel</th>
                                <th className="text-left px-4 py-3 font-semibold text-gray-600">Estado</th>
                                <th className="text-right px-4 py-3 font-semibold text-gray-600">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="px-4 py-10 text-center text-gray-400">
                                        Cargando...
                                    </td>
                                </tr>
                            ) : filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-4 py-10 text-center text-gray-400">
                                        No hay contenedores
                                    </td>
                                </tr>
                            ) : (
                                filtered.map((t) => {
                                    const nivel = t.nivel_actual ?? t.nivel ?? 0
                                    const badge = estadoFill(t.estado)
                                    return (
                                        <tr key={t.id} className="hover:bg-gray-50/80">
                                            <td className="px-4 py-3 font-medium text-gray-900">{t.codigo}</td>
                                            <td className="px-4 py-3 text-gray-700 max-w-[180px] truncate">
                                                {t.nombre}
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-2 min-w-[90px]">
                                                    <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                                        <div
                                                            className={`h-full rounded-full ${nivelColor(nivel)}`}
                                                            style={{ width: `${Math.min(nivel, 100)}%` }}
                                                        />
                                                    </div>
                                                    <span className="text-xs text-gray-500 w-8">{nivel}%</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <Badge variant={badge.variant}>{badge.label}</Badge>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex justify-end gap-1">
                                                    <button
                                                        onClick={() => openView(t)}
                                                        className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50"
                                                    >
                                                        <Eye size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => openEdit(t)}
                                                        className="p-1.5 rounded-lg text-gray-400 hover:text-[#6EA838] hover:bg-green-50"
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
                    {filtered.length} contenedor(es)
                </div>
            </div>

            <Modal
                isOpen={modalOpen && modalMode !== 'view'}
                onClose={() => !saving && setModalOpen(false)}
                title={modalMode === 'create' ? 'Registrar contenedor' : 'Editar contenedor'}
                size="lg"
            >
                <TachoForm
                    tacho={modalMode === 'edit' ? selected : null}
                    zonas={zonas}
                    onSubmit={handleSubmit}
                    onCancel={() => setModalOpen(false)}
                />
            </Modal>

            <Modal
                isOpen={modalOpen && modalMode === 'view'}
                onClose={() => setModalOpen(false)}
                title="Detalle del contenedor"
            >
                {selected && (
                    <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                            <p className="text-gray-400">Código</p>
                            <p className="font-medium">{selected.codigo}</p>
                        </div>
                        <div>
                            <p className="text-gray-400">Estado</p>
                            <Badge variant={estadoFill(selected.estado).variant}>
                                {estadoFill(selected.estado).label}
                            </Badge>
                        </div>
                        <div className="col-span-2">
                            <p className="text-gray-400">Nombre</p>
                            <p className="font-medium">{selected.nombre}</p>
                        </div>
                        <div>
                            <p className="text-gray-400">Nivel</p>
                            <p className="font-medium">{selected.nivel_actual ?? selected.nivel ?? 0}%</p>
                        </div>
                        <div>
                            <p className="text-gray-400">Altura sensor</p>
                            <p className="font-medium">{selected.altura_cm ?? '—'} cm</p>
                        </div>
                        <div>
                            <p className="text-gray-400">Lat / Lng</p>
                            <p className="font-medium text-xs">
                                {selected.lat ?? selected.latitud ?? '—'}, {selected.lng ?? selected.longitud ?? '—'}
                            </p>
                        </div>
                        <div>
                            <p className="text-gray-400">Device ID</p>
                            <p className="font-medium font-mono text-xs">{selected.device_id || '—'}</p>
                        </div>
                        <div className="col-span-2 flex justify-end pt-2">
                            <button
                                onClick={() => setModalOpen(false)}
                                className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg"
                            >
                                Cerrar
                            </button>
                        </div>
                    </div>
                )}
            </Modal>

            <Modal isOpen={!!tokenInfo} onClose={() => setTokenInfo(null)} title="Token de dispositivo" size="sm">
                {tokenInfo && (
                    <div className="space-y-3 text-sm">
                        <p className="text-gray-600">
                            Contenedor <strong>{tokenInfo.codigo}</strong> creado. Guarda este token para el ESP32
                            (solo se muestra una vez):
                        </p>
                        <code className="block p-3 bg-amber-50 border border-amber-100 rounded-lg text-xs break-all font-mono">
                            {tokenInfo.token}
                        </code>
                        <button
                            onClick={() => setTokenInfo(null)}
                            className="w-full py-2 bg-[#6EA838] text-white rounded-lg text-sm"
                        >
                            Entendido
                        </button>
                    </div>
                )}
            </Modal>
        </div>
    )
}
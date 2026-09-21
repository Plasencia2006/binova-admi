import { useEffect, useState, useMemo } from 'react'
import { Search, Check, Ban, RefreshCw, Copy, X } from 'lucide-react'
import { organizacionService } from '../../services/organizacionService'
import Badge from '../../components/ui/Badge'
import Modal from '../../components/ui/Modal'

function estadoBadge(estado) {
    const map = {
        pendiente: { label: 'Pendiente', variant: 'warning' },
        activa: { label: 'Activa', variant: 'success' },
        suspendida: { label: 'Suspendida', variant: 'danger' },
        rechazada: { label: 'Rechazada', variant: 'default' },
    }
    return map[estado] || { label: estado, variant: 'default' }
}

export default function OrganizacionesPage() {
    const [orgs, setOrgs] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [search, setSearch] = useState('')
    const [filtro, setFiltro] = useState('todos')
    const [actionLoading, setActionLoading] = useState(null)

    // Modal clave temporal al aprobar
    const [claveModal, setClaveModal] = useState(null)

    const load = async () => {
        setLoading(true)
        setError('')
        try {
            const params = filtro !== 'todos' ? { estado: filtro } : {}
            const data = await organizacionService.listar(params)
            const list = Array.isArray(data) ? data : data.data || data.organizaciones || []
            setOrgs(list)
        } catch (err) {
            setError(
                err.response?.data?.message ||
                'No se pudieron cargar las organizaciones'
            )
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        load()
    }, [filtro])

    const filtered = useMemo(() => {
        if (!search.trim()) return orgs
        const q = search.toLowerCase()
        return orgs.filter(
            (o) =>
                (o.nombre || '').toLowerCase().includes(q) ||
                (o.contacto_correo || '').toLowerCase().includes(q) ||
                (o.contacto_nombre || '').toLowerCase().includes(q)
        )
    }, [orgs, search])

    const aprobar = async (org) => {
        setActionLoading(org.id)
        try {
            const data = await organizacionService.aprobar(org.id)
            // La API devuelve admin.clave_temporal una sola vez
            const clave =
                data?.admin?.clave_temporal ||
                data?.clave_temporal ||
                data?.admin_clave_temporal
            if (clave) {
                setClaveModal({
                    org: org.nombre,
                    correo: data?.admin?.correo || org.contacto_correo,
                    clave,
                })
            }
            await load()
        } catch (err) {
            alert(err.response?.data?.message || 'Error al aprobar')
        } finally {
            setActionLoading(null)
        }
    }

    const cambiarEstado = async (org, estado) => {
        setActionLoading(org.id)
        try {
            await organizacionService.cambiarEstado(org.id, estado)
            await load()
        } catch (err) {
            alert(err.response?.data?.message || 'Error al cambiar estado')
        } finally {
            setActionLoading(null)
        }
    }

    const copyClave = () => {
        if (claveModal?.clave) {
            navigator.clipboard.writeText(claveModal.clave)
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Organizaciones</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Solicitudes de empresa y gestión de estado
                    </p>
                </div>
                <button
                    onClick={load}
                    className="inline-flex items-center gap-2 px-3 py-2 text-sm border border-gray-200 rounded-xl hover:bg-gray-50"
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
                        placeholder="Buscar por nombre o correo..."
                        className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#6EA838]"
                    />
                </div>
                <select
                    value={filtro}
                    onChange={(e) => setFiltro(e.target.value)}
                    className="px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#6EA838]"
                >
                    <option value="todos">Todos</option>
                    <option value="pendiente">Pendiente</option>
                    <option value="activa">Activa</option>
                    <option value="suspendida">Suspendida</option>
                    <option value="rechazada">Rechazada</option>
                </select>
            </div>

            {error && (
                <div className="p-3 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100">
                    {error}
                </div>
            )}

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100">
                                <th className="text-left px-4 py-3 font-semibold text-gray-600">Nombre</th>
                                <th className="text-left px-4 py-3 font-semibold text-gray-600 hidden md:table-cell">Contacto</th>
                                <th className="text-left px-4 py-3 font-semibold text-gray-600">Tipo</th>
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
                                        No hay organizaciones
                                    </td>
                                </tr>
                            ) : (
                                filtered.map((org) => {
                                    const badge = estadoBadge(org.estado)
                                    const busy = actionLoading === org.id
                                    return (
                                        <tr key={org.id} className="hover:bg-gray-50/80">
                                            <td className="px-4 py-3">
                                                <p className="font-medium text-gray-900">{org.nombre}</p>
                                                {org.mensaje && (
                                                    <p className="text-xs text-gray-400 truncate max-w-[200px]">
                                                        {org.mensaje}
                                                    </p>
                                                )}
                                            </td>
                                            <td className="px-4 py-3 hidden md:table-cell">
                                                <p className="text-gray-700">{org.contacto_nombre || '—'}</p>
                                                <p className="text-xs text-gray-400">{org.contacto_correo || ''}</p>
                                            </td>
                                            <td className="px-4 py-3 text-gray-500 capitalize">
                                                {org.tipo || '—'}
                                            </td>
                                            <td className="px-4 py-3">
                                                <Badge variant={badge.variant}>{badge.label}</Badge>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex justify-end gap-1">
                                                    {org.estado === 'pendiente' && org.tipo === 'empresa' && (
                                                        <>
                                                            <button
                                                                disabled={busy}
                                                                onClick={() => aprobar(org)}
                                                                className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 disabled:opacity-50"
                                                                title="Aprobar"
                                                            >
                                                                <Check size={16} />
                                                            </button>
                                                            <button
                                                                disabled={busy}
                                                                onClick={() => cambiarEstado(org, 'rechazada')}
                                                                className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 disabled:opacity-50"
                                                                title="Rechazar"
                                                            >
                                                                <X size={16} />
                                                            </button>
                                                        </>
                                                    )}
                                                    {org.estado === 'activa' && (
                                                        <button
                                                            disabled={busy}
                                                            onClick={() => cambiarEstado(org, 'suspendida')}
                                                            className="p-1.5 rounded-lg text-amber-600 hover:bg-amber-50 disabled:opacity-50"
                                                            title="Suspender"
                                                        >
                                                            <Ban size={16} />
                                                        </button>
                                                    )}
                                                    {org.estado === 'suspendida' && (
                                                        <button
                                                            disabled={busy}
                                                            onClick={() => cambiarEstado(org, 'activa')}
                                                            className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 disabled:opacity-50"
                                                            title="Reactivar"
                                                        >
                                                            <RefreshCw size={16} />
                                                        </button>
                                                    )}
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
                    {filtered.length} organización(es)
                </div>
            </div>

            {/* Modal clave temporal */}
            <Modal
                isOpen={!!claveModal}
                onClose={() => setClaveModal(null)}
                title="Organización aprobada"
                size="sm"
            >
                {claveModal && (
                    <div className="space-y-4 text-sm">
                        <p className="text-gray-600">
                            Se creó el usuario admin para <strong>{claveModal.org}</strong>.
                        </p>
                        <p className="text-gray-600">
                            Correo: <strong>{claveModal.correo}</strong>
                        </p>
                        <div className="p-3 bg-amber-50 border border-amber-100 rounded-xl">
                            <p className="text-xs text-amber-700 mb-1 font-medium">
                                Clave temporal (solo se muestra una vez)
                            </p>
                            <div className="flex items-center gap-2">
                                <code className="flex-1 text-sm font-mono text-gray-900 break-all">
                                    {claveModal.clave}
                                </code>
                                <button
                                    onClick={copyClave}
                                    className="p-2 rounded-lg hover:bg-amber-100 text-amber-700"
                                    title="Copiar"
                                >
                                    <Copy size={16} />
                                </button>
                            </div>
                        </div>
                        <p className="text-xs text-gray-400">
                            Guárdala y envíasela al contacto. No se volverá a mostrar.
                        </p>
                        <div className="flex justify-end">
                            <button
                                onClick={() => setClaveModal(null)}
                                className="px-4 py-2 bg-[#6EA838] text-white text-sm rounded-lg hover:bg-[#5a8f2e]"
                            >
                                Entendido
                            </button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    )
}
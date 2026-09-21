import { useEffect, useState } from 'react'
import { Plus, RefreshCw, CheckCircle } from 'lucide-react'
import { incidenciaService } from '../../services/incidenciaService'
import { contenedorService } from '../../services/contenedorService'
import { useAuth } from '../../context/AuthContext'
import Badge from '../../components/ui/Badge'
import Modal from '../../components/ui/Modal'

const TIPOS = [
    { value: 'tapa_danada', label: 'Tapa dañada' },
    { value: 'sensor_sucio', label: 'Sensor sucio' },
    { value: 'acceso_bloqueado', label: 'Acceso bloqueado' },
    { value: 'otro', label: 'Otro' },
]

export default function IncidenciasPage() {
    const { rol } = useAuth()
    const puedeResolver = rol === 'admin' || rol === 'supervisor'
    const puedeReportar = ['admin', 'supervisor', 'operario', 'empleado'].includes(rol)

    const [items, setItems] = useState([])
    const [contenedores, setContenedores] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [modalOpen, setModalOpen] = useState(false)
    const [form, setForm] = useState({
        tipo: 'otro',
        contenedor_id: '',
        descripcion: '',
    })
    const [saving, setSaving] = useState(false)

    // Particular no tiene acceso a incidencias en la API
    if (rol === 'particular') {
        return (
            <div className="max-w-md mx-auto mt-10 bg-white rounded-2xl border border-gray-100 p-8 text-center shadow-sm">
                <h1 className="text-xl font-bold text-gray-900 mb-2">Incidencias</h1>
                <p className="text-sm text-gray-500 leading-relaxed">
                    Las incidencias están disponibles para empleados y personal de operación.
                    Como <strong>particular</strong> puedes gestionar y vincular tus contenedores
                    desde el menú Contenedores.
                </p>
            </div>
        )
    }

    const load = async () => {
        setLoading(true)
        setError('')
        try {
            const [list, cont] = await Promise.all([
                incidenciaService.getAll(),
                contenedorService.getAll().catch(() => []),
            ])
            setItems(list)
            setContenedores(cont)
        } catch (err) {
            const status = err.response?.status
            if (status === 403) {
                setError('No tienes permiso para ver incidencias con tu rol actual.')
            } else {
                setError(err.response?.data?.message || 'Error al cargar incidencias')
            }
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (rol !== 'particular') {
            load()
        }
    }, [rol])

    const handleCreate = async (e) => {
        e.preventDefault()
        setSaving(true)
        try {
            const payload = {
                tipo: form.tipo,
                descripcion: form.descripcion.trim() || undefined,
            }
            if (form.contenedor_id) payload.contenedor_id = Number(form.contenedor_id)
            await incidenciaService.crear(payload)
            setModalOpen(false)
            setForm({ tipo: 'otro', contenedor_id: '', descripcion: '' })
            await load()
        } catch (err) {
            alert(err.response?.data?.message || 'Error al reportar')
        } finally {
            setSaving(false)
        }
    }

    const resolver = async (id) => {
        try {
            await incidenciaService.resolver(id)
            await load()
        } catch (err) {
            alert(err.response?.data?.message || 'Error al resolver')
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Incidencias</h1>
                    <p className="text-sm text-gray-500 mt-1">Reportes manuales de campo</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={load}
                        className="inline-flex items-center gap-2 px-3 py-2.5 border border-gray-200 rounded-xl text-sm hover:bg-gray-50"
                    >
                        <RefreshCw size={16} />
                    </button>
                    {puedeReportar && (
                        <button
                            onClick={() => setModalOpen(true)}
                            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#6EA838] hover:bg-[#5a8f2e] text-white text-sm font-medium rounded-xl"
                        >
                            <Plus size={18} />
                            Reportar
                        </button>
                    )}
                </div>
            </div>

            {error && (
                <div className="p-3 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100">
                    {error}
                </div>
            )}

            <div className="space-y-3">
                {loading ? (
                    <p className="text-center text-gray-400 py-10 text-sm">Cargando...</p>
                ) : items.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center text-gray-400">
                        No hay incidencias
                    </div>
                ) : (
                    items.map((inc) => {
                        const resuelta = !!(inc.resuelta_en || inc.estado === 'resuelta')
                        const tipoLabel = TIPOS.find((t) => t.value === inc.tipo)?.label || inc.tipo
                        return (
                            <div
                                key={inc.id}
                                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-col sm:flex-row sm:items-center gap-3"
                            >
                                <div className="flex-1 min-w-0">
                                    <div className="flex flex-wrap items-center gap-2 mb-1">
                                        <span className="font-medium text-gray-900">{tipoLabel}</span>
                                        <Badge variant={resuelta ? 'success' : 'warning'}>
                                            {resuelta ? 'Resuelta' : 'Abierta'}
                                        </Badge>
                                    </div>
                                    <p className="text-xs text-gray-400">
                                        {inc.contenedor?.codigo || inc.contenedor_id
                                            ? `Contenedor: ${inc.contenedor?.codigo || inc.contenedor_id}`
                                            : 'Sin contenedor'}
                                        {inc.descripcion ? ` · ${inc.descripcion}` : ''}
                                    </p>
                                </div>
                                {puedeResolver && !resuelta && (
                                    <button
                                        onClick={() => resolver(inc.id)}
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-gray-800 text-white hover:bg-gray-900"
                                    >
                                        <CheckCircle size={14} />
                                        Resolver
                                    </button>
                                )}
                            </div>
                        )
                    })
                )}
            </div>

            <Modal
                isOpen={modalOpen}
                onClose={() => !saving && setModalOpen(false)}
                title="Reportar incidencia"
            >
                <form onSubmit={handleCreate} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                        <select
                            value={form.tipo}
                            onChange={(e) => setForm((p) => ({ ...p, tipo: e.target.value }))}
                            className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm"
                        >
                            {TIPOS.map((t) => (
                                <option key={t.value} value={t.value}>
                                    {t.label}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Contenedor</label>
                        <select
                            value={form.contenedor_id}
                            onChange={(e) => setForm((p) => ({ ...p, contenedor_id: e.target.value }))}
                            className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm"
                        >
                            <option value="">Opcional</option>
                            {contenedores.map((c) => (
                                <option key={c.id} value={c.id}>
                                    {c.codigo} — {c.nombre}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                        <textarea
                            value={form.descripcion}
                            onChange={(e) => setForm((p) => ({ ...p, descripcion: e.target.value }))}
                            rows={3}
                            className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm resize-none"
                            placeholder="Detalle del problema..."
                        />
                    </div>
                    <div className="flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={() => setModalOpen(false)}
                            className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={saving}
                            className="px-4 py-2 text-sm text-white bg-[#6EA838] rounded-lg disabled:opacity-60"
                        >
                            {saving ? 'Enviando...' : 'Reportar'}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    )
}
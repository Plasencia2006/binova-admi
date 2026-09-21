import { useEffect, useState } from 'react'
import { Play, Square, MapPin, RefreshCw } from 'lucide-react'
import { turnoService } from '../../services/turnoService'
import { recoleccionService } from '../../services/recoleccionService'
import { contenedorService } from '../../services/contenedorService'
import { useAuth } from '../../context/AuthContext'

export default function TurnoPage() {
    const { rol } = useAuth()
    const [turno, setTurno] = useState(null)
    const [codigo, setCodigo] = useState('')
    const [loading, setLoading] = useState(true)
    const [busy, setBusy] = useState(false)
    const [error, setError] = useState('')
    const [msg, setMsg] = useState('')

    // Vaciar contenedor
    const [contenedores, setContenedores] = useState([])
    const [contenedorId, setContenedorId] = useState('')
    const [vaciarBusy, setVaciarBusy] = useState(false)

    const load = async () => {
        setLoading(true)
        setError('')
        try {
            const t = await turnoService.actual()
            setTurno(t && t.id ? t : t || null)
            if (t?.id) {
                const list = await contenedorService.getAll().catch(() => [])
                setContenedores(list)
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Error al cargar turno')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        load()
    }, [])

    const abrir = async (e) => {
        e.preventDefault()
        if (!codigo.trim()) return
        setBusy(true)
        setError('')
        setMsg('')
        try {
            const t = await turnoService.abrir(codigo.trim())
            setTurno(t)
            setCodigo('')
            setMsg('Turno abierto correctamente')
            const list = await contenedorService.getAll().catch(() => [])
            setContenedores(list)
        } catch (err) {
            setError(err.response?.data?.message || 'No se pudo abrir el turno')
        } finally {
            setBusy(false)
        }
    }

    const cerrar = async () => {
        if (!turno?.id) return
        setBusy(true)
        setError('')
        try {
            await turnoService.cerrar(turno.id)
            setTurno(null)
            setMsg('Turno cerrado')
        } catch (err) {
            setError(err.response?.data?.message || 'No se pudo cerrar el turno')
        } finally {
            setBusy(false)
        }
    }

    const vaciar = async (e) => {
        e.preventDefault()
        if (!contenedorId) return
        setVaciarBusy(true)
        setError('')
        setMsg('')
        try {
            await recoleccionService.crear({
                contenedor_id: Number(contenedorId),
            })
            setMsg('Recolección registrada · contenedor en nivel 0')
            setContenedorId('')
        } catch (err) {
            setError(err.response?.data?.message || 'Error al registrar recolección')
        } finally {
            setVaciarBusy(false)
        }
    }

    if (rol && rol !== 'operario' && rol !== 'admin' && rol !== 'supervisor') {
        return (
            <div className="p-6 text-sm text-gray-500">
                Esta sección es para operarios (y consulta de admin/supervisor).
            </div>
        )
    }

    return (
        <div className="space-y-6 max-w-xl">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Turno de campo</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Abrir turno con código de carrito y registrar vaciados
                    </p>
                </div>
                <button
                    onClick={load}
                    className="p-2 border border-gray-200 rounded-xl hover:bg-gray-50"
                >
                    <RefreshCw size={16} />
                </button>
            </div>

            {error && (
                <div className="p-3 bg-red-50 text-red-600 text-sm rounded-xl">{error}</div>
            )}
            {msg && (
                <div className="p-3 bg-emerald-50 text-emerald-700 text-sm rounded-xl">{msg}</div>
            )}

            {loading ? (
                <p className="text-sm text-gray-400">Cargando...</p>
            ) : turno?.id ? (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
                    <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-sm font-semibold text-emerald-700">Turno abierto</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                            <p className="text-gray-400">ID turno</p>
                            <p className="font-medium">{turno.id}</p>
                        </div>
                        <div>
                            <p className="text-gray-400">Carrito</p>
                            <p className="font-medium">
                                {turno.carrito?.codigo || turno.carrito_codigo || turno.carrito_id || '—'}
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={cerrar}
                        disabled={busy}
                        className="w-full inline-flex items-center justify-center gap-2 py-2.5 bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded-xl disabled:opacity-60"
                    >
                        <Square size={16} />
                        {busy ? 'Cerrando...' : 'Cerrar turno'}
                    </button>

                    {/* Registrar vaciado */}
                    <div className="pt-4 border-t border-gray-100">
                        <h2 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                            <MapPin size={16} className="text-[#6EA838]" />
                            Registrar recolección
                        </h2>
                        <form onSubmit={vaciar} className="space-y-3">
                            <select
                                value={contenedorId}
                                onChange={(e) => setContenedorId(e.target.value)}
                                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm"
                                required
                            >
                                <option value="">Seleccionar contenedor...</option>
                                {contenedores.map((c) => (
                                    <option key={c.id} value={c.id}>
                                        {c.codigo} — {c.nombre} ({c.nivel_actual ?? c.nivel ?? 0}%)
                                    </option>
                                ))}
                            </select>
                            <button
                                type="submit"
                                disabled={vaciarBusy || !contenedorId}
                                className="w-full py-2.5 bg-[#6EA838] hover:bg-[#5a8f2e] text-white text-sm font-medium rounded-xl disabled:opacity-60"
                            >
                                {vaciarBusy ? 'Registrando...' : 'Registrar vaciado'}
                            </button>
                        </form>
                    </div>
                </div>
            ) : (
                <form
                    onSubmit={abrir}
                    className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4"
                >
                    <p className="text-sm text-gray-500">
                        Ingresa el <strong>código del carrito</strong> para iniciar el turno (1 usuario · 1
                        carrito).
                    </p>
                    <input
                        value={codigo}
                        onChange={(e) => setCodigo(e.target.value)}
                        placeholder="Ej. CR-001"
                        className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#6EA838]"
                        required
                    />
                    <button
                        type="submit"
                        disabled={busy}
                        className="w-full inline-flex items-center justify-center gap-2 py-2.5 bg-[#6EA838] hover:bg-[#5a8f2e] text-white text-sm font-medium rounded-xl disabled:opacity-60"
                    >
                        <Play size={16} />
                        {busy ? 'Abriendo...' : 'Abrir turno'}
                    </button>
                </form>
            )}
        </div>
    )
}
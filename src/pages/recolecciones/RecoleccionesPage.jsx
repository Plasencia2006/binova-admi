import { useEffect, useState } from 'react'
import { RefreshCw, Search } from 'lucide-react'
import { recoleccionService } from '../../services/recoleccionService'

export default function RecoleccionesPage() {
    const [items, setItems] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [search, setSearch] = useState('')

    const load = async () => {
        setLoading(true)
        setError('')
        try {
            const list = await recoleccionService.getAll()
            setItems(list)
        } catch (err) {
            setError(err.response?.data?.message || 'Error al cargar recolecciones')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        load()
    }, [])

    const filtered = items.filter((r) => {
        const q = search.toLowerCase()
        const cod = r.contenedor?.codigo || r.contenedor_codigo || ''
        return cod.toLowerCase().includes(q) || String(r.id).includes(q)
    })

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Recolecciones</h1>
                    <p className="text-sm text-gray-500 mt-1">Historial de vaciados</p>
                </div>
                <button
                    onClick={load}
                    className="inline-flex items-center gap-2 px-3 py-2.5 border border-gray-200 rounded-xl text-sm hover:bg-gray-50"
                >
                    <RefreshCw size={16} />
                    Actualizar
                </button>
            </div>

            <div className="relative max-w-md">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Buscar por contenedor..."
                    className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#6EA838]"
                />
            </div>

            {error && (
                <div className="p-3 bg-red-50 text-red-600 text-sm rounded-xl">{error}</div>
            )}

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100">
                                <th className="text-left px-4 py-3 font-semibold text-gray-600">ID</th>
                                <th className="text-left px-4 py-3 font-semibold text-gray-600">Contenedor</th>
                                <th className="text-left px-4 py-3 font-semibold text-gray-600">Nivel antes</th>
                                <th className="text-left px-4 py-3 font-semibold text-gray-600">Fecha</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                <tr>
                                    <td colSpan={4} className="px-4 py-10 text-center text-gray-400">
                                        Cargando...
                                    </td>
                                </tr>
                            ) : filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-4 py-10 text-center text-gray-400">
                                        Sin recolecciones
                                    </td>
                                </tr>
                            ) : (
                                filtered.map((r) => (
                                    <tr key={r.id} className="hover:bg-gray-50/80">
                                        <td className="px-4 py-3 text-gray-500">{r.id}</td>
                                        <td className="px-4 py-3 font-medium text-gray-900">
                                            {r.contenedor?.codigo || r.contenedor_codigo || r.contenedor_id}
                                        </td>
                                        <td className="px-4 py-3">{r.nivel_antes ?? '—'}%</td>
                                        <td className="px-4 py-3 text-gray-500 text-xs">
                                            {r.creado_en || r.fecha || r.created_at || '—'}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
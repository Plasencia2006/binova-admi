import { useEffect, useMemo, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet'
import L from 'leaflet'
import { Search, Route, Layers, RefreshCw } from 'lucide-react'
import { contenedorService } from '../../services/contenedorService'
import { rutaService } from '../../services/rutaService'
import '../../utils/leafletIcon'

function createIcon(estado) {
    let color = '#6EA838'
    if (estado === 'rojo') color = '#EF4444'
    else if (estado === 'ambar') color = '#F59E0B'
    else if (estado === 'sin_lectura' || !estado) color = '#9CA3AF'

    return L.divIcon({
        className: '',
        html: `<div style="width:28px;height:28px;background:${color};border:3px solid white;border-radius:50% 50% 50% 0;transform:rotate(-45deg);box-shadow:0 2px 6px rgba(0,0,0,0.3);"></div>`,
        iconSize: [28, 28],
        iconAnchor: [14, 28],
        popupAnchor: [0, -28],
    })
}

function FitBounds({ points }) {
    const map = useMap()
    useEffect(() => {
        if (points.length > 0) {
            map.fitBounds(points, { padding: [40, 40], maxZoom: 16 })
        }
    }, [points, map])
    return null
}

export default function MapaPage() {
    const [contenedores, setContenedores] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [search, setSearch] = useState('')
    const [filtroEstado, setFiltroEstado] = useState('todos')
    const [ruta, setRuta] = useState(null)
    const [rutaLoading, setRutaLoading] = useState(false)

    const load = async () => {
        setLoading(true)
        setError('')
        try {
            const list = await contenedorService.getAll()
            setContenedores(list)
        } catch (err) {
            setError(err.response?.data?.message || 'Error al cargar mapa')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        load()
    }, [])

    const filtered = useMemo(() => {
        const q = search.toLowerCase()
        return contenedores.filter((c) => {
            const matchQ =
                (c.codigo || '').toLowerCase().includes(q) ||
                (c.nombre || '').toLowerCase().includes(q)
            const est = c.estado || ''
            const matchE = filtroEstado === 'todos' || est === filtroEstado
            return matchQ && matchE
        })
    }, [contenedores, search, filtroEstado])

    const conCoords = filtered.filter(
        (c) => c.lat != null || c.latitud != null
    )

    const positions = conCoords.map((c) => [
        Number(c.lat ?? c.latitud),
        Number(c.lng ?? c.longitud),
    ])

    const calcularRuta = async () => {
        setRutaLoading(true)
        setError('')
        try {
            const data = await rutaService.optima({
                estados: 'rojo,ambar',
                max: 20,
                perfil: 'driving',
            })
            setRuta(data)
        } catch (err) {
            setError(err.response?.data?.message || 'No se pudo calcular la ruta óptima')
            setRuta(null)
        } finally {
            setRutaLoading(false)
        }
    }

    // Polyline: intenta orden de la API
    const routeLine = useMemo(() => {
        if (!ruta) return []
        const pts =
            ruta.puntos ||
            ruta.coords ||
            ruta.ruta ||
            ruta.orden?.map((o) => [o.lat, o.lng]) ||
            []
        return pts
            .map((p) => {
                if (Array.isArray(p)) return p
                if (p.lat != null) return [Number(p.lat), Number(p.lng)]
                return null
            })
            .filter(Boolean)
    }, [ruta])

    const center = positions[0] || [-8.1116, -79.0288]

    return (
        <div className="space-y-4 h-[calc(100vh-8rem)] flex flex-col">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Mapa</h1>
                    <p className="text-sm text-gray-500">Contenedores y ruta óptima</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={load}
                        className="inline-flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-xl text-sm hover:bg-gray-50"
                    >
                        <RefreshCw size={16} />
                    </button>
                    <button
                        onClick={calcularRuta}
                        disabled={rutaLoading}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-[#6EA838] hover:bg-[#5a8f2e] text-white text-sm font-medium rounded-xl disabled:opacity-60"
                    >
                        <Route size={16} />
                        {rutaLoading ? 'Calculando...' : 'Ruta óptima'}
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-3 shadow-sm flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Buscar contenedor..."
                        className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#6EA838]"
                    />
                </div>
                <select
                    value={filtroEstado}
                    onChange={(e) => setFiltroEstado(e.target.value)}
                    className="px-3 py-2 border border-gray-200 rounded-xl text-sm bg-white"
                >
                    <option value="todos">Todos</option>
                    <option value="verde">Verde</option>
                    <option value="ambar">Ámbar</option>
                    <option value="rojo">Rojo</option>
                </select>
            </div>

            {error && (
                <div className="p-2 bg-amber-50 text-amber-800 text-sm rounded-xl">{error}</div>
            )}

            <div className="flex-1 rounded-2xl overflow-hidden border border-gray-200 shadow-sm relative min-h-[400px]">
                {loading ? (
                    <div className="h-full flex items-center justify-center text-gray-400 text-sm">
                        Cargando mapa...
                    </div>
                ) : (
                    <MapContainer center={center} zoom={15} className="h-full w-full" scrollWheelZoom>
                        <TileLayer
                            attribution='&copy; OpenStreetMap'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <FitBounds points={routeLine.length ? routeLine : positions} />
                        {conCoords.map((c) => {
                            const lat = Number(c.lat ?? c.latitud)
                            const lng = Number(c.lng ?? c.longitud)
                            return (
                                <Marker
                                    key={c.id}
                                    position={[lat, lng]}
                                    icon={createIcon(c.estado)}
                                >
                                    <Popup>
                                        <div className="text-sm min-w-[160px]">
                                            <p className="font-bold">{c.codigo}</p>
                                            <p className="text-gray-600">{c.nombre}</p>
                                            <p className="text-xs mt-1">
                                                Nivel: {c.nivel_actual ?? c.nivel ?? 0}% · {c.estado || '—'}
                                            </p>
                                        </div>
                                    </Popup>
                                </Marker>
                            )
                        })}
                        {routeLine.length > 1 && (
                            <Polyline positions={routeLine} pathOptions={{ color: '#6EA838', weight: 4 }} />
                        )}
                    </MapContainer>
                )}

                <div className="absolute bottom-4 left-4 z-[1000] bg-white/95 backdrop-blur-sm rounded-xl px-3 py-2 shadow-md text-xs text-gray-600 flex items-center gap-2">
                    <Layers size={14} className="text-[#6EA838]" />
                    {conCoords.length} en mapa
                    {routeLine.length > 0 && ` · Ruta: ${routeLine.length} puntos`}
                </div>
            </div>
        </div>
    )
}
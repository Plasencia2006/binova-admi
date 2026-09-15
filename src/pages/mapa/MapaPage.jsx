import { useMemo, useState } from 'react'
import { MapContainer, TileLayer, useMap } from 'react-leaflet'
import { tachosMock } from '../../data/tachos'
import TachoMarker from '../../components/mapa/TachoMarker'
import '../../utils/leafletIcon'
import { Search, Layers } from 'lucide-react'

// Centrar el mapa en los tachos disponibles
function FitBounds({ tachos }) {
    const map = useMap()
    const positions = tachos
        .filter((t) => t.latitud != null && t.longitud != null)
        .map((t) => [t.latitud, t.longitud])

    if (positions.length > 0) {
        map.fitBounds(positions, { padding: [40, 40], maxZoom: 16 })
    }
    return null
}

export default function MapaPage() {
    const [search, setSearch] = useState('')
    const [filtroEstado, setFiltroEstado] = useState('todos')
    const [filtroConexion, setFiltroConexion] = useState('todos')

    const filtered = useMemo(() => {
        return tachosMock.filter((t) => {
            const matchSearch =
                t.codigo.toLowerCase().includes(search.toLowerCase()) ||
                t.nombre.toLowerCase().includes(search.toLowerCase()) ||
                t.ubicacion.toLowerCase().includes(search.toLowerCase())

            const matchEstado = filtroEstado === 'todos' || t.estado === filtroEstado
            const matchConexion =
                filtroConexion === 'todos' || t.connectionStatus === filtroConexion

            return matchSearch && matchEstado && matchConexion
        })
    }, [search, filtroEstado, filtroConexion])

    const conCoordenadas = filtered.filter(
        (t) => t.latitud != null && t.longitud != null
    )

    // Centro por defecto (Trujillo / campus aproximado)
    const center = [-8.1116, -79.0288]

    return (
        <div className="space-y-4 h-[calc(100vh-8rem)] flex flex-col">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Mapa de tachos</h1>
                    <p className="text-sm text-gray-500 mt-0.5">
                        Ubicación en tiempo real de los contenedores
                    </p>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Bajo
                    </span>
                    <span className="flex items-center gap-1">
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span> Medio
                    </span>
                    <span className="flex items-center gap-1">
                        <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span> Crítico
                    </span>
                </div>
            </div>

            {/* Filtros */}
            <div className="bg-white rounded-2xl border border-gray-100 p-3 shadow-sm flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Buscar tacho..."
                        className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#6EA838]"
                    />
                </div>
                <select
                    value={filtroEstado}
                    onChange={(e) => setFiltroEstado(e.target.value)}
                    className="px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#6EA838] bg-white"
                >
                    <option value="todos">Todos los estados</option>
                    <option value="activo">Activo</option>
                    <option value="inactivo">Inactivo</option>
                    <option value="mantenimiento">Mantenimiento</option>
                </select>
                <select
                    value={filtroConexion}
                    onChange={(e) => setFiltroConexion(e.target.value)}
                    className="px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#6EA838] bg-white"
                >
                    <option value="todos">Toda conexión</option>
                    <option value="online">Online</option>
                    <option value="offline">Offline</option>
                </select>
            </div>

            {/* Mapa */}
            <div className="flex-1 rounded-2xl overflow-hidden border border-gray-200 shadow-sm relative min-h-[400px]">
                <MapContainer
                    center={center}
                    zoom={15}
                    className="h-full w-full"
                    scrollWheelZoom={true}
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <FitBounds tachos={conCoordenadas} />
                    {conCoordenadas.map((tacho) => (
                        <TachoMarker key={tacho.id} tacho={tacho} />
                    ))}
                </MapContainer>

                {/* Contador flotante */}
                <div className="absolute bottom-4 left-4 z-[1000] bg-white/95 backdrop-blur-sm rounded-xl px-3 py-2 shadow-md text-xs text-gray-600 flex items-center gap-2">
                    <Layers size={14} className="text-[#6EA838]" />
                    {conCoordenadas.length} tacho{conCoordenadas.length !== 1 ? 's' : ''} en el mapa
                </div>
            </div>
        </div>
    )
}
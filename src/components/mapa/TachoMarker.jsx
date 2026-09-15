import { Marker, Popup } from 'react-leaflet'
import L from 'leaflet'

function createIcon(nivel, connectionStatus) {
    let color = '#6EA838' // verde
    if (nivel >= 85) color = '#EF4444' // rojo
    else if (nivel >= 60) color = '#F59E0B' // ámbar

    const isOffline = connectionStatus === 'offline'

    return L.divIcon({
        className: '',
        html: `
      <div style="
        width: 28px;
        height: 28px;
        background: ${color};
        border: 3px solid white;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        box-shadow: 0 2px 6px rgba(0,0,0,0.3);
        opacity: ${isOffline ? 0.5 : 1};
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <div style="
          transform: rotate(45deg);
          width: 8px;
          height: 8px;
          background: white;
          border-radius: 50%;
        "></div>
      </div>
    `,
        iconSize: [28, 28],
        iconAnchor: [14, 28],
        popupAnchor: [0, -28],
    })
}

export default function TachoMarker({ tacho }) {
    if (tacho.latitud == null || tacho.longitud == null) return null

    const icon = createIcon(tacho.nivel, tacho.connectionStatus)

    return (
        <Marker position={[tacho.latitud, tacho.longitud]} icon={icon}>
            <Popup>
                <div className="min-w-[200px] text-sm">
                    <p className="font-bold text-gray-900 text-base mb-1">{tacho.codigo}</p>
                    <p className="text-gray-600 mb-2">{tacho.nombre}</p>

                    <div className="space-y-1 text-xs text-gray-500">
                        <p>
                            <span className="font-medium text-gray-700">Ubicación:</span> {tacho.ubicacion}
                        </p>
                        <p>
                            <span className="font-medium text-gray-700">Capacidad:</span> {tacho.capacidad} L
                        </p>
                        <p>
                            <span className="font-medium text-gray-700">Nivel:</span>{' '}
                            <span
                                className={
                                    tacho.nivel >= 85
                                        ? 'text-red-600 font-semibold'
                                        : tacho.nivel >= 60
                                            ? 'text-amber-600 font-semibold'
                                            : 'text-emerald-600 font-semibold'
                                }
                            >
                                {tacho.nivel}%
                            </span>
                        </p>
                        <p>
                            <span className="font-medium text-gray-700">Estado:</span>{' '}
                            {tacho.estado}
                        </p>
                        <p>
                            <span className="font-medium text-gray-700">Conexión:</span>{' '}
                            <span
                                className={
                                    tacho.connectionStatus === 'online'
                                        ? 'text-emerald-600 font-semibold'
                                        : 'text-gray-400'
                                }
                            >
                                {tacho.connectionStatus === 'online' ? 'Online' : 'Offline'}
                            </span>
                        </p>
                        {tacho.deviceId && (
                            <p>
                                <span className="font-medium text-gray-700">Device:</span>{' '}
                                <span className="font-mono">{tacho.deviceId}</span>
                            </p>
                        )}
                    </div>
                </div>
            </Popup>
        </Marker>
    )
}
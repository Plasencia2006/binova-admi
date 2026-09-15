import { useState } from 'react'
import { Settings, Wifi, Bell, Database, Save } from 'lucide-react'

export default function ConfiguracionPage() {
    const [saved, setSaved] = useState(false)
    const [loading, setLoading] = useState(false)

    const [config, setConfig] = useState({
        umbralAlertaDefault: 80,
        intervaloLecturaSeg: 60,
        wifiSSIDDefault: 'Campus-WiFi',
        notificarCriticos: true,
        notificarOffline: true,
        idioma: 'es',
        zonaHoraria: 'America/Lima',
    })

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target
        setConfig((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }))
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        setLoading(true)
        setTimeout(() => {
            setLoading(false)
            setSaved(true)
            setTimeout(() => setSaved(false), 2500)
        }, 600)
    }

    return (
        <div className="space-y-6 w-full">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Configuración</h1>
                <p className="text-sm text-gray-500 mt-1">
                    Ajustes generales del sistema BINOVA
                </p>
            </div>

            {saved && (
                <div className="p-3 bg-emerald-50 border border-emerald-100 text-emerald-700 text-sm rounded-lg">
                    Configuración guardada correctamente
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Alertas IoT */}
                <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                    <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <Bell size={18} className="text-[#6EA838]" />
                        Alertas y umbrales
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Umbral de alerta por defecto (%)
                            </label>
                            <input
                                type="number"
                                name="umbralAlertaDefault"
                                min="1"
                                max="100"
                                value={config.umbralAlertaDefault}
                                onChange={handleChange}
                                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#6EA838]"
                            />
                            <p className="text-[11px] text-gray-400 mt-1">
                                Valor por defecto al registrar un tacho nuevo
                            </p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Intervalo de lectura (segundos)
                            </label>
                            <input
                                type="number"
                                name="intervaloLecturaSeg"
                                min="10"
                                value={config.intervaloLecturaSeg}
                                onChange={handleChange}
                                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#6EA838]"
                            />
                            <p className="text-[11px] text-gray-400 mt-1">
                                Cada cuántos segundos el ESP32 reporta el nivel
                            </p>
                        </div>
                    </div>

                    <div className="mt-4 space-y-3">
                        <label className="flex items-center gap-2.5 cursor-pointer">
                            <input
                                type="checkbox"
                                name="notificarCriticos"
                                checked={config.notificarCriticos}
                                onChange={handleChange}
                                className="w-4 h-4 rounded border-gray-300 text-[#6EA838] focus:ring-[#6EA838]"
                            />
                            <span className="text-sm text-gray-700">
                                Notificar cuando un tacho supera el umbral crítico
                            </span>
                        </label>
                        <label className="flex items-center gap-2.5 cursor-pointer">
                            <input
                                type="checkbox"
                                name="notificarOffline"
                                checked={config.notificarOffline}
                                onChange={handleChange}
                                className="w-4 h-4 rounded border-gray-300 text-[#6EA838] focus:ring-[#6EA838]"
                            />
                            <span className="text-sm text-gray-700">
                                Notificar cuando un dispositivo ESP32 queda offline
                            </span>
                        </label>
                    </div>
                </section>

                {/* WiFi / IoT */}
                <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                    <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <Wifi size={18} className="text-blue-500" />
                        Conectividad IoT
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                SSID WiFi por defecto
                            </label>
                            <input
                                type="text"
                                name="wifiSSIDDefault"
                                value={config.wifiSSIDDefault}
                                onChange={handleChange}
                                placeholder="Campus-WiFi"
                                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#6EA838]"
                            />
                            <p className="text-[11px] text-gray-400 mt-1">
                                Red que se sugerirá al registrar un nuevo ESP32
                            </p>
                        </div>
                    </div>
                </section>

                {/* Sistema */}
                <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                    <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <Settings size={18} className="text-gray-500" />
                        Sistema
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Idioma</label>
                            <select
                                name="idioma"
                                value={config.idioma}
                                onChange={handleChange}
                                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#6EA838]"
                            >
                                <option value="es">Español</option>
                                <option value="en">English</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Zona horaria
                            </label>
                            <select
                                name="zonaHoraria"
                                value={config.zonaHoraria}
                                onChange={handleChange}
                                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#6EA838]"
                            >
                                <option value="America/Lima">América/Lima (Perú)</option>
                                <option value="America/Bogota">América/Bogotá</option>
                                <option value="UTC">UTC</option>
                            </select>
                        </div>
                    </div>
                </section>

                {/* Backend / API */}
                <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                    <h2 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <Database size={18} className="text-purple-500" />
                        Backend / API
                    </h2>
                    <div className="text-sm text-gray-600 space-y-1">
                        <p>
                            <span className="text-gray-400">URL API:</span>{' '}
                            <code className="bg-gray-50 px-1.5 py-0.5 rounded text-xs">
                                {import.meta.env.VITE_API_URL || 'http://localhost:3000/api'}
                            </code>
                        </p>
                        <p className="text-xs text-gray-400 mt-2">
                            Esta URL se configura en el archivo <code>.env</code> del proyecto.
                        </p>
                    </div>
                </section>

                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={loading}
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#6EA838] hover:bg-[#5a8f2e] text-white text-sm font-medium rounded-xl transition-colors disabled:opacity-60"
                    >
                        <Save size={16} />
                        {loading ? 'Guardando...' : 'Guardar configuración'}
                    </button>
                </div>
            </form>
        </div>
    )
}
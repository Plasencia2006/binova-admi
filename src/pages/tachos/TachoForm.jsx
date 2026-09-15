import { useState, useEffect } from 'react'
import { Cpu, Wifi, Radio } from 'lucide-react'

const initialForm = {
    codigo: '',
    nombre: '',
    ubicacion: '',
    latitud: '',
    longitud: '',
    capacidad: '',
    estado: 'activo',
    // IoT
    deviceId: '',
    macAddress: '',
    firmwareVersion: '1.0.0',
    wifiSSID: '',
    umbralAlerta: 80,
    alturaSensorCm: '',
    hasUltrasonic: true,
    hasServo: true,
    batteryLevel: '',
}

export default function TachoForm({ tacho, onSubmit, onCancel }) {
    const [form, setForm] = useState(initialForm)
    const [errors, setErrors] = useState({})

    useEffect(() => {
        if (tacho) {
            setForm({
                codigo: tacho.codigo || '',
                nombre: tacho.nombre || '',
                ubicacion: tacho.ubicacion || '',
                latitud: tacho.latitud ?? '',
                longitud: tacho.longitud ?? '',
                capacidad: tacho.capacidad || '',
                estado: tacho.estado || 'activo',
                deviceId: tacho.deviceId || '',
                macAddress: tacho.macAddress || '',
                firmwareVersion: tacho.firmwareVersion || '1.0.0',
                wifiSSID: tacho.wifiSSID || '',
                umbralAlerta: tacho.umbralAlerta ?? 80,
                alturaSensorCm: tacho.alturaSensorCm ?? '',
                hasUltrasonic: tacho.hasUltrasonic ?? true,
                hasServo: tacho.hasServo ?? true,
                batteryLevel: tacho.batteryLevel ?? '',
            })
        } else {
            setForm(initialForm)
        }
    }, [tacho])

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target
        setForm((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }))
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: '' }))
        }
    }

    const validate = () => {
        const newErrors = {}
        if (!form.codigo.trim()) newErrors.codigo = 'El código es obligatorio'
        if (!form.nombre.trim()) newErrors.nombre = 'El nombre es obligatorio'
        if (!form.ubicacion.trim()) newErrors.ubicacion = 'La ubicación es obligatoria'
        if (!form.capacidad || Number(form.capacidad) <= 0) {
            newErrors.capacidad = 'Ingresa una capacidad válida'
        }
        if (!form.deviceId.trim()) newErrors.deviceId = 'El Device ID del ESP32 es obligatorio'
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        if (!validate()) return

        onSubmit({
            ...form,
            latitud: form.latitud === '' ? null : Number(form.latitud),
            longitud: form.longitud === '' ? null : Number(form.longitud),
            capacidad: Number(form.capacidad),
            umbralAlerta: Number(form.umbralAlerta) || 80,
            alturaSensorCm: form.alturaSensorCm === '' ? null : Number(form.alturaSensorCm),
            batteryLevel: form.batteryLevel === '' ? null : Number(form.batteryLevel),
        })
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* ===== Información general ===== */}
            <section>
                <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#6EA838]"></span>
                    Información general
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Código *</label>
                        <input
                            name="codigo"
                            value={form.codigo}
                            onChange={handleChange}
                            placeholder="TB-001"
                            className={`w-full px-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#6EA838] ${errors.codigo ? 'border-red-300' : 'border-gray-200'
                                }`}
                        />
                        {errors.codigo && <p className="text-xs text-red-500 mt-1">{errors.codigo}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                        <select
                            name="estado"
                            value={form.estado}
                            onChange={handleChange}
                            className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#6EA838]"
                        >
                            <option value="activo">Activo</option>
                            <option value="inactivo">Inactivo</option>
                            <option value="mantenimiento">Mantenimiento</option>
                        </select>
                    </div>
                    <div className="sm:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nombre / Referencia *</label>
                        <input
                            name="nombre"
                            value={form.nombre}
                            onChange={handleChange}
                            placeholder="Tacho Bloque A - Entrada"
                            className={`w-full px-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#6EA838] ${errors.nombre ? 'border-red-300' : 'border-gray-200'
                                }`}
                        />
                        {errors.nombre && <p className="text-xs text-red-500 mt-1">{errors.nombre}</p>}
                    </div>
                    <div className="sm:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Ubicación *</label>
                        <input
                            name="ubicacion"
                            value={form.ubicacion}
                            onChange={handleChange}
                            placeholder="Bloque A - Planta Baja"
                            className={`w-full px-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#6EA838] ${errors.ubicacion ? 'border-red-300' : 'border-gray-200'
                                }`}
                        />
                        {errors.ubicacion && <p className="text-xs text-red-500 mt-1">{errors.ubicacion}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Capacidad (L) *</label>
                        <input
                            name="capacidad"
                            type="number"
                            value={form.capacidad}
                            onChange={handleChange}
                            placeholder="120"
                            className={`w-full px-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#6EA838] ${errors.capacidad ? 'border-red-300' : 'border-gray-200'
                                }`}
                        />
                        {errors.capacidad && <p className="text-xs text-red-500 mt-1">{errors.capacidad}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Umbral de alerta (%)</label>
                        <input
                            name="umbralAlerta"
                            type="number"
                            min="1"
                            max="100"
                            value={form.umbralAlerta}
                            onChange={handleChange}
                            placeholder="80"
                            className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#6EA838]"
                        />
                        <p className="text-[11px] text-gray-400 mt-1">Se envía alerta al llegar a este % de llenado</p>
                    </div>
                </div>
            </section>

            {/* ===== Ubicación GPS ===== */}
            <section>
                <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                    Coordenadas GPS
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Latitud</label>
                        <input
                            name="latitud"
                            type="number"
                            step="any"
                            value={form.latitud}
                            onChange={handleChange}
                            placeholder="-8.1116"
                            className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#6EA838]"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Longitud</label>
                        <input
                            name="longitud"
                            type="number"
                            step="any"
                            value={form.longitud}
                            onChange={handleChange}
                            placeholder="-79.0288"
                            className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#6EA838]"
                        />
                    </div>
                </div>
            </section>

            {/* ===== Hardware ESP32 ===== */}
            <section>
                <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Cpu size={14} className="text-[#6EA838]" />
                    Hardware ESP32 / IoT
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Device ID (ESP32) *</label>
                        <input
                            name="deviceId"
                            value={form.deviceId}
                            onChange={handleChange}
                            placeholder="ESP32-A1B2C3"
                            className={`w-full px-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#6EA838] font-mono ${errors.deviceId ? 'border-red-300' : 'border-gray-200'
                                }`}
                        />
                        {errors.deviceId && <p className="text-xs text-red-500 mt-1">{errors.deviceId}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">MAC Address</label>
                        <input
                            name="macAddress"
                            value={form.macAddress}
                            onChange={handleChange}
                            placeholder="AA:BB:CC:DD:EE:FF"
                            className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#6EA838] font-mono"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Firmware</label>
                        <input
                            name="firmwareVersion"
                            value={form.firmwareVersion}
                            onChange={handleChange}
                            placeholder="1.2.0"
                            className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#6EA838]"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Altura sensor (cm)</label>
                        <input
                            name="alturaSensorCm"
                            type="number"
                            value={form.alturaSensorCm}
                            onChange={handleChange}
                            placeholder="85"
                            className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#6EA838]"
                        />
                        <p className="text-[11px] text-gray-400 mt-1">Altura del sensor ultrasónico al fondo del tacho</p>
                    </div>
                </div>
            </section>

            {/* ===== Conectividad WiFi ===== */}
            <section>
                <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Wifi size={14} className="text-blue-500" />
                    Conectividad WiFi
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">SSID de la red WiFi</label>
                        <input
                            name="wifiSSID"
                            value={form.wifiSSID}
                            onChange={handleChange}
                            placeholder="Campus-WiFi"
                            className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#6EA838]"
                        />
                        <p className="text-[11px] text-gray-400 mt-1">
                            Red institucional a la que se conectará el ESP32 (Fase 1)
                        </p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nivel de batería (%)</label>
                        <input
                            name="batteryLevel"
                            type="number"
                            min="0"
                            max="100"
                            value={form.batteryLevel}
                            onChange={handleChange}
                            placeholder="Opcional si usa batería"
                            className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#6EA838]"
                        />
                    </div>
                </div>
            </section>

            {/* ===== Sensores ===== */}
            <section>
                <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Radio size={14} className="text-amber-500" />
                    Sensores y actuadores
                </h4>
                <div className="flex flex-wrap gap-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            name="hasUltrasonic"
                            checked={form.hasUltrasonic}
                            onChange={handleChange}
                            className="w-4 h-4 rounded border-gray-300 text-[#6EA838] focus:ring-[#6EA838]"
                        />
                        <span className="text-sm text-gray-700">Sensor ultrasónico (nivel)</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            name="hasServo"
                            checked={form.hasServo}
                            onChange={handleChange}
                            className="w-4 h-4 rounded border-gray-300 text-[#6EA838] focus:ring-[#6EA838]"
                        />
                        <span className="text-sm text-gray-700">Servomotor (apertura touchless)</span>
                    </label>
                </div>
            </section>

            {/* Botones */}
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                    Cancelar
                </button>
                <button
                    type="submit"
                    className="px-5 py-2.5 text-sm font-medium text-white bg-[#6EA838] hover:bg-[#5a8f2e] rounded-lg transition-colors shadow-sm"
                >
                    {tacho ? 'Guardar cambios' : 'Registrar tacho'}
                </button>
            </div>
        </form>
    )
}
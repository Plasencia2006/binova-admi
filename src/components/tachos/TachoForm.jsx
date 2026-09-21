import { useState, useEffect } from 'react'
import { Cpu } from 'lucide-react'

const initial = {
    codigo: '',
    nombre: '',
    lat: '',
    lng: '',
    altura_cm: '',
    zona_id: '',
    device_id: '',
    umbral_ambar: 50,
    umbral_rojo: 80,
}

export default function TachoForm({ tacho, zonas = [], onSubmit, onCancel }) {
    const [form, setForm] = useState(initial)
    const [errors, setErrors] = useState({})

    useEffect(() => {
        if (tacho) {
            setForm({
                codigo: tacho.codigo || '',
                nombre: tacho.nombre || '',
                lat: tacho.lat ?? tacho.latitud ?? '',
                lng: tacho.lng ?? tacho.longitud ?? '',
                altura_cm: tacho.altura_cm ?? '',
                zona_id: tacho.zona_id ?? '',
                device_id: tacho.device_id || '',
                umbral_ambar: tacho.umbral_ambar ?? 50,
                umbral_rojo: tacho.umbral_rojo ?? 80,
            })
        } else {
            setForm(initial)
        }
    }, [tacho])

    const handleChange = (e) => {
        const { name, value } = e.target
        setForm((p) => ({ ...p, [name]: value }))
        if (errors[name]) setErrors((p) => ({ ...p, [name]: '' }))
    }

    const validate = () => {
        const e = {}
        if (!form.codigo.trim()) e.codigo = 'Obligatorio'
        if (!form.nombre.trim()) e.nombre = 'Obligatorio'
        if (form.lat === '' || form.lng === '') e.coords = 'Lat y lng obligatorios'
        if (!form.altura_cm || Number(form.altura_cm) <= 0) e.altura_cm = 'Altura inválida'
        const ambar = Number(form.umbral_ambar)
        const rojo = Number(form.umbral_rojo)
        if (rojo <= ambar) e.umbral_rojo = 'Debe ser mayor que umbral ámbar'
        setErrors(e)
        return Object.keys(e).length === 0
    }

    const handleSubmit = (ev) => {
        ev.preventDefault()
        if (!validate()) return

        const payload = {
            codigo: form.codigo.trim(),
            nombre: form.nombre.trim(),
            lat: Number(form.lat),
            lng: Number(form.lng),
            altura_cm: Number(form.altura_cm),
            umbral_ambar: Number(form.umbral_ambar) || 50,
            umbral_rojo: Number(form.umbral_rojo) || 80,
        }
        if (form.zona_id) payload.zona_id = Number(form.zona_id)
        if (form.device_id.trim()) payload.device_id = form.device_id.trim()

        onSubmit(payload)
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">Zona</label>
                    <select
                        name="zona_id"
                        value={form.zona_id}
                        onChange={handleChange}
                        className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#6EA838]"
                    >
                        <option value="">Sin zona</option>
                        {zonas.map((z) => (
                            <option key={z.id} value={z.id}>
                                {z.nombre}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
                <input
                    name="nombre"
                    value={form.nombre}
                    onChange={handleChange}
                    placeholder="Contenedor Bloque A"
                    className={`w-full px-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#6EA838] ${errors.nombre ? 'border-red-300' : 'border-gray-200'
                        }`}
                />
                {errors.nombre && <p className="text-xs text-red-500 mt-1">{errors.nombre}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Lat *</label>
                    <input
                        name="lat"
                        type="number"
                        step="any"
                        value={form.lat}
                        onChange={handleChange}
                        placeholder="-8.1116"
                        className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#6EA838]"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Lng *</label>
                    <input
                        name="lng"
                        type="number"
                        step="any"
                        value={form.lng}
                        onChange={handleChange}
                        placeholder="-79.0288"
                        className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#6EA838]"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Altura sensor (cm) *</label>
                    <input
                        name="altura_cm"
                        type="number"
                        value={form.altura_cm}
                        onChange={handleChange}
                        placeholder="85"
                        className={`w-full px-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#6EA838] ${errors.altura_cm ? 'border-red-300' : 'border-gray-200'
                            }`}
                    />
                    {errors.altura_cm && (
                        <p className="text-xs text-red-500 mt-1">{errors.altura_cm}</p>
                    )}
                </div>
            </div>
            {errors.coords && <p className="text-xs text-red-500">{errors.coords}</p>}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Umbral ámbar (%)</label>
                    <input
                        name="umbral_ambar"
                        type="number"
                        min="0"
                        max="100"
                        value={form.umbral_ambar}
                        onChange={handleChange}
                        className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#6EA838]"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Umbral rojo (%)</label>
                    <input
                        name="umbral_rojo"
                        type="number"
                        min="0"
                        max="100"
                        value={form.umbral_rojo}
                        onChange={handleChange}
                        className={`w-full px-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#6EA838] ${errors.umbral_rojo ? 'border-red-300' : 'border-gray-200'
                            }`}
                    />
                    {errors.umbral_rojo && (
                        <p className="text-xs text-red-500 mt-1">{errors.umbral_rojo}</p>
                    )}
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1.5">
                    <Cpu size={14} className="text-[#6EA838]" />
                    Device ID (ESP32)
                </label>
                <input
                    name="device_id"
                    value={form.device_id}
                    onChange={handleChange}
                    placeholder="Opcional — genera token de dispositivo"
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#6EA838]"
                />
                <p className="text-[11px] text-gray-400 mt-1">
                    Si lo envías, la API genera el token del sensor (solo se muestra una vez).
                </p>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                    Cancelar
                </button>
                <button
                    type="submit"
                    className="px-5 py-2.5 text-sm font-medium text-white bg-[#6EA838] hover:bg-[#5a8f2e] rounded-lg"
                >
                    {tacho ? 'Guardar cambios' : 'Registrar contenedor'}
                </button>
            </div>
        </form>
    )
}
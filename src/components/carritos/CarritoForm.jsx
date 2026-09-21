import { useState, useEffect } from 'react'

const initialForm = {
    codigo: '',
    placa: '',
    capacidad: '',
    zona_id: '',
}

export default function CarritoForm({ carrito, zonas = [], onSubmit, onCancel }) {
    const [form, setForm] = useState(initialForm)
    const [errors, setErrors] = useState({})

    useEffect(() => {
        if (carrito) {
            setForm({
                codigo: carrito.codigo || '',
                placa: carrito.placa || '',
                capacidad: carrito.capacidad ?? '',
                zona_id: carrito.zona_id ?? carrito.zona?.id ?? '',
            })
        } else {
            setForm(initialForm)
        }
    }, [carrito])

    const handleChange = (e) => {
        const { name, value } = e.target
        setForm((prev) => ({ ...prev, [name]: value }))
        if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }))
    }

    const validate = () => {
        const newErrors = {}
        if (!form.codigo.trim()) newErrors.codigo = 'El código es obligatorio'
        if (!form.capacidad || Number(form.capacidad) <= 0) {
            newErrors.capacidad = 'Ingresa una capacidad válida'
        }
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        if (!validate()) return

        onSubmit({
            codigo: form.codigo.trim(),
            placa: form.placa.trim() || undefined,
            capacidad: Number(form.capacidad),
            zona_id: form.zona_id ? Number(form.zona_id) : undefined,
        })
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Código *</label>
                    <input
                        name="codigo"
                        value={form.codigo}
                        onChange={handleChange}
                        placeholder="CR-001"
                        className={`w-full px-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#6EA838] ${errors.codigo ? 'border-red-300' : 'border-gray-200'
                            }`}
                    />
                    {errors.codigo && <p className="text-xs text-red-500 mt-1">{errors.codigo}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Placa</label>
                    <input
                        name="placa"
                        value={form.placa}
                        onChange={handleChange}
                        placeholder="ABC-123"
                        className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#6EA838]"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Capacidad (L) *</label>
                    <input
                        name="capacidad"
                        type="number"
                        value={form.capacidad}
                        onChange={handleChange}
                        placeholder="500"
                        className={`w-full px-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#6EA838] ${errors.capacidad ? 'border-red-300' : 'border-gray-200'
                            }`}
                    />
                    {errors.capacidad && (
                        <p className="text-xs text-red-500 mt-1">{errors.capacidad}</p>
                    )}
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
                    {carrito ? 'Guardar cambios' : 'Registrar carrito'}
                </button>
            </div>
        </form>
    )
}
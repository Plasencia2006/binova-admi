import { useState, useEffect } from 'react'

const initialForm = {
    codigo: '',
    nombre: '',
    capacidad: '',
    responsable: '',
    estado: 'disponible',
    placa: '',
    tipo: 'eléctrico',
    zona: '',
}

export default function CarritoForm({ carrito, onSubmit, onCancel }) {
    const [form, setForm] = useState(initialForm)
    const [errors, setErrors] = useState({})

    useEffect(() => {
        if (carrito) {
            setForm({
                codigo: carrito.codigo || '',
                nombre: carrito.nombre || '',
                capacidad: carrito.capacidad || '',
                responsable: carrito.responsable || '',
                estado: carrito.estado || 'disponible',
                placa: carrito.placa || '',
                tipo: carrito.tipo || 'eléctrico',
                zona: carrito.zona || '',
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
        if (!form.nombre.trim()) newErrors.nombre = 'El nombre es obligatorio'
        if (!form.capacidad || Number(form.capacidad) <= 0) {
            newErrors.capacidad = 'Ingresa una capacidad válida'
        }
        if (!form.responsable.trim()) newErrors.responsable = 'El responsable es obligatorio'
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        if (!validate()) return
        onSubmit({
            ...form,
            capacidad: Number(form.capacidad),
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                    <select
                        name="estado"
                        value={form.estado}
                        onChange={handleChange}
                        className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#6EA838]"
                    >
                        <option value="disponible">Disponible</option>
                        <option value="en_ruta">En ruta</option>
                        <option value="mantenimiento">Mantenimiento</option>
                        <option value="inactivo">Inactivo</option>
                    </select>
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
                <input
                    name="nombre"
                    value={form.nombre}
                    onChange={handleChange}
                    placeholder="Carrito Norte 1"
                    className={`w-full px-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#6EA838] ${errors.nombre ? 'border-red-300' : 'border-gray-200'
                        }`}
                />
                {errors.nombre && <p className="text-xs text-red-500 mt-1">{errors.nombre}</p>}
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
                    {errors.capacidad && <p className="text-xs text-red-500 mt-1">{errors.capacidad}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                    <select
                        name="tipo"
                        value={form.tipo}
                        onChange={handleChange}
                        className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#6EA838]"
                    >
                        <option value="eléctrico">Eléctrico</option>
                        <option value="manual">Manual</option>
                    </select>
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Responsable *</label>
                <input
                    name="responsable"
                    value={form.responsable}
                    onChange={handleChange}
                    placeholder="Nombre del operario"
                    className={`w-full px-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#6EA838] ${errors.responsable ? 'border-red-300' : 'border-gray-200'
                        }`}
                />
                {errors.responsable && <p className="text-xs text-red-500 mt-1">{errors.responsable}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Placa / Identificador</label>
                    <input
                        name="placa"
                        value={form.placa}
                        onChange={handleChange}
                        placeholder="ABC-123"
                        className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#6EA838]"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Zona asignada</label>
                    <input
                        name="zona"
                        value={form.zona}
                        onChange={handleChange}
                        placeholder="Zona Norte"
                        className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#6EA838]"
                    />
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
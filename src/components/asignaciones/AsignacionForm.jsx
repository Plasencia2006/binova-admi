import { useState, useMemo } from 'react'
import { X } from 'lucide-react'

export default function AsignacionForm({
    carritos,
    tachos,
    asignaciones,
    onSubmit,
    onCancel,
}) {
    const [carritoId, setCarritoId] = useState('')
    const [selectedTachos, setSelectedTachos] = useState([])
    const [observaciones, setObservaciones] = useState('')
    const [errors, setErrors] = useState({})

    // Tachos ya asignados en asignaciones activas (para evitar duplicados)
    const tachosOcupados = useMemo(() => {
        const ids = new Set()
        asignaciones
            .filter((a) => a.estado === 'activa')
            .forEach((a) => a.tachos.forEach((t) => ids.add(t.id)))
        return ids
    }, [asignaciones])

    const tachosDisponibles = useMemo(() => {
        return tachos.filter(
            (t) => t.estado === 'activo' && !tachosOcupados.has(t.id)
        )
    }, [tachos, tachosOcupados])

    const carritosDisponibles = useMemo(() => {
        return carritos.filter((c) =>
            ['disponible', 'en_ruta'].includes(c.estado)
        )
    }, [carritos])

    const toggleTacho = (tacho) => {
        setSelectedTachos((prev) => {
            const exists = prev.find((t) => t.id === tacho.id)
            if (exists) return prev.filter((t) => t.id !== tacho.id)
            return [...prev, { id: tacho.id, codigo: tacho.codigo, nombre: tacho.nombre }]
        })
        if (errors.tachos) setErrors((e) => ({ ...e, tachos: '' }))
    }

    const removeTacho = (id) => {
        setSelectedTachos((prev) => prev.filter((t) => t.id !== id))
    }

    const validate = () => {
        const newErrors = {}
        if (!carritoId) newErrors.carrito = 'Selecciona un carrito'
        if (selectedTachos.length === 0) newErrors.tachos = 'Selecciona al menos un tacho'
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        if (!validate()) return

        const carrito = carritos.find((c) => c.id === Number(carritoId))
        onSubmit({
            carritoId: carrito.id,
            carritoCodigo: carrito.codigo,
            carritoNombre: carrito.nombre,
            tachos: selectedTachos,
            observaciones,
            estado: 'activa',
            fecha: new Date().toISOString().split('T')[0],
        })
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            {/* Carrito */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Carrito recolector *
                </label>
                <select
                    value={carritoId}
                    onChange={(e) => {
                        setCarritoId(e.target.value)
                        if (errors.carrito) setErrors((err) => ({ ...err, carrito: '' }))
                    }}
                    className={`w-full px-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#6EA838] ${errors.carrito ? 'border-red-300' : 'border-gray-200'
                        }`}
                >
                    <option value="">Seleccionar carrito...</option>
                    {carritosDisponibles.map((c) => (
                        <option key={c.id} value={c.id}>
                            {c.codigo} — {c.nombre} ({c.responsable})
                        </option>
                    ))}
                </select>
                {errors.carrito && <p className="text-xs text-red-500 mt-1">{errors.carrito}</p>}
            </div>

            {/* Tachos seleccionados */}
            {selectedTachos.length > 0 && (
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tachos seleccionados ({selectedTachos.length})
                    </label>
                    <div className="flex flex-wrap gap-2">
                        {selectedTachos.map((t) => (
                            <span
                                key={t.id}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#6EA838]/10 text-[#6EA838] rounded-lg text-sm font-medium"
                            >
                                {t.codigo}
                                <button
                                    type="button"
                                    onClick={() => removeTacho(t.id)}
                                    className="hover:bg-[#6EA838]/20 rounded p-0.5"
                                >
                                    <X size={14} />
                                </button>
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* Lista de tachos disponibles */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Seleccionar tachos *
                </label>
                {errors.tachos && <p className="text-xs text-red-500 mb-2">{errors.tachos}</p>}

                {tachosDisponibles.length === 0 ? (
                    <p className="text-sm text-gray-400 py-4 text-center border border-dashed border-gray-200 rounded-lg">
                        No hay tachos disponibles para asignar
                    </p>
                ) : (
                    <div className="max-h-52 overflow-y-auto border border-gray-200 rounded-lg divide-y divide-gray-50">
                        {tachosDisponibles.map((t) => {
                            const isSelected = selectedTachos.some((s) => s.id === t.id)
                            return (
                                <label
                                    key={t.id}
                                    className={`flex items-center gap-3 px-3 py-2.5 cursor-pointer hover:bg-gray-50 transition-colors ${isSelected ? 'bg-[#6EA838]/5' : ''
                                        }`}
                                >
                                    <input
                                        type="checkbox"
                                        checked={isSelected}
                                        onChange={() => toggleTacho(t)}
                                        className="w-4 h-4 rounded border-gray-300 text-[#6EA838] focus:ring-[#6EA838]"
                                    />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-900">{t.codigo}</p>
                                        <p className="text-xs text-gray-500 truncate">{t.nombre} · {t.ubicacion}</p>
                                    </div>
                                    <span className="text-xs text-gray-400">{t.nivel}%</span>
                                </label>
                            )
                        })}
                    </div>
                )}
                <p className="text-[11px] text-gray-400 mt-1.5">
                    Solo se muestran tachos activos que no tienen asignación activa
                </p>
            </div>

            {/* Observaciones */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Observaciones</label>
                <textarea
                    value={observaciones}
                    onChange={(e) => setObservaciones(e.target.value)}
                    rows={2}
                    placeholder="Ej: Ruta matutina Zona Norte"
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#6EA838] resize-none"
                />
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
                    Crear asignación
                </button>
            </div>
        </form>
    )
}
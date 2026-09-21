import { useState, useEffect } from 'react'
import { User, Mail, Shield, Lock, Save, X, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { authService } from '../../services/authService'

export default function PerfilModal({ isOpen, onClose }) {
    const { user, updateUser } = useAuth()

    const [claveActual, setClaveActual] = useState('')
    const [claveNueva, setClaveNueva] = useState('')
    const [claveConfirm, setClaveConfirm] = useState('')
    const [showActual, setShowActual] = useState(false)
    const [showNueva, setShowNueva] = useState(false)

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    useEffect(() => {
        if (isOpen) {
            setClaveActual('')
            setClaveNueva('')
            setClaveConfirm('')
            setError('')
            setSuccess('')
        }
    }, [isOpen])

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = ''
        }
        return () => {
            document.body.style.overflow = ''
        }
    }, [isOpen])

    if (!isOpen) return null

    const nombre = user?.nombre || user?.name || 'Usuario'
    const correo = user?.correo || user?.email || '—'
    const rolLabel =
        {
            superadmin: 'Superadmin',
            admin: 'Administrador',
            supervisor: 'Supervisor',
            operario: 'Operario',
            empleado: 'Empleado',
            particular: 'Particular',
        }[user?.rol] || user?.rol || 'Usuario'

    const handleCambiarClave = async (e) => {
        e.preventDefault()
        setError('')
        setSuccess('')

        if (claveNueva.length < 8) {
            setError('La nueva contraseña debe tener al menos 8 caracteres')
            return
        }
        if (claveNueva !== claveConfirm) {
            setError('La confirmación no coincide')
            return
        }
        if (claveNueva === claveActual) {
            setError('La nueva contraseña debe ser distinta a la actual')
            return
        }

        setLoading(true)
        try {
            await authService.cambiarClave(claveActual, claveNueva)
            setSuccess('Contraseña actualizada correctamente')
            setClaveActual('')
            setClaveNueva('')
            setClaveConfirm('')
            // El JWT sigue válido 12h según la API
        } catch (err) {
            setError(
                err.response?.data?.message ||
                err.response?.data?.error ||
                'No se pudo cambiar la contraseña'
            )
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md animate-scale-in overflow-hidden max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white z-10">
                    <h3 className="text-lg font-semibold text-gray-900">Mi perfil</h3>
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    {/* Datos del usuario (solo lectura — la API no expone editar nombre/correo aquí) */}
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-full bg-[#6EA838] flex items-center justify-center text-white shadow-lg shadow-[#6EA838]/30">
                            <User size={24} />
                        </div>
                        <div>
                            <p className="font-semibold text-gray-900">{nombre}</p>
                            <p className="text-sm text-gray-400">{correo}</p>
                            <span className="inline-flex items-center gap-1 mt-0.5 text-xs text-[#6EA838] font-medium">
                                <Shield size={11} />
                                {rolLabel}
                            </span>
                        </div>
                    </div>

                    <div className="space-y-3 text-sm">
                        <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">Nombre completo</label>
                            <div className="relative">
                                <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    value={nombre}
                                    readOnly
                                    className="w-full pl-9 pr-3 py-2.5 border border-gray-100 rounded-lg text-sm bg-gray-50 text-gray-700"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">Correo electrónico</label>
                            <div className="relative">
                                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="email"
                                    value={correo}
                                    readOnly
                                    className="w-full pl-9 pr-3 py-2.5 border border-gray-100 rounded-lg text-sm bg-gray-50 text-gray-700"
                                />
                            </div>
                        </div>
                        {user?.organizacion?.nombre && (
                            <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1">Organización</label>
                                <input
                                    type="text"
                                    value={user.organizacion.nombre}
                                    readOnly
                                    className="w-full px-3 py-2.5 border border-gray-100 rounded-lg text-sm bg-gray-50 text-gray-700"
                                />
                            </div>
                        )}
                    </div>

                    <div className="border-t border-gray-100 pt-5">
                        <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                            <Lock size={16} className="text-[#6EA838]" />
                            Cambiar contraseña
                        </h4>

                        {error && (
                            <div className="mb-3 p-2.5 bg-red-50 border border-red-100 text-red-600 text-xs rounded-lg">
                                {error}
                            </div>
                        )}
                        {success && (
                            <div className="mb-3 p-2.5 bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs rounded-lg">
                                {success}
                            </div>
                        )}

                        <form onSubmit={handleCambiarClave} className="space-y-3">
                            <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1">
                                    Contraseña actual
                                </label>
                                <div className="relative">
                                    <input
                                        type={showActual ? 'text' : 'password'}
                                        value={claveActual}
                                        onChange={(e) => setClaveActual(e.target.value)}
                                        required
                                        className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#6EA838] pr-10"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowActual(!showActual)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                                    >
                                        {showActual ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1">
                                    Nueva contraseña
                                </label>
                                <div className="relative">
                                    <input
                                        type={showNueva ? 'text' : 'password'}
                                        value={claveNueva}
                                        onChange={(e) => setClaveNueva(e.target.value)}
                                        required
                                        minLength={8}
                                        placeholder="Mínimo 8 caracteres"
                                        className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#6EA838] pr-10"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowNueva(!showNueva)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                                    >
                                        {showNueva ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1">
                                    Confirmar nueva contraseña
                                </label>
                                <input
                                    type="password"
                                    value={claveConfirm}
                                    onChange={(e) => setClaveConfirm(e.target.value)}
                                    required
                                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#6EA838]"
                                />
                            </div>

                            <div className="flex justify-end gap-2 pt-2">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-100 rounded-lg"
                                >
                                    Cerrar
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#6EA838] hover:bg-[#5a8f2e] text-white text-sm font-medium rounded-xl disabled:opacity-60"
                                >
                                    <Save size={16} />
                                    {loading ? 'Guardando...' : 'Cambiar contraseña'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}
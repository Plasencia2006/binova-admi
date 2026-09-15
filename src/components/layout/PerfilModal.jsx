import { useState, useEffect } from 'react'
import { User, Mail, Shield, Save, X } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

export default function PerfilModal({ isOpen, onClose }) {
    const { user, login } = useAuth()
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [saved, setSaved] = useState(false)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (isOpen && user) {
            setName(user.name || '')
            setEmail(user.email || '')
            setSaved(false)
        }
    }, [isOpen, user])

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

    const handleSubmit = (e) => {
        e.preventDefault()
        setLoading(true)

        setTimeout(() => {
            login({
                ...user,
                name,
                email,
            })
            setLoading(false)
            setSaved(true)
            setTimeout(() => {
                setSaved(false)
                onClose()
            }, 1200)
        }, 500)
    }

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Overlay */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md animate-scale-in overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-900">Mi perfil</h3>
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6">
                    {/* Avatar */}
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-14 h-14 rounded-full bg-[#6EA838] flex items-center justify-center text-white shadow-lg shadow-[#6EA838]/30">
                            <User size={24} />
                        </div>
                        <div>
                            <p className="font-semibold text-gray-900">
                                {user?.name || 'Administrador'}
                            </p>
                            <p className="text-sm text-gray-400">{user?.email}</p>
                            <span className="inline-flex items-center gap-1 mt-0.5 text-xs text-[#6EA838] font-medium">
                                <Shield size={11} />
                                {user?.role === 'admin' ? 'Administrador' : 'Usuario'}
                            </span>
                        </div>
                    </div>

                    {saved && (
                        <div className="mb-4 p-3 bg-emerald-50 border border-emerald-100 text-emerald-700 text-sm rounded-lg">
                            Perfil actualizado correctamente
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                Nombre completo
                            </label>
                            <div className="relative">
                                <User
                                    size={18}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                />
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#6EA838]"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                Correo electrónico
                            </label>
                            <div className="relative">
                                <Mail
                                    size={18}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#6EA838]"
                                    required
                                />
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 pt-2">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#6EA838] hover:bg-[#5a8f2e] text-white text-sm font-medium rounded-xl transition-colors disabled:opacity-60"
                            >
                                <Save size={16} />
                                {loading ? 'Guardando...' : 'Guardar'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
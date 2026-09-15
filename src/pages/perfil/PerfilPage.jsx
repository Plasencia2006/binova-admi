import { useState } from 'react'
import { User, Mail, Shield, Save } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

export default function PerfilPage() {
    const { user, login } = useAuth()
    const [name, setName] = useState(user?.name || '')
    const [email, setEmail] = useState(user?.email || '')
    const [saved, setSaved] = useState(false)
    const [loading, setLoading] = useState(false)

    const handleSubmit = (e) => {
        e.preventDefault()
        setLoading(true)

        // Simulación — luego será API
        setTimeout(() => {
            login({
                ...user,
                name,
                email,
            })
            setLoading(false)
            setSaved(true)
            setTimeout(() => setSaved(false), 2500)
        }, 600)
    }

    return (
        <div className="space-y-6 max-w-2xl">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Mi perfil</h1>
                <p className="text-sm text-gray-500 mt-1">
                    Administra tu información personal
                </p>
            </div>

            {/* Avatar */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-[#6EA838] flex items-center justify-center text-white shadow-lg shadow-[#6EA838]/30">
                        <User size={28} />
                    </div>
                    <div>
                        <p className="font-semibold text-gray-900 text-lg">
                            {user?.name || 'Administrador'}
                        </p>
                        <p className="text-sm text-gray-400">{user?.email}</p>
                        <span className="inline-flex items-center gap-1 mt-1 text-xs text-[#6EA838] font-medium">
                            <Shield size={12} />
                            {user?.role === 'admin' ? 'Administrador' : user?.role || 'Usuario'}
                        </span>
                    </div>
                </div>
            </div>

            {/* Formulario */}
            <form
                onSubmit={handleSubmit}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5"
            >
                <h2 className="font-semibold text-gray-900">Información personal</h2>

                {saved && (
                    <div className="p-3 bg-emerald-50 border border-emerald-100 text-emerald-700 text-sm rounded-lg">
                        Perfil actualizado correctamente
                    </div>
                )}

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Nombre completo
                    </label>
                    <div className="relative">
                        <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#6EA838]"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Correo electrónico
                    </label>
                    <div className="relative">
                        <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#6EA838]"
                        />
                    </div>
                </div>

                <div className="flex justify-end pt-2">
                    <button
                        type="submit"
                        disabled={loading}
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#6EA838] hover:bg-[#5a8f2e] text-white text-sm font-medium rounded-xl transition-colors disabled:opacity-60"
                    >
                        <Save size={16} />
                        {loading ? 'Guardando...' : 'Guardar cambios'}
                    </button>
                </div>
            </form>
        </div>
    )
}
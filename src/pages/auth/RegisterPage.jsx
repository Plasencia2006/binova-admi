import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { authService } from '../../services/authService'
import { User, Mail, Lock, Eye, EyeOff } from 'lucide-react'

export default function RegisterPage() {
    const [nombre, setNombre] = useState('')
    const [correo, setCorreo] = useState('')
    const [clave, setClave] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const { login } = useAuth()
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')

        if (clave.length < 8) {
            setError('La contraseña debe tener al menos 8 caracteres')
            return
        }

        setLoading(true)
        try {
            // 1) Registrar particular (crea org individual + usuario)
            await authService.registroParticular({
                nombre: nombre.trim(),
                correo: correo.trim(),
                clave,
            })

            // 2) Login automático
            const usuario = await login(correo.trim(), clave)
            if (usuario.rol === 'superadmin') {
                navigate('/superadmin', { replace: true })
            } else {
                navigate('/dashboard', { replace: true })
            }
        } catch (err) {
            const status = err.response?.status
            const msg =
                err.response?.data?.message ||
                err.response?.data?.error ||
                (status === 409
                    ? 'Ese correo ya está registrado'
                    : 'No se pudo completar el registro')
            setError(typeof msg === 'string' ? msg : 'Error al registrarse')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-white/20 animate-scale-in">
            <h2 className="text-xl font-semibold text-binova-dark mb-6 text-center">
                Crear cuenta
            </h2>
            <p className="text-xs text-center text-gray-500 -mt-4 mb-6">
                Registro como particular (organización individual)
            </p>

            {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
                <div className="animate-fade-in-up animate-delay-100">
                    <label className="block text-sm font-medium text-binova-dark mb-1.5">
                        Nombre completo
                    </label>
                    <div className="relative">
                        <User
                            size={18}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-binova-gray"
                        />
                        <input
                            type="text"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            placeholder="Tu nombre"
                            required
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-binova-green bg-white"
                        />
                    </div>
                </div>

                <div className="animate-fade-in-up animate-delay-200">
                    <label className="block text-sm font-medium text-binova-dark mb-1.5">
                        Correo electrónico
                    </label>
                    <div className="relative">
                        <Mail
                            size={18}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-binova-gray"
                        />
                        <input
                            type="email"
                            value={correo}
                            onChange={(e) => setCorreo(e.target.value)}
                            placeholder="correo@ejemplo.com"
                            required
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-binova-green bg-white"
                        />
                    </div>
                </div>

                <div className="animate-fade-in-up animate-delay-300">
                    <label className="block text-sm font-medium text-binova-dark mb-1.5">
                        Contraseña
                    </label>
                    <div className="relative">
                        <Lock
                            size={18}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-binova-gray"
                        />
                        <input
                            type={showPassword ? 'text' : 'password'}
                            value={clave}
                            onChange={(e) => setClave(e.target.value)}
                            placeholder="Mínimo 8 caracteres"
                            required
                            minLength={8}
                            className="w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-binova-green bg-white"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-binova-gray hover:text-binova-dark"
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>
                </div>

                <div className="animate-fade-in-up animate-delay-300">
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-binova-green hover:bg-binova-green-dark text-white font-medium py-2.5 rounded-lg transition-all duration-300 disabled:opacity-60 shadow-lg"
                    >
                        {loading ? 'Registrando...' : 'Crear cuenta'}
                    </button>
                </div>
            </form>

            <p className="mt-6 text-center text-sm text-binova-gray">
                ¿Ya tienes cuenta?{' '}
                <Link to="/login" className="text-binova-green font-medium hover:underline">
                    Inicia sesión
                </Link>
            </p>
        </div>
    )
}
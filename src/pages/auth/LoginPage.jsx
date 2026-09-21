import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Mail, Lock, Eye, EyeOff } from 'lucide-react'

export default function LoginPage() {
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
        setLoading(true)

        try {
            const usuario = await login(correo.trim(), clave)

            // Redirección según rol
            if (usuario.rol === 'superadmin') {
                navigate('/superadmin', { replace: true })
            } else {
                navigate('/dashboard', { replace: true })
            }
        } catch (err) {
            const msg =
                err.response?.data?.message ||
                err.response?.data?.error ||
                'Correo o contraseña incorrectos'
            setError(typeof msg === 'string' ? msg : 'No se pudo iniciar sesión')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-white/20 animate-scale-in">
            <h2 className="text-xl font-semibold text-binova-dark mb-6 text-center">
                Iniciar sesión
            </h2>

            {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
                <div className="animate-fade-in-up animate-delay-100">
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
                            autoComplete="email"
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-binova-green focus:border-transparent bg-white transition-all duration-300"
                        />
                    </div>
                </div>

                <div className="animate-fade-in-up animate-delay-200">
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
                            placeholder="••••••••"
                            required
                            autoComplete="current-password"
                            className="w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-binova-green focus:border-transparent bg-white transition-all duration-300"
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
                        className="w-full bg-binova-green hover:bg-binova-green-dark text-white font-medium py-2.5 rounded-lg transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed shadow-lg hover:shadow-xl hover:scale-[1.02]"
                    >
                        {loading ? 'Ingresando...' : 'Iniciar sesión'}
                    </button>
                </div>
            </form>

            <p className="mt-6 text-center text-sm text-binova-gray animate-fade-in-up animate-delay-300">
                ¿No tienes cuenta?{' '}
                <Link
                    to="/register"
                    className="text-binova-green font-medium hover:underline transition-colors"
                >
                    Regístrate
                </Link>
            </p>
        </div>
    )
}
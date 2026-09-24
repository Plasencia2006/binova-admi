import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Lock, Eye, EyeOff, CheckCircle, AlertCircle } from 'lucide-react'
import { authService } from '../../services/authService'
import { useAuth } from '../../context/AuthContext'

export default function ActivarPage() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token') || ''

  const [clave, setClave] = useState('')
  const [confirm, setConfirm] = useState('')
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  const { login } = useAuth()
  const navigate = useNavigate()

  if (!token) {
    return (
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-white/20 max-w-md w-full">
        <div className="flex items-center gap-2 text-amber-600 mb-3">
          <AlertCircle size={22} />
          <h2 className="text-lg font-semibold">Enlace inválido</h2>
        </div>
        <p className="text-sm text-gray-600 mb-6">
          Falta el token de activación. Abre el enlace completo que recibiste por correo
          (válido 72 horas).
        </p>
        <Link
          to="/login"
          className="block text-center w-full py-2.5 bg-[#6EA838] text-white text-sm font-medium rounded-xl"
        >
          Ir al login
        </Link>
      </div>
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (clave.length < 8) {
      setError('La clave debe tener al menos 8 caracteres')
      return
    }
    if (clave !== confirm) {
      setError('Las claves no coinciden')
      return
    }

    setLoading(true)
    try {
      const data = await authService.activar(token, clave)

      // Si la API devuelve JWT + usuario → sesión directa
      const jwt = data.token
      const usuario = data.usuario || data.user

      if (jwt && usuario) {
        // Reutilizar login guardando en context vía localStorage + estado
        // Si no tienes un setSession, hacemos login con la clave recién creada:
        // pero el correo puede venir en data
        const correo = usuario.correo || data.correo
        if (correo) {
          await login(correo, clave)
          if (usuario.rol === 'superadmin') {
            navigate('/superadmin', { replace: true })
          } else {
            navigate('/dashboard', { replace: true })
          }
          return
        }
      }

      // Si solo confirma activación → ir a login
      setDone(true)
    } catch (err) {
      const status = err.response?.status
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        (status === 400
          ? 'Token inválido o expirado'
          : status === 409
            ? 'Esta cuenta ya fue activada'
            : 'No se pudo activar la cuenta')
      setError(typeof msg === 'string' ? msg : 'Error al activar')
    } finally {
      setLoading(false)
    }
  }

  if (done) {
    return (
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-white/20 max-w-md w-full text-center">
        <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4">
          <CheckCircle size={28} />
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Cuenta activada</h2>
        <p className="text-sm text-gray-500 mb-6">
          Ya puedes iniciar sesión con tu correo y la clave que acabas de crear.
        </p>
        <Link
          to="/login"
          className="inline-flex justify-center w-full py-2.5 bg-[#6EA838] hover:bg-[#5a8f2e] text-white text-sm font-medium rounded-xl"
        >
          Ir a iniciar sesión
        </Link>
      </div>
    )
  }

  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-white/20 max-w-md w-full">
      <h2 className="text-xl font-semibold text-binova-dark mb-1 text-center">
        Crear tus credenciales
      </h2>
      <p className="text-xs text-center text-gray-500 mb-6">
        Tu organización fue aprobada. Elige una clave (el enlace vale 72 horas).
      </p>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nueva contraseña
          </label>
          <div className="relative">
            <Lock
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type={show ? 'text' : 'password'}
              value={clave}
              onChange={(e) => setClave(e.target.value)}
              required
              minLength={8}
              placeholder="Mínimo 8 caracteres"
              className="w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#6EA838]"
            />
            <button
              type="button"
              onClick={() => setShow(!show)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
            >
              {show ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Confirmar contraseña
          </label>
          <div className="relative">
            <Lock
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type={show ? 'text' : 'password'}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
              minLength={8}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#6EA838]"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#6EA838] hover:bg-[#5a8f2e] text-white font-medium py-2.5 rounded-lg transition-colors disabled:opacity-60"
        >
          {loading ? 'Activando...' : 'Crear clave y activar'}
        </button>
      </form>

      <p className="mt-5 text-center text-sm text-gray-500">
        ¿Ya activaste?{' '}
        <Link to="/login" className="text-[#6EA838] font-medium hover:underline">
          Iniciar sesión
        </Link>
      </p>
    </div>
  )
}
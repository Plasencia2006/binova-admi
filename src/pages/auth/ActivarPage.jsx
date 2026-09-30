import { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Lock, Eye, EyeOff, CheckCircle, AlertCircle } from 'lucide-react'
import { authService } from '../../services/authService'
import { useAuth } from '../../context/AuthContext'

const MENSAJES_ERROR = {
  invitacion_invalida: 'Este enlace no es válido.',
  invitacion_usada: 'Este enlace ya fue utilizado.',
  invitacion_expirada: 'Este enlace expiró. Pide uno nuevo al soporte de BINOVA.',
  org_inactiva: 'La organización no está activa.',
  conflicto: 'Esta cuenta fue desactivada. Contacta a tu administrador.',
}

function mensajeDe(err, fallback) {
  const codigo = err.response?.data?.codigo
  const msg = err.response?.data?.error || err.response?.data?.message
  return MENSAJES_ERROR[codigo] || (typeof msg === 'string' ? msg : fallback)
}

export default function ActivarPage() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token') || ''

  const [invitacion, setInvitacion] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [errorInicial, setErrorInicial] = useState('')

  const [clave, setClave] = useState('')
  const [confirm, setConfirm] = useState('')
  const [show, setShow] = useState(false)
  const [enviando, setEnviando] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  const { login } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!token) {
      setCargando(false)
      return
    }
    authService
      .obtenerInvitacion(token)
      .then((data) => setInvitacion(data))
      .catch((err) => setErrorInicial(mensajeDe(err, 'No se pudo validar el enlace.')))
      .finally(() => setCargando(false))
  }, [token])

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

    setEnviando(true)
    try {
      await authService.activar(token, clave)
      setDone(true)

      // Login automático: ya conocemos el correo por la vista previa de la invitación
      if (invitacion?.correo) {
        try {
          const usuario = await login(invitacion.correo, clave)
          navigate(usuario.rol === 'superadmin' ? '/superadmin' : '/dashboard', { replace: true })
        } catch {
          // Si el login automático falla, se queda en la pantalla de "activada" con link a /login
        }
      }
    } catch (err) {
      setError(mensajeDe(err, 'No se pudo activar la cuenta'))
    } finally {
      setEnviando(false)
    }
  }

  if (cargando) {
    return (
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-white/20 max-w-md w-full text-center">
        <div className="w-8 h-8 border-4 border-[#6EA838] border-t-transparent rounded-full animate-spin mx-auto" />
      </div>
    )
  }

  if (!token || errorInicial) {
    return (
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-white/20 max-w-md w-full">
        <div className="flex items-center gap-2 text-amber-600 mb-3">
          <AlertCircle size={22} />
          <h2 className="text-lg font-semibold">Enlace inválido</h2>
        </div>
        <p className="text-sm text-gray-600 mb-6">
          {errorInicial || 'Falta el token de activación. Abre el enlace completo que recibiste por correo.'}
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
        {invitacion?.nombre ? `Hola, ${invitacion.nombre}. ` : ''}
        {invitacion?.organizacion ? `Tu organización "${invitacion.organizacion}" fue aprobada. ` : ''}
        Elige una clave (el enlace vale 72 horas).
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
          disabled={enviando}
          className="w-full bg-[#6EA838] hover:bg-[#5a8f2e] text-white font-medium py-2.5 rounded-lg transition-colors disabled:opacity-60"
        >
          {enviando ? 'Activando...' : 'Crear clave y activar'}
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

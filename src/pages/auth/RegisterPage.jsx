import { Link } from 'react-router-dom'
import { Smartphone } from 'lucide-react'

export default function RegisterPage() {
    return (
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-white/20 animate-scale-in text-center">
            <div className="w-14 h-14 rounded-full bg-binova-green/10 text-binova-green flex items-center justify-center mx-auto mb-4">
                <Smartphone size={28} />
            </div>
            <h2 className="text-xl font-semibold text-binova-dark mb-2">
                Regístrate desde la app móvil
            </h2>
            <p className="text-sm text-gray-500 mb-6 leading-relaxed">
                Las cuentas de particular se crean desde la app móvil de BINOVA, donde también
                puedes vincular tu contenedor escaneando su código QR.
            </p>

            <p className="text-sm text-binova-gray">
                ¿Eres una empresa?{' '}
                <Link to="/solicitud-empresa" className="text-binova-green font-medium hover:underline">
                    Solicita el servicio aquí
                </Link>
            </p>
            <p className="mt-3 text-sm text-binova-gray">
                ¿Ya tienes cuenta de administrador o supervisor?{' '}
                <Link to="/login" className="text-binova-green font-medium hover:underline">
                    Inicia sesión
                </Link>
            </p>
        </div>
    )
}

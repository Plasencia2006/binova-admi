import { Link } from 'react-router-dom'
import { Smartphone } from 'lucide-react'

export default function SoloMovilPage() {
    return (
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-white/20 max-w-md w-full text-center">
            <div className="w-14 h-14 rounded-full bg-[#6EA838]/10 text-[#6EA838] flex items-center justify-center mx-auto mb-4">
                <Smartphone size={28} />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Usa la app móvil de BINOVA</h2>
            <p className="text-sm text-gray-500 mb-6 leading-relaxed">
                Tu cuenta es de operario o particular. Este panel web es solo para administradores
                y supervisores. Descarga la app móvil de BINOVA para ver tus contenedores,
                turnos e incidencias.
            </p>
            <Link
                to="/login"
                className="block text-center w-full py-2.5 bg-[#6EA838] hover:bg-[#5a8f2e] text-white text-sm font-medium rounded-xl transition-colors"
            >
                Volver al inicio de sesión
            </Link>
        </div>
    )
}

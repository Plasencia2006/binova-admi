import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

/**
 * rolesPermitidos: array opcional de roles, ej. ['admin', 'supervisor']
 * Si no se pasa, basta con estar autenticado.
 */
export default function ProtectedRoute({ rolesPermitidos }) {
    const { isAuthenticated, loading, rol } = useAuth()
    const location = useLocation()

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="w-10 h-10 border-4 border-[#6EA838] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-gray-500 text-sm">Cargando...</p>
                </div>
            </div>
        )
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />
    }

    if (rolesPermitidos?.length && !rolesPermitidos.includes(rol)) {
        // Superadmin va a su panel; el resto al dashboard org
        if (rol === 'superadmin') {
            return <Navigate to="/superadmin" replace />
        }
        return <Navigate to="/dashboard" replace />
    }

    return <Outlet />
}
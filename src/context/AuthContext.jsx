import { createContext, useContext, useState, useEffect } from 'react'
import { authService } from '../services/authService'

const AuthContext = createContext(null)

const STORAGE_KEY = 'binova_auth'

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [token, setToken] = useState(null)
    const [loading, setLoading] = useState(true)

    // Restaurar sesión al cargar
    useEffect(() => {
        const restore = async () => {
            const raw = localStorage.getItem(STORAGE_KEY)
            if (!raw) {
                setLoading(false)
                return
            }

            try {
                const saved = JSON.parse(raw)
                if (!saved?.token) {
                    localStorage.removeItem(STORAGE_KEY)
                    setLoading(false)
                    return
                }

                setToken(saved.token)
                // Validar token con /auth/me
                const data = await authService.me()
                // La API puede devolver { usuario } o el usuario directo
                const usuario = data.usuario || data
                setUser(usuario)
                setToken(saved.token)
                localStorage.setItem(
                    STORAGE_KEY,
                    JSON.stringify({ token: saved.token, usuario })
                )
            } catch {
                localStorage.removeItem(STORAGE_KEY)
                setUser(null)
                setToken(null)
            } finally {
                setLoading(false)
            }
        }

        restore()
    }, [])

    const login = async (correo, clave) => {
        const data = await authService.login(correo, clave)
        const usuario = data.usuario || data
        const jwt = data.token

        setUser(usuario)
        setToken(jwt)
        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify({ token: jwt, usuario })
        )
        return usuario
    }

    const logout = () => {
        setUser(null)
        setToken(null)
        localStorage.removeItem(STORAGE_KEY)
    }

    const updateUser = (partial) => {
        setUser((prev) => {
            const next = { ...prev, ...partial }
            const raw = localStorage.getItem(STORAGE_KEY)
            if (raw) {
                try {
                    const saved = JSON.parse(raw)
                    localStorage.setItem(
                        STORAGE_KEY,
                        JSON.stringify({ ...saved, usuario: next })
                    )
                } catch {
                    // ignore
                }
            }
            return next
        })
    }

    const value = {
        user,
        token,
        loading,
        isAuthenticated: !!user && !!token,
        rol: user?.rol || null,
        login,
        logout,
        updateUser,
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth debe usarse dentro de AuthProvider')
    }
    return context
}
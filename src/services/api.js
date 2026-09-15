import axios from 'axios'

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 15000,
})

// Interceptor: agregar token JWT si existe
api.interceptors.request.use(
    (config) => {
        const user = localStorage.getItem('binova_user')
        if (user) {
            try {
                const parsed = JSON.parse(user)
                if (parsed.token) {
                    config.headers.Authorization = `Bearer ${parsed.token}`
                }
            } catch {
                // ignore
            }
        }
        return config
    },
    (error) => Promise.reject(error)
)

// Interceptor: manejar errores de respuesta
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Sesión expirada o no autorizada
            localStorage.removeItem('binova_user')
            if (window.location.pathname !== '/login') {
                window.location.href = '/login'
            }
        }
        return Promise.reject(error)
    }
)

export default api
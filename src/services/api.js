import axios from 'axios'

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'https://binova-api.onrender.com/api/v1',
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 15000,
})

// Adjuntar JWT en cada request
api.interceptors.request.use(
    (config) => {
        const raw = localStorage.getItem('binova_auth')
        if (raw) {
            try {
                const { token } = JSON.parse(raw)
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`
                }
            } catch {
                // ignore
            }
        }
        return config
    },
    (error) => Promise.reject(error)
)

// 401 → cerrar sesión y mandar a login
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('binova_auth')
            if (!window.location.pathname.startsWith('/login')) {
                window.location.href = '/login'
            }
        }
        return Promise.reject(error)
    }
)

export default api
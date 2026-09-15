import api from './api'

export const authService = {
    login: async (email, password) => {
        const { data } = await api.post('/auth/login', { email, password })
        return data
    },

    register: async (payload) => {
        // payload: { name, email, password }
        const { data } = await api.post('/auth/register', payload)
        return data
    },

    me: async () => {
        const { data } = await api.get('/auth/me')
        return data
    },

    logout: async () => {
        try {
            await api.post('/auth/logout')
        } catch {
            // aunque falle, limpiamos local
        }
        localStorage.removeItem('binova_user')
    },
}
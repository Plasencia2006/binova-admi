import api from './api'

export const zonaService = {
    getAll: async () => {
        const { data } = await api.get('/zonas')
        return Array.isArray(data) ? data : data.data || data.zonas || []
    },

    create: async (payload) => {
        const { data } = await api.post('/zonas', payload)
        return data
    },
}
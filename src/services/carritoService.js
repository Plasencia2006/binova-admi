import api from './api'

export const carritoService = {
    getAll: async (params = {}) => {
        const { data } = await api.get('/carritos', { params })
        return Array.isArray(data) ? data : data.data || data.carritos || []
    },

    create: async (payload) => {
        // payload: codigo, placa?, capacidad, zona_id? (o zona según API)
        const { data } = await api.post('/carritos', payload)
        return data
    },

    update: async (id, payload) => {
        const { data } = await api.patch(`/carritos/${id}`, payload)
        return data
    },
}
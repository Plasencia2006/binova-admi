import api from './api'

export const asignacionService = {
    getAll: async (params = {}) => {
        const { data } = await api.get('/asignaciones', { params })
        return data
    },

    getById: async (id) => {
        const { data } = await api.get(`/asignaciones/${id}`)
        return data
    },

    create: async (payload) => {
        // payload: { carritoId, tachos: [id, id], observaciones }
        const { data } = await api.post('/asignaciones', payload)
        return data
    },

    update: async (id, payload) => {
        const { data } = await api.put(`/asignaciones/${id}`, payload)
        return data
    },

    remove: async (id) => {
        const { data } = await api.delete(`/asignaciones/${id}`)
        return data
    },

    completar: async (id) => {
        const { data } = await api.patch(`/asignaciones/${id}/completar`)
        return data
    },
}
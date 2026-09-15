import api from './api'

export const tachoService = {
    getAll: async (params = {}) => {
        // params: { search, estado, page, limit }
        const { data } = await api.get('/tachos', { params })
        return data
    },

    getById: async (id) => {
        const { data } = await api.get(`/tachos/${id}`)
        return data
    },

    create: async (payload) => {
        const { data } = await api.post('/tachos', payload)
        return data
    },

    update: async (id, payload) => {
        const { data } = await api.put(`/tachos/${id}`, payload)
        return data
    },

    remove: async (id) => {
        const { data } = await api.delete(`/tachos/${id}`)
        return data
    },

    toggleEstado: async (id, estado) => {
        const { data } = await api.patch(`/tachos/${id}/estado`, { estado })
        return data
    },
}
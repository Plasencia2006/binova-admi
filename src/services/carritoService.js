import api from './api'

export const carritoService = {
    getAll: async (params = {}) => {
        const { data } = await api.get('/carritos', { params })
        return data
    },

    getById: async (id) => {
        const { data } = await api.get(`/carritos/${id}`)
        return data
    },

    create: async (payload) => {
        const { data } = await api.post('/carritos', payload)
        return data
    },

    update: async (id, payload) => {
        const { data } = await api.put(`/carritos/${id}`, payload)
        return data
    },

    remove: async (id) => {
        const { data } = await api.delete(`/carritos/${id}`)
        return data
    },

    toggleEstado: async (id, estado) => {
        const { data } = await api.patch(`/carritos/${id}/estado`, { estado })
        return data
    },
}import api from './api'

export const carritoService = {
    getAll: async (params = {}) => {
        const { data } = await api.get('/carritos', { params })
        return data
    },

    getById: async (id) => {
        const { data } = await api.get(`/carritos/${id}`)
        return data
    },

    create: async (payload) => {
        const { data } = await api.post('/carritos', payload)
        return data
    },

    update: async (id, payload) => {
        const { data } = await api.put(`/carritos/${id}`, payload)
        return data
    },

    remove: async (id) => {
        const { data } = await api.delete(`/carritos/${id}`)
        return data
    },

    toggleEstado: async (id, estado) => {
        const { data } = await api.patch(`/carritos/${id}/estado`, { estado })
        return data
    },
}
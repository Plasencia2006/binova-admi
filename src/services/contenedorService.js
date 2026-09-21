import api from './api'

export const contenedorService = {
    getAll: async (params = {}) => {
        const { data } = await api.get('/contenedores', { params })
        return Array.isArray(data) ? data : data.data || data.contenedores || []
    },

    getById: async (id) => {
        const { data } = await api.get(`/contenedores/${id}`)
        return data.contenedor || data
    },

    getHistorico: async (id, limite = 200) => {
        const { data } = await api.get(`/contenedores/${id}/historico`, {
            params: { limite },
        })
        return Array.isArray(data) ? data : data.data || data.lecturas || []
    },

    create: async (payload) => {
        // payload: codigo, nombre, lat, lng, altura_cm, zona_id?, device_id?, umbral_ambar?, umbral_rojo?
        const { data } = await api.post('/contenedores', payload)
        return data
    },

    update: async (id, payload) => {
        const { data } = await api.patch(`/contenedores/${id}`, payload)
        return data
    },

    inventario: async (payload) => {
        const { data } = await api.post('/contenedores/inventario', payload)
        return data
    },

    inventarioLote: async (payload) => {
        const { data } = await api.post('/contenedores/inventario/lote', payload)
        return data
    },

    vincular: async (payload) => {
        const { data } = await api.post('/contenedores/vincular', payload)
        return data
    },
}
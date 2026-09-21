import api from './api'

export const recoleccionService = {
    getAll: async (params = {}) => {
        // filtros: contenedor_id, fechas, etc.
        const { data } = await api.get('/recolecciones', { params })
        return Array.isArray(data) ? data : data.data || data.recolecciones || []
    },

    crear: async (payload) => {
        // payload: contenedor_id o contenedor_codigo, lat?, lng?
        const { data } = await api.post('/recolecciones', payload)
        return data
    },
}
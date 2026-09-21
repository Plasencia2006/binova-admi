import api from './api'

export const incidenciaService = {
    getAll: async (params = {}) => {
        const { data } = await api.get('/incidencias', { params })
        return Array.isArray(data) ? data : data.data || data.incidencias || []
    },

    crear: async (payload) => {
        // tipo: tapa_danada | sensor_sucio | acceso_bloqueado | otro
        // contenedor_id? o descripcion
        const { data } = await api.post('/incidencias', payload)
        return data
    },

    resolver: async (id) => {
        const { data } = await api.patch(`/incidencias/${id}/resolver`)
        return data
    },
}
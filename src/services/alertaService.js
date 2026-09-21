import api from './api'

export const alertaService = {
    getAll: async (params = {}) => {
        // params: estado=pendiente|atendida, tipo=llenado_critico|bateria_baja|sin_reporte
        const { data } = await api.get('/alertas', { params })
        return Array.isArray(data) ? data : data.data || data.alertas || []
    },

    tomar: async (id) => {
        const { data } = await api.patch(`/alertas/${id}/tomar`)
        return data
    },

    soltar: async (id) => {
        const { data } = await api.patch(`/alertas/${id}/soltar`)
        return data
    },

    asignar: async (id, carrito_id) => {
        const { data } = await api.patch(`/alertas/${id}/asignar`, { carrito_id })
        return data
    },

    atender: async (id) => {
        const { data } = await api.patch(`/alertas/${id}/atender`)
        return data
    },
}
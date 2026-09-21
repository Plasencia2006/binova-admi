import api from './api'

export const organizacionService = {
    /**
     * POST /organizaciones/solicitud
     * body: { nombre, contacto_nombre, contacto_correo, mensaje? }
     * Público — no requiere token
     */
    solicitar: async (payload) => {
        const { data } = await api.post('/organizaciones/solicitud', payload)
        return data
    },

    // Para FASE C (superadmin)
    listar: async (params = {}) => {
        const { data } = await api.get('/organizaciones', { params })
        return data
    },

    aprobar: async (id) => {
        const { data } = await api.post(`/organizaciones/${id}/aprobar`)
        return data
    },

    cambiarEstado: async (id, estado) => {
        const { data } = await api.patch(`/organizaciones/${id}/estado`, { estado })
        return data
    },
}
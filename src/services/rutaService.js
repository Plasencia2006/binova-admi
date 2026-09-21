import api from './api'

export const rutaService = {
    optima: async (params = {}) => {
        // estados, nivel_min, max, perfil, zona_id, lat, lng
        const { data } = await api.get('/rutas/optima', { params })
        return data
    },
}
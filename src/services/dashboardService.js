import api from './api'

export const dashboardService = {
    getResumen: async () => {
        const { data } = await api.get('/estadisticas/resumen')
        return data
    },

    getRecoleccionesPorDia: async (dias = 14) => {
        const { data } = await api.get('/estadisticas/recolecciones-por-dia', {
            params: { dias },
        })
        return Array.isArray(data) ? data : data.data || data.serie || []
    },
}
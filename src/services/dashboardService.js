import api from './api'

export const dashboardService = {
    getStats: async () => {
        const { data } = await api.get('/dashboard/stats')
        return data
    },

    getActividad: async () => {
        const { data } = await api.get('/dashboard/actividad')
        return data
    },
}
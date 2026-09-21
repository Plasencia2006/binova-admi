import api from './api'

export const turnoService = {
    actual: async () => {
        const { data } = await api.get('/turnos/actual')
        // puede ser null o { turno } / el turno directo
        if (data == null) return null
        return data.turno ?? data
    },

    abrir: async (codigo_carrito) => {
        const { data } = await api.post('/turnos', { codigo: codigo_carrito })
        return data.turno ?? data
    },

    cerrar: async (id) => {
        const { data } = await api.patch(`/turnos/${id}/cerrar`)
        return data
    },

    actualizarPosicion: async (id, lat, lng) => {
        const { data } = await api.patch(`/turnos/${id}/posicion`, {
            lat,
            lng,
            // si tu API usa ult_lat / ult_lng en el body, ajústalo
        })
        return data
    },
}
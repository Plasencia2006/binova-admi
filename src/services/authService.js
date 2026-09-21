import api from './api'

export const authService = {
    /**
     * POST /auth/login
     * body: { correo, clave }
     * response: { token, usuario }  (usuario incluye organizacion si aplica)
     */
    login: async (correo, clave) => {
        const { data } = await api.post('/auth/login', { correo, clave })
        return data
    },

    /**
     * POST /auth/registro-particular
     * body: { nombre, correo, clave }
     */
    registroParticular: async ({ nombre, correo, clave }) => {
        const { data } = await api.post('/auth/registro-particular', {
            nombre,
            correo,
            clave,
        })
        return data
    },

    /**
     * GET /auth/me
     */
    me: async () => {
        const { data } = await api.get('/auth/me')
        return data
    },

    /**
     * POST /auth/cambiar-clave
     * body: { clave_actual, clave_nueva }
     */
    cambiarClave: async (clave_actual, clave_nueva) => {
        const { data } = await api.post('/auth/cambiar-clave', {
            clave_actual,
            clave_nueva,
        })
        return data
    },
}
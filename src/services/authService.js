import api from './api'

export const authService = {
  login: async (correo, clave) => {
    const { data } = await api.post('/auth/login', { correo, clave })
    return data
  },

  registroParticular: async ({ nombre, correo, clave }) => {
    const { data } = await api.post('/auth/registro-particular', {
      nombre,
      correo,
      clave,
    })
    return data
  },

  me: async () => {
    const { data } = await api.get('/auth/me')
    return data
  },

  cambiarClave: async (clave_actual, clave_nueva) => {
    const { data } = await api.post('/auth/cambiar-clave', {
      clave_actual,
      clave_nueva,
    })
    return data
  },

  /**
   * Vista previa de la invitación (nombre, correo, organización) antes de activar.
   * GET /auth/invitacion?token=...
   */
  obtenerInvitacion: async (token) => {
    const { data } = await api.get('/auth/invitacion', { params: { token } })
    return data
  },

  /**
   * Activar cuenta desde el enlace del correo (aprobación de empresa).
   * POST /auth/activar-invitacion  body: { token, clave }
   */
  activar: async (token, clave) => {
    const { data } = await api.post('/auth/activar-invitacion', { token, clave })
    return data
  },
}
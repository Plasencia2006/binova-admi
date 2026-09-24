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
   * Activar cuenta desde el enlace del correo (aprobación de empresa).
   * POST /auth/activar  body: { token, clave }
   * Si tu backend usa otra ruta, cámbiala solo aquí.
   */
  activar: async (token, clave) => {
    const { data } = await api.post('/auth/activar', { token, clave })
    return data
  },
}
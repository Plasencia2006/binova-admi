export const stats = {
    totalTachos: 128,
    tachosActivos: 112,
    tachosPendientes: 16,
    totalCarritos: 18,
    carritosDisponibles: 12,
    asignacionesActivas: 45,
    nivelPromedio: 67,
    recoleccionesHoy: 23,
}

export const actividadReciente = [
    {
        id: 1,
        tipo: 'alerta',
        mensaje: 'Tacho TB-014 alcanzó el 85% de capacidad',
        ubicacion: 'Bloque A - Piso 2',
        hora: 'Hace 12 min',
    },
    {
        id: 2,
        tipo: 'recoleccion',
        mensaje: 'Carrito CR-003 completó ruta de recolección',
        ubicacion: 'Zona Norte',
        hora: 'Hace 28 min',
    },
    {
        id: 3,
        tipo: 'asignacion',
        mensaje: 'Se asignaron 4 tachos al carrito CR-007',
        ubicacion: 'Campus Central',
        hora: 'Hace 1 h',
    },
    {
        id: 4,
        tipo: 'alerta',
        mensaje: 'Tacho TB-022 reporta sensor con lectura irregular',
        ubicacion: 'Bloque C - Exterior',
        hora: 'Hace 1 h 15 min',
    },
    {
        id: 5,
        tipo: 'recoleccion',
        mensaje: 'Ruta optimizada generada para Zona Sur',
        ubicacion: 'Zona Sur',
        hora: 'Hace 2 h',
    },
]

export const estadoTachos = [
    { estado: 'Óptimo', cantidad: 64, color: 'bg-emerald-500', porcentaje: 50 },
    { estado: 'Medio', cantidad: 32, color: 'bg-amber-400', porcentaje: 25 },
    { estado: 'Crítico', cantidad: 16, color: 'bg-red-500', porcentaje: 12.5 },
    { estado: 'Inactivo', cantidad: 16, color: 'bg-gray-400', porcentaje: 12.5 },
]

export const resumenRecoleccion = [
    { dia: 'Lun', cantidad: 18 },
    { dia: 'Mar', cantidad: 22 },
    { dia: 'Mié', cantidad: 15 },
    { dia: 'Jue', cantidad: 28 },
    { dia: 'Vie', cantidad: 24 },
    { dia: 'Sáb', cantidad: 12 },
    { dia: 'Dom', cantidad: 8 },
]
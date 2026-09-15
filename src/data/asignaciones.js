export const asignacionesMock = [
    {
        id: 1,
        carritoId: 1,
        carritoCodigo: 'CR-001',
        carritoNombre: 'Carrito Norte 1',
        tachos: [
            { id: 1, codigo: 'TB-001', nombre: 'Tacho Bloque A - Entrada' },
            { id: 2, codigo: 'TB-002', nombre: 'Tacho Bloque A - Piso 2' },
        ],
        fecha: '2026-09-10',
        estado: 'activa',
        observaciones: 'Ruta matutina Zona Norte',
    },
    {
        id: 2,
        carritoId: 2,
        carritoCodigo: 'CR-002',
        carritoNombre: 'Carrito Norte 2',
        tachos: [
            { id: 3, codigo: 'TB-003', nombre: 'Tacho Cafetería' },
        ],
        fecha: '2026-09-11',
        estado: 'activa',
        observaciones: '',
    },
    {
        id: 3,
        carritoId: 3,
        carritoCodigo: 'CR-003',
        carritoNombre: 'Carrito Centro',
        tachos: [
            { id: 6, codigo: 'TB-006', nombre: 'Tacho Biblioteca' },
            { id: 7, codigo: 'TB-007', nombre: 'Tacho Auditorio' },
        ],
        fecha: '2026-09-08',
        estado: 'completada',
        observaciones: 'Ruta completada el 12/09',
    },
    {
        id: 4,
        carritoId: 5,
        carritoCodigo: 'CR-005',
        carritoNombre: 'Carrito Sur 2',
        tachos: [
            { id: 4, codigo: 'TB-004', nombre: 'Tacho Estacionamiento' },
        ],
        fecha: '2026-09-12',
        estado: 'activa',
        observaciones: '',
    },
]
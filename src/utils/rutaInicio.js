export function rutaInicioPara(rol) {
    switch (rol) {
        case 'superadmin':
            return '/superadmin'
        case 'admin':
        case 'supervisor':
            return '/dashboard'
        case 'operario':
        case 'particular':
            return '/solo-movil'
        default:
            return '/login'
    }
}

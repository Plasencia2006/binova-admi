import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import {
    LayoutDashboard,
    Trash2,
    Truck,
    Map,
    Users,
    Settings,
    AlertTriangle,
    Clock,
    PackageCheck,
    Wrench,
    LogOut,
    Menu,
    X,
    ChevronLeft,
    ChevronRight,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useSidebar } from '../../context/SidebarContext'
import logo from '../../assets/logo-binova-icono.png'

const ALL_MENU = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, roles: ['admin', 'supervisor'] },
    { name: 'Contenedores', path: '/tachos', icon: Trash2, roles: ['admin', 'supervisor', 'operario', 'empleado', 'particular'] },
    { name: 'Carritos', path: '/carritos', icon: Truck, roles: ['admin', 'supervisor', 'operario'] },
    { name: 'Alertas', path: '/alertas', icon: AlertTriangle, roles: ['admin', 'supervisor', 'operario'] },
    { name: 'Turno', path: '/turno', icon: Clock, roles: ['operario', 'admin', 'supervisor'] },
    { name: 'Recolecciones', path: '/recolecciones', icon: PackageCheck, roles: ['admin', 'supervisor', 'operario'] },
    { name: 'Incidencias', path: '/incidencias', icon: Wrench, roles: ['admin', 'supervisor', 'operario', 'empleado'] },
    { name: 'Mapa', path: '/mapa', icon: Map, roles: ['admin', 'supervisor', 'operario', 'empleado', 'particular'] },
    { name: 'Usuarios', path: '/usuarios', icon: Users, roles: ['admin', 'supervisor'] },
    { name: 'Configuración', path: '/configuracion', icon: Settings, roles: ['admin', 'supervisor', 'operario', 'empleado', 'particular'] },
]

export default function Sidebar() {
    const [isOpen, setIsOpen] = useState(false)
    const { collapsed, toggle } = useSidebar()
    const { logout, rol } = useAuth()
    const navigate = useNavigate()

    const menuItems = ALL_MENU.filter(
        (item) => !item.roles || item.roles.includes(rol)
    )

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    return (
        <>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden fixed top-4 left-4 z-50 p-2.5 rounded-xl bg-[#0f172a] text-white shadow-lg"
            >
                {isOpen ? <X size={22} /> : <Menu size={22} />}
            </button>

            {isOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"
                    onClick={() => setIsOpen(false)}
                />
            )}

            <aside
                className={`
          fixed top-0 left-0 z-40 h-full bg-[#0B1220] text-white
          flex flex-col
          transition-all duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
          ${collapsed ? 'lg:w-20' : 'lg:w-64'}
          w-64
        `}
            >
                <div
                    className={`
            flex items-center gap-3 border-b border-white/10
            transition-all duration-300
            ${collapsed ? 'px-3 py-5 justify-center' : 'px-5 py-5'}
          `}
                >
                    <div className="relative flex-shrink-0">
                        <div className="absolute inset-0 bg-[#6EA838]/20 rounded-full blur-md"></div>
                        <img
                            src={logo}
                            alt="BINOVA"
                            className="relative h-11 w-11 object-contain drop-shadow-lg"
                        />
                    </div>

                    {!collapsed && (
                        <div className="overflow-hidden">
                            <h1 className="text-lg font-black tracking-wide leading-none">
                                <span className="text-[#6EA838]">BÍ</span>
                                <span className="text-white">NOVA</span>
                            </h1>
                            <p className="text-[10px] text-gray-400 mt-0.5 leading-tight whitespace-nowrap">
                                Inteligencia que transforma residuos
                            </p>
                        </div>
                    )}
                </div>

                <button
                    onClick={toggle}
                    className="hidden lg:flex absolute -right-3 top-20 w-6 h-6 rounded-full bg-[#6EA838] text-white items-center justify-center shadow-md hover:scale-110 transition-transform z-50"
                    title={collapsed ? 'Expandir' : 'Contraer'}
                >
                    {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
                </button>

                <nav className="flex-1 mt-4 px-3 space-y-1 overflow-y-auto">
                    {menuItems.map((item) => {
                        const Icon = item.icon
                        return (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                onClick={() => setIsOpen(false)}
                                title={collapsed ? item.name : undefined}
                                className={({ isActive }) =>
                                    `
                  group flex items-center gap-3 rounded-xl text-sm font-medium
                  transition-all duration-200
                  ${collapsed ? 'justify-center px-3 py-3' : 'px-4 py-3'}
                  ${isActive
                                        ? 'bg-[#6EA838] text-white shadow-lg shadow-[#6EA838]/25'
                                        : 'text-gray-400 hover:bg-white/5 hover:text-white'
                                    }
                `
                                }
                            >
                                <Icon
                                    size={20}
                                    className="flex-shrink-0 transition-transform duration-200 group-hover:scale-110"
                                />
                                {!collapsed && <span className="truncate">{item.name}</span>}
                            </NavLink>
                        )
                    })}
                </nav>

                <div className="p-3 border-t border-white/10">
                    <button
                        onClick={handleLogout}
                        title={collapsed ? 'Cerrar sesión' : undefined}
                        className={`
              flex items-center gap-3 w-full rounded-xl text-sm font-medium
              text-gray-400 hover:bg-red-500/15 hover:text-red-400
              transition-all duration-200
              ${collapsed ? 'justify-center px-3 py-3' : 'px-4 py-3'}
            `}
                    >
                        <LogOut size={20} className="flex-shrink-0" />
                        {!collapsed && <span>Cerrar sesión</span>}
                    </button>
                </div>
            </aside>
        </>
    )
}
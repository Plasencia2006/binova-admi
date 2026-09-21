import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import {
    LayoutDashboard,
    Building2,
    Cpu,
    LogOut,
    Menu,
    X,
    User,
} from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import logo from '../assets/logo-binova-icono.png'
import PerfilModal from '../components/layout/PerfilModal'

const menu = [
    { name: 'Resumen', path: '/superadmin', icon: LayoutDashboard, end: true },
    { name: 'Organizaciones', path: '/superadmin/organizaciones', icon: Building2 },
    { name: 'Inventario IoT', path: '/superadmin/inventario', icon: Cpu },
]

export default function SuperadminLayout() {
    const [open, setOpen] = useState(false)
    const [perfilOpen, setPerfilOpen] = useState(false)
    const { user, logout } = useAuth()
    const navigate = useNavigate()

    const nombre = user?.nombre || user?.name || 'Superadmin'
    const correo = user?.correo || user?.email || ''

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    return (
        <div className="min-h-screen bg-[#F8FAFC] flex">
            <button
                onClick={() => setOpen(!open)}
                className="lg:hidden fixed top-4 left-4 z-50 p-2.5 rounded-xl bg-[#0B1220] text-white shadow-lg"
            >
                {open ? <X size={20} /> : <Menu size={20} />}
            </button>

            {open && (
                <div
                    className="lg:hidden fixed inset-0 bg-black/50 z-40"
                    onClick={() => setOpen(false)}
                />
            )}

            <aside
                className={`
          fixed lg:static inset-y-0 left-0 z-40 w-64 bg-[#0B1220] text-white
          flex flex-col transition-transform duration-300
          ${open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
            >
                <div className="px-5 py-5 border-b border-white/10 flex items-center gap-3">
                    <img src={logo} alt="BINOVA" className="h-10 w-10 object-contain" />
                    <div>
                        <p className="font-black text-sm leading-none">
                            <span className="text-[#6EA838]">BÍ</span>NOVA
                        </p>
                        <p className="text-[10px] text-gray-400 mt-0.5">Superadmin</p>
                    </div>
                </div>

                <nav className="flex-1 p-3 space-y-1">
                    {menu.map((item) => {
                        const Icon = item.icon
                        return (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                end={item.end}
                                onClick={() => setOpen(false)}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${isActive
                                        ? 'bg-[#6EA838] text-white'
                                        : 'text-gray-400 hover:bg-white/5 hover:text-white'
                                    }`
                                }
                            >
                                <Icon size={18} />
                                {item.name}
                            </NavLink>
                        )
                    })}
                </nav>

                <div className="p-3 border-t border-white/10 space-y-1">
                    {/* Perfil */}
                    <button
                        onClick={() => {
                            setOpen(false)
                            setPerfilOpen(true)
                        }}
                        className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-left hover:bg-white/5 transition-colors"
                    >
                        <div className="w-9 h-9 rounded-full bg-[#6EA838] flex items-center justify-center text-white flex-shrink-0">
                            <User size={18} />
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="text-xs text-gray-500">Sesión</p>
                            <p className="text-sm text-white truncate">{nombre}</p>
                            {correo && (
                                <p className="text-[10px] text-gray-500 truncate">{correo}</p>
                            )}
                        </div>
                    </button>

                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm text-gray-400 hover:bg-red-500/15 hover:text-red-400 transition-colors"
                    >
                        <LogOut size={18} />
                        Cerrar sesión
                    </button>
                </div>
            </aside>

            <div className="flex-1 min-w-0">
                {/* Top bar simple con acceso a perfil */}
                <header className="h-14 bg-white/80 backdrop-blur-md border-b border-gray-100 flex items-center justify-end px-4 lg:px-8 gap-3">
                    <button
                        onClick={() => setPerfilOpen(true)}
                        className="flex items-center gap-2.5 rounded-xl hover:bg-gray-50 px-2 py-1.5 transition-colors"
                    >
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-semibold text-gray-800 leading-tight">{nombre}</p>
                            <p className="text-xs text-gray-400 leading-tight">{correo}</p>
                        </div>
                        <div className="w-9 h-9 rounded-full bg-[#6EA838] flex items-center justify-center text-white shadow-md shadow-[#6EA838]/25">
                            <User size={18} />
                        </div>
                    </button>
                </header>

                <main className="p-4 lg:p-8">
                    <Outlet />
                </main>
            </div>

            <PerfilModal isOpen={perfilOpen} onClose={() => setPerfilOpen(false)} />
        </div>
    )
}
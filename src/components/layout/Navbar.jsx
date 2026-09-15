import { useState, useRef, useEffect } from 'react'
import { Search, User, Settings, LogOut, ChevronDown } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useNavigate, Link } from 'react-router-dom'
import PerfilModal from './PerfilModal'

export default function Navbar() {
    const { user, logout } = useAuth()
    const navigate = useNavigate()
    const [menuOpen, setMenuOpen] = useState(false)
    const [perfilOpen, setPerfilOpen] = useState(false)
    const menuRef = useRef(null)

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setMenuOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    return (
        <>
            <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-100 h-16 flex items-center justify-between px-4 lg:px-8">
                {/* Buscador */}
                <div className="hidden md:flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2 w-80 border border-gray-100 focus-within:ring-2 focus-within:ring-[#6EA838]/30 transition-all">
                    <Search size={18} className="text-gray-400" />
                    <input
                        type="text"
                        placeholder="Buscar tachos, carritos..."
                        className="bg-transparent outline-none text-sm w-full text-gray-700 placeholder:text-gray-400"
                    />
                </div>

                <div className="md:hidden" />

                {/* Perfil */}
                <div className="relative" ref={menuRef}>
                    <button
                        onClick={() => setMenuOpen(!menuOpen)}
                        className="flex items-center gap-3 pl-2 rounded-xl hover:bg-gray-50 transition-colors py-1.5 pr-2"
                    >
                        <div className="hidden sm:block text-right">
                            <p className="text-sm font-semibold text-gray-800">
                                {user?.name || 'Administrador'}
                            </p>
                            <p className="text-xs text-gray-400">
                                {user?.email || 'admin@binova.pe'}
                            </p>
                        </div>
                        <div className="w-9 h-9 rounded-full bg-[#6EA838] flex items-center justify-center text-white shadow-md shadow-[#6EA838]/30">
                            <User size={18} />
                        </div>
                        <ChevronDown
                            size={16}
                            className={`text-gray-400 transition-transform hidden sm:block ${menuOpen ? 'rotate-180' : ''
                                }`}
                        />
                    </button>

                    {menuOpen && (
                        <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-1.5 z-50 animate-scale-in origin-top-right">
                            <div className="px-4 py-2.5 border-b border-gray-50">
                                <p className="text-sm font-semibold text-gray-900 truncate">
                                    {user?.name || 'Administrador'}
                                </p>
                                <p className="text-xs text-gray-400 truncate">
                                    {user?.email || 'admin@binova.pe'}
                                </p>
                            </div>

                            {/* Abrir modal de perfil */}
                            <button
                                onClick={() => {
                                    setMenuOpen(false)
                                    setPerfilOpen(true)
                                }}
                                className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                                <User size={16} className="text-gray-400" />
                                Mi perfil
                            </button>

                            <Link
                                to="/configuracion"
                                onClick={() => setMenuOpen(false)}
                                className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                                <Settings size={16} className="text-gray-400" />
                                Configuración
                            </Link>

                            <div className="border-t border-gray-50 mt-1 pt-1">
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                >
                                    <LogOut size={16} />
                                    Cerrar sesión
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </header>

            {/* Modal de perfil */}
            <PerfilModal isOpen={perfilOpen} onClose={() => setPerfilOpen(false)} />
        </>
    )
}
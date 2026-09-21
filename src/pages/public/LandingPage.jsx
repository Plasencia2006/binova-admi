import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
    Trash2,
    Wifi,
    MapPin,
    BarChart3,
    Building2,
    User,
    ArrowRight,
    Leaf,
    Menu,
    X,
    Smartphone,
    TrendingUp,
    Clock,
    CheckCircle2,
    Globe,
    Zap,
    Shield
} from 'lucide-react'
import logo from '../../assets/logo-binova-icono.png'
import heroBackground from '../../assets/fondo_landing.jpg'

const features = [
    {
        icon: Wifi,
        title: 'Sensores IoT',
        desc: 'ESP32 con sensor ultrasónico: nivel de llenado en tiempo real y alertas automáticas.',
        color: 'from-blue-500 to-cyan-400'
    },
    {
        icon: MapPin,
        title: 'Mapa y rutas',
        desc: 'Visualiza contenedores y optimiza rutas de recolección para reducir costos y tiempo.',
        color: 'from-green-500 to-emerald-400'
    },
    {
        icon: BarChart3,
        title: 'Panel administrativo',
        desc: 'Dashboard, alertas, turnos, carritos y estadísticas para tu organización.',
        color: 'from-purple-500 to-pink-400'
    },
    {
        icon: Trash2,
        title: 'Recolección inteligente',
        desc: 'Prioriza contenedores críticos y registra vaciados desde campo.',
        color: 'from-orange-500 to-yellow-400'
    },
]

const stats = [
    { value: '+500', label: 'Contenedores monitoreados', icon: Trash2 },
    { value: '98%', label: 'Eficiencia en recolección', icon: TrendingUp },
    { value: '-40%', label: 'Reducción de costos', icon: Zap },
    { value: '24/7', label: 'Monitoreo constante', icon: Clock },
]

const benefits = [
    { icon: CheckCircle2, text: 'Implementación rápida en 48 horas' },
    { icon: CheckCircle2, text: 'Soporte técnico especializado' },
    { icon: CheckCircle2, text: 'Integración con sistemas existentes' },
    { icon: CheckCircle2, text: 'Reportes personalizados' },
]

export default function LandingPage() {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    return (
        <div className="min-h-screen bg-white overflow-x-hidden">
            <style>{`
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(30px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-20px); }
                }
                .animate-fade-in-up {
                    animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                    opacity: 0;
                }
                .animate-fade-in {
                    animation: fadeIn 1s ease-out forwards;
                }
                .animate-float {
                    animation: float 6s ease-in-out infinite;
                }
                .delay-100 { animation-delay: 0.1s; }
                .delay-200 { animation-delay: 0.2s; }
                .delay-300 { animation-delay: 0.3s; }
                .delay-400 { animation-delay: 0.4s; }
                .gradient-text {
                    background: linear-gradient(135deg, #6EA838 0%, #8BC34A 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }
            `}</style>

            {/* Navbar Transparente */}
            <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-transparent'
                }`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16 sm:h-20">
                        <Link to="/" className="flex items-center gap-2 sm:gap-3 group">
                            <img
                                src={logo}
                                alt="BINOVA"
                                className="h-8 w-8 sm:h-10 sm:w-10 object-contain transition-transform duration-300 group-hover:scale-110"
                            />
                            <span className={`font-black text-base sm:text-xl tracking-tight transition-colors ${scrolled ? 'text-gray-900' : 'text-white'
                                }`}>
                                <span className="text-[#6EA838]">BÍ</span>NOVA
                            </span>
                        </Link>

                        <nav className="hidden md:flex items-center gap-6">
                            <Link
                                to="/login"
                                className={`text-sm font-medium transition-colors ${scrolled ? 'text-gray-600 hover:text-[#6EA838]' : 'text-white/90 hover:text-white'
                                    }`}
                            >
                                Iniciar sesión
                            </Link>
                            <Link
                                to="/solicitud-empresa"
                                className="px-5 py-2.5 text-sm font-semibold text-white bg-[#6EA838] hover:bg-[#5a8f2e] rounded-xl transition-all duration-300 shadow-lg shadow-[#6EA838]/25 hover:shadow-[#6EA838]/40 hover:-translate-y-0.5"
                            >
                                Solicitar servicio
                            </Link>
                        </nav>

                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className={`md:hidden p-2 rounded-lg transition-colors ${scrolled ? 'text-gray-900' : 'text-white'
                                }`}
                        >
                            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>

                {isMenuOpen && (
                    <div className="md:hidden bg-white/95 backdrop-blur-md border-t border-gray-100 animate-fade-in">
                        <div className="px-4 py-4 space-y-3">
                            <Link
                                to="/login"
                                className="block px-4 py-3 text-base font-medium text-gray-700 hover:bg-gray-50 rounded-xl transition-colors"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Iniciar sesión
                            </Link>
                            <Link
                                to="/solicitud-empresa"
                                className="block px-4 py-3 text-base font-semibold text-white bg-[#6EA838] hover:bg-[#5a8f2e] rounded-xl transition-colors text-center"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Solicitar servicio
                            </Link>
                        </div>
                    </div>
                )}
            </header>

            {/* Hero Section con imagen de fondo más visible */}
            <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
                {/* Imagen de fondo */}
                <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                    style={{
                        backgroundImage: `url(${heroBackground})`,
                    }}
                />

                {/* Overlay más claro - solo 50% de oscuridad */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#0B1220]/50 via-[#132035]/40 to-[#1a3a2a]/50" />

                {/* Capa adicional muy sutil para legibilidad */}
                <div className="absolute inset-0 bg-black/20" />

                {/* Efectos de luz sutiles */}
                <div className="absolute top-1/4 -right-20 w-[500px] h-[500px] sm:w-[600px] sm:h-[600px] bg-[#6EA838]/10 rounded-full blur-[120px]" />
                <div className="absolute -bottom-20 -left-20 w-[400px] h-[400px] sm:w-[500px] sm:h-[500px] bg-blue-500/5 rounded-full blur-[100px]" />

                {/* Contenido centrado */}
                <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    {/* Badge */}
                    <div className="animate-fade-in-up inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[#8BC34A] text-xs sm:text-sm font-medium mb-8">
                        <Leaf size={14} className="sm:w-4 sm:h-4" />
                        Inteligencia que transforma residuos
                    </div>

                    {/* Título principal */}
                    <h1 className="animate-fade-in-up delay-100 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white tracking-tight leading-tight mb-6">
                        Gestión inteligente de{' '}
                        <span className="gradient-text">contenedores</span>{' '}
                        con IoT
                    </h1>

                    {/* Subtítulo */}
                    <p className="animate-fade-in-up delay-200 text-base sm:text-lg md:text-xl text-white/90 max-w-3xl mx-auto leading-relaxed mb-10">
                        Monitorea el llenado en tiempo real, recibe alertas, optimiza rutas de
                        recolección y administra toda tu flota desde un único panel de control.
                    </p>

                    {/* Botones CTA */}
                    <div className="animate-fade-in-up delay-300 flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link
                            to="/solicitud-empresa"
                            className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#6EA838] hover:bg-[#5a8f2e] text-white font-bold rounded-2xl transition-all duration-300 shadow-xl shadow-[#6EA838]/30 hover:shadow-[#6EA838]/50 hover:-translate-y-1"
                        >
                            <Building2 size={20} />
                            Soy una empresa
                            <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                        </Link>
                        <Link
                            to="/register"
                            className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-2xl transition-all duration-300 border border-white/30 hover:border-white/50 backdrop-blur-sm hover:-translate-y-1"
                        >
                            <User size={20} />
                            Soy particular
                        </Link>
                    </div>

                    {/* Indicador de scroll */}
                    <div className="animate-fade-in-up delay-400 mt-16 flex flex-col items-center gap-2 text-white/60 text-xs font-medium">
                        <span>Descubre más</span>
                        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center p-1">
                            <div className="w-1.5 h-3 bg-[#6EA838] rounded-full animate-bounce" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="relative py-16 sm:py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
                        {stats.map((stat, index) => {
                            const Icon = stat.icon
                            return (
                                <div
                                    key={index}
                                    className="text-center p-6 rounded-2xl bg-gray-50 hover:bg-[#6EA838]/5 transition-colors duration-300"
                                >
                                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#6EA838]/10 text-[#6EA838] mb-3">
                                        <Icon size={24} />
                                    </div>
                                    <div className="text-3xl sm:text-4xl font-black text-gray-900 mb-1">
                                        {stat.value}
                                    </div>
                                    <div className="text-sm text-gray-500 font-medium">
                                        {stat.label}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 sm:py-28 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12 sm:mb-16">
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 tracking-tight">
                            ¿Qué ofrece <span className="text-[#6EA838]">BINOVA</span>?
                        </h2>
                        <p className="text-gray-500 mt-4 text-base sm:text-lg max-w-2xl mx-auto px-4">
                            Plataforma multi-organización con sensores de última generación y herramientas de operación en campo.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {features.map((f, index) => {
                            const Icon = f.icon
                            return (
                                <div
                                    key={f.title}
                                    className="group relative p-6 sm:p-8 rounded-3xl bg-white border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-[#6EA838]/10 hover:border-[#6EA838]/30 hover:-translate-y-2 transition-all duration-300"
                                >
                                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${f.color} text-white flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                                        <Icon size={24} />
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-2">{f.title}</h3>
                                    <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </section>

            {/* How it Works */}
            <section className="py-20 sm:py-28 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                        <div>
                            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight mb-6">
                                Implementación simple,{' '}
                                <span className="text-[#6EA838]">resultados extraordinarios</span>
                            </h2>
                            <p className="text-gray-500 text-lg mb-8 leading-relaxed">
                                En menos de 48 horas tendrás tu sistema de monitoreo inteligente operativo y optimizando tus rutas de recolección.
                            </p>

                            <div className="space-y-4">
                                {benefits.map((benefit, index) => {
                                    const Icon = benefit.icon
                                    return (
                                        <div key={index} className="flex items-center gap-3">
                                            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#6EA838]/10 text-[#6EA838] flex items-center justify-center">
                                                <Icon size={14} />
                                            </div>
                                            <span className="text-gray-700 font-medium">{benefit.text}</span>
                                        </div>
                                    )
                                })}
                            </div>

                            <Link
                                to="/solicitud-empresa"
                                className="inline-flex items-center gap-2 mt-8 px-6 py-3 bg-[#6EA838] hover:bg-[#5a8f2e] text-white font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-[#6EA838]/25 hover:shadow-[#6EA838]/40"
                            >
                                Comenzar ahora
                                <ArrowRight size={18} />
                            </Link>
                        </div>

                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-[#6EA838] to-[#8BC34A] rounded-3xl transform rotate-3 opacity-20" />
                            <div className="relative bg-gray-50 rounded-3xl p-8 border border-gray-100">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-4">
                                        <div className="bg-white p-4 rounded-2xl shadow-sm">
                                            <Smartphone className="text-[#6EA838] mb-2" size={32} />
                                            <div className="text-sm font-semibold text-gray-900">App móvil</div>
                                            <div className="text-xs text-gray-500">Control total</div>
                                        </div>
                                        <div className="bg-white p-4 rounded-2xl shadow-sm">
                                            <Globe className="text-blue-500 mb-2" size={32} />
                                            <div className="text-sm font-semibold text-gray-900">Web dashboard</div>
                                            <div className="text-xs text-gray-500">Acceso 24/7</div>
                                        </div>
                                    </div>
                                    <div className="space-y-4 pt-8">
                                        <div className="bg-white p-4 rounded-2xl shadow-sm">
                                            <Shield className="text-purple-500 mb-2" size={32} />
                                            <div className="text-sm font-semibold text-gray-900">Seguro</div>
                                            <div className="text-xs text-gray-500">Datos protegidos</div>
                                        </div>
                                        <div className="bg-white p-4 rounded-2xl shadow-sm">
                                            <Zap className="text-yellow-500 mb-2" size={32} />
                                            <div className="text-sm font-semibold text-gray-900">Rápido</div>
                                            <div className="text-xs text-gray-500">Tiempo real</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="relative py-20 sm:py-28 bg-[#0B1220] overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_#6EA838_0%,_transparent_70%)] opacity-10" />
                <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
                        ¿Listo para digitalizar tu recolección?
                    </h2>
                    <p className="text-gray-400 mt-4 mb-10 text-lg max-w-2xl mx-auto">
                        Únete a las organizaciones que ya optimizan sus recursos y reducen costos operativos con datos en tiempo real.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Link
                            to="/solicitud-empresa"
                            className="px-8 py-4 bg-[#6EA838] hover:bg-[#5a8f2e] text-white font-bold rounded-2xl transition-all duration-300 shadow-lg shadow-[#6EA838]/25 hover:shadow-[#6EA838]/40 hover:-translate-y-1"
                        >
                            Solicitar para mi empresa
                        </Link>
                        <Link
                            to="/login"
                            className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white font-semibold rounded-2xl transition-all duration-300 border border-white/10 hover:border-white/20 hover:-translate-y-1"
                        >
                            Ya tengo una cuenta
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-white border-t border-gray-100 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-3">
                            <img src={logo} alt="BINOVA" className="h-8 w-8 opacity-80" />
                            <span className="text-sm font-semibold text-gray-500">
                                © {new Date().getFullYear()} BINOVA. Todos los derechos reservados.
                            </span>
                        </div>
                        <div className="flex gap-6 text-sm font-medium text-gray-500">
                            <Link to="/login" className="hover:text-[#6EA838] transition-colors">Login</Link>
                            <Link to="/register" className="hover:text-[#6EA838] transition-colors">Registro</Link>
                            <Link to="/solicitud-empresa" className="hover:text-[#6EA838] transition-colors">Empresas</Link>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    )
}
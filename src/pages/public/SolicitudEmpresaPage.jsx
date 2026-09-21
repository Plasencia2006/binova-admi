import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
    Building2,
    User,
    Mail,
    MessageSquare,
    CheckCircle,
    ArrowLeft,
    ShieldCheck,
    Zap,
    Clock,
    Send,
    Leaf
} from 'lucide-react'
import { organizacionService } from '../../services/organizacionService'
import logo from '../../assets/logo-binova-icono.png'
import iotBackground from '../../assets/fondo_servicio.jpg'

export default function SolicitudEmpresaPage() {
    const [form, setForm] = useState({
        nombre: '',
        contacto_nombre: '',
        contacto_correo: '',
        mensaje: '',
    })
    const [errors, setErrors] = useState({})
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [errorMsg, setErrorMsg] = useState('')

    const handleChange = (e) => {
        const { name, value } = e.target
        setForm((prev) => ({ ...prev, [name]: value }))
        if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }))
    }

    const validate = () => {
        const e = {}
        if (!form.nombre.trim()) e.nombre = 'Nombre de la empresa obligatorio'
        if (!form.contacto_nombre.trim()) e.contacto_nombre = 'Nombre de contacto obligatorio'
        if (!form.contacto_correo.trim()) {
            e.contacto_correo = 'Correo obligatorio'
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.contacto_correo)) {
            e.contacto_correo = 'Correo no válido'
        }
        setErrors(e)
        return Object.keys(e).length === 0
    }

    const handleSubmit = async (ev) => {
        ev.preventDefault()
        setErrorMsg('')
        if (!validate()) return

        setLoading(true)
        try {
            await organizacionService.solicitar({
                nombre: form.nombre.trim(),
                contacto_nombre: form.contacto_nombre.trim(),
                contacto_correo: form.contacto_correo.trim(),
                mensaje: form.mensaje.trim() || undefined,
            })
            setSuccess(true)
        } catch (err) {
            const msg =
                err.response?.data?.message ||
                err.response?.data?.error ||
                'No se pudo enviar la solicitud. Intenta más tarde.'
            setErrorMsg(typeof msg === 'string' ? msg : 'Error al enviar')
        } finally {
            setLoading(false)
        }
    }

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4 relative">
                <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                    style={{ backgroundImage: `url(${iotBackground})` }}
                />
                <div className="absolute inset-0 bg-[#0B1220]/85" />

                <style>{`
                    @keyframes scaleIn {
                        from { opacity: 0; transform: scale(0.9); }
                        to { opacity: 1; transform: scale(1); }
                    }
                    .animate-scale-in {
                        animation: scaleIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                    }
                `}</style>

                <div className="relative z-10 bg-white/95 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-8 sm:p-10 max-w-md w-full text-center animate-scale-in">
                    <div className="w-20 h-20 rounded-full bg-[#6EA838]/10 text-[#6EA838] flex items-center justify-center mx-auto mb-6">
                        <CheckCircle size={40} />
                    </div>
                    <h1 className="text-2xl font-black text-gray-900">¡Solicitud enviada!</h1>
                    <p className="text-gray-600 mt-3 leading-relaxed">
                        Recibimos la solicitud de <strong className="text-gray-900">{form.nombre}</strong>.
                        Nuestro equipo la revisará y se pondrá en contacto al correo{' '}
                        <strong className="text-gray-900">{form.contacto_correo}</strong> en las próximas 24 horas.
                    </p>
                    <Link
                        to="/"
                        className="inline-flex items-center justify-center gap-2 mt-8 w-full px-6 py-3.5 bg-[#6EA838] hover:bg-[#5a8f2e] text-white font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-[#6EA838]/25 hover:shadow-[#6EA838]/40"
                    >
                        Volver al inicio
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen relative overflow-hidden">
            <style>{`
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(30px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes slideInLeft {
                    from { opacity: 0; transform: translateX(-30px); }
                    to { opacity: 1; transform: translateX(0); }
                }
                @keyframes slideInRight {
                    from { opacity: 0; transform: translateX(30px); }
                    to { opacity: 1; transform: translateX(0); }
                }
                .animate-fade-in-up {
                    animation: fadeInUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                    opacity: 0;
                }
                .animate-slide-in-left {
                    animation: slideInLeft 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                    opacity: 0;
                }
                .animate-slide-in-right {
                    animation: slideInRight 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                    opacity: 0;
                }
                .delay-100 { animation-delay: 0.1s; }
                .delay-200 { animation-delay: 0.2s; }
                .delay-300 { animation-delay: 0.3s; }
            `}</style>

            {/* Imagen de fondo */}
            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat bg-fixed"
                style={{ backgroundImage: `url(${iotBackground})` }}
            />

            {/* Overlay oscuro */}
            <div className="absolute inset-0 bg-[#0B1220]/75" />

            {/* Contenido principal */}
            <div className="relative z-10 min-h-screen flex flex-col lg:flex-row">

                {/* Panel Izquierdo: Branding */}
                <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-8 xl:p-12">
                    <div className="max-w-lg w-full animate-slide-in-left">
                        {/* Logo */}
                        <Link to="/" className="flex items-center gap-3 group w-fit mb-10">
                            <img src={logo} alt="BINOVA" className="h-10 w-10 object-contain transition-transform duration-300 group-hover:scale-110" />
                            <span className="font-black text-xl tracking-tight text-white">
                                <span className="text-[#6EA838]">BÍ</span>NOVA
                            </span>
                        </Link>

                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#6EA838]/20 border border-[#6EA838]/30 backdrop-blur-sm mb-6">
                            <Leaf size={14} className="text-[#8BC34A]" />
                            <span className="text-xs font-medium text-[#8BC34A]">Solución empresarial</span>
                        </div>

                        {/* Título */}
                        <h2 className="text-4xl xl:text-5xl font-black leading-tight mb-8 text-white">
                            Digitaliza la gestión de{' '}
                            <span className="text-[#6EA838]">tus residuos</span>{' '}
                            hoy.
                        </h2>

                        {/* Beneficios */}
                        <div className="space-y-5">
                            {[
                                { icon: ShieldCheck, text: 'Plataforma segura y multi-organización.' },
                                { icon: Zap, text: 'Implementación rápida de sensores IoT.' },
                                { icon: Clock, text: 'Respuesta de nuestro equipo en menos de 24h.' }
                            ].map((item, idx) => (
                                <div
                                    key={idx}
                                    className="flex items-start gap-4 animate-slide-in-left"
                                    style={{ animationDelay: `${0.3 + idx * 0.1}s` }}
                                >
                                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-[#6EA838]/20 border border-[#6EA838]/30 text-[#6EA838] flex items-center justify-center">
                                        <item.icon size={20} />
                                    </div>
                                    <p className="text-gray-200 font-medium pt-2.5 text-base">{item.text}</p>
                                </div>
                            ))}
                        </div>

                        {/* Footer */}
                        <div className="mt-10 pt-8 border-t border-white/10 text-sm text-gray-400">
                            © {new Date().getFullYear()} BINOVA. Todos los derechos reservados.
                        </div>
                    </div>
                </div>

                {/* Panel Derecho: Formulario */}
                <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8 xl:p-12">
                    <div className="w-full max-w-lg">

                        {/* Header móvil */}
                        <div className="lg:hidden mb-6 flex items-center justify-between">
                            <Link to="/" className="flex items-center gap-2 text-sm font-medium text-white/80 hover:text-white transition-colors">
                                <ArrowLeft size={18} />
                                Inicio
                            </Link>
                            <Link to="/" className="flex items-center gap-2">
                                <img src={logo} alt="BINOVA" className="h-8 w-8" />
                                <span className="font-black text-sm text-white">
                                    <span className="text-[#6EA838]">BÍ</span>NOVA
                                </span>
                            </Link>
                        </div>

                        {/* Formulario con glassmorphism sutil */}
                        <div className="bg-white/95 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-8 sm:p-10 animate-slide-in-right">

                            {/* Header del formulario */}
                            <div className="mb-8">
                                <div className="w-14 h-14 rounded-2xl bg-[#6EA838]/10 text-[#6EA838] flex items-center justify-center mb-5">
                                    <Building2 size={24} />
                                </div>
                                <h1 className="text-3xl xl:text-4xl font-black text-gray-900 tracking-tight mb-3">
                                    Solicitar servicio
                                </h1>
                                <p className="text-gray-600 text-base leading-relaxed">
                                    Completa el formulario para empresas. Un administrador revisará y activará tu organización.
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                {errorMsg && (
                                    <div className="p-4 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl flex items-center gap-2">
                                        <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                                            <span className="text-xs font-bold">!</span>
                                        </div>
                                        {errorMsg}
                                    </div>
                                )}

                                <div className="space-y-5">
                                    {/* Nombre de la empresa */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-800 mb-2">
                                            Nombre de la empresa <span className="text-[#6EA838]">*</span>
                                        </label>
                                        <div className="relative group">
                                            <Building2 size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#6EA838] transition-colors" />
                                            <input
                                                name="nombre"
                                                value={form.nombre}
                                                onChange={handleChange}
                                                placeholder="Ej. Municipalidad / Empresa SAC"
                                                className={`w-full pl-12 pr-4 py-3.5 border-2 rounded-xl text-sm font-medium focus:outline-none focus:ring-0 transition-all duration-200 bg-white/80 ${errors.nombre
                                                        ? 'border-red-300 focus:border-red-500'
                                                        : 'border-gray-200 focus:border-[#6EA838] hover:border-gray-300'
                                                    }`}
                                            />
                                        </div>
                                        {errors.nombre && <p className="text-xs text-red-500 mt-1.5 font-medium">{errors.nombre}</p>}
                                    </div>

                                    {/* Nombre de contacto */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-800 mb-2">
                                            Nombre de contacto <span className="text-[#6EA838]">*</span>
                                        </label>
                                        <div className="relative group">
                                            <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#6EA838] transition-colors" />
                                            <input
                                                name="contacto_nombre"
                                                value={form.contacto_nombre}
                                                onChange={handleChange}
                                                placeholder="Persona responsable"
                                                className={`w-full pl-12 pr-4 py-3.5 border-2 rounded-xl text-sm font-medium focus:outline-none focus:ring-0 transition-all duration-200 bg-white/80 ${errors.contacto_nombre
                                                        ? 'border-red-300 focus:border-red-500'
                                                        : 'border-gray-200 focus:border-[#6EA838] hover:border-gray-300'
                                                    }`}
                                            />
                                        </div>
                                        {errors.contacto_nombre && <p className="text-xs text-red-500 mt-1.5 font-medium">{errors.contacto_nombre}</p>}
                                    </div>

                                    {/* Correo de contacto */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-800 mb-2">
                                            Correo de contacto <span className="text-[#6EA838]">*</span>
                                        </label>
                                        <div className="relative group">
                                            <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#6EA838] transition-colors" />
                                            <input
                                                type="email"
                                                name="contacto_correo"
                                                value={form.contacto_correo}
                                                onChange={handleChange}
                                                placeholder="contacto@empresa.com"
                                                className={`w-full pl-12 pr-4 py-3.5 border-2 rounded-xl text-sm font-medium focus:outline-none focus:ring-0 transition-all duration-200 bg-white/80 ${errors.contacto_correo
                                                        ? 'border-red-300 focus:border-red-500'
                                                        : 'border-gray-200 focus:border-[#6EA838] hover:border-gray-300'
                                                    }`}
                                            />
                                        </div>
                                        {errors.contacto_correo && <p className="text-xs text-red-500 mt-1.5 font-medium">{errors.contacto_correo}</p>}
                                    </div>

                                    {/* Mensaje */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-800 mb-2">
                                            Mensaje <span className="text-gray-400 font-normal">(opcional)</span>
                                        </label>
                                        <div className="relative group">
                                            <MessageSquare size={18} className="absolute left-4 top-4 text-gray-400 group-focus-within:text-[#6EA838] transition-colors" />
                                            <textarea
                                                name="mensaje"
                                                value={form.mensaje}
                                                onChange={handleChange}
                                                rows={3}
                                                placeholder="Cuéntanos brevemente sobre tu necesidad o cantidad de contenedores..."
                                                className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-0 focus:border-[#6EA838] hover:border-gray-300 transition-all duration-200 resize-none bg-white/80"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Botón de envío */}
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-4 bg-[#6EA838] hover:bg-[#5a8f2e] text-white font-bold rounded-xl transition-all duration-300 shadow-lg shadow-[#6EA838]/25 hover:shadow-[#6EA838]/40 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:shadow-none flex items-center justify-center gap-2 mt-2 group"
                                >
                                    {loading ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            Enviando solicitud...
                                        </>
                                    ) : (
                                        <>
                                            Enviar solicitud
                                            <Send size={18} className="transition-transform group-hover:translate-x-1" />
                                        </>
                                    )}
                                </button>

                                {/* Link de registro */}
                                <p className="text-sm text-center text-gray-600 pt-2">
                                    ¿Eres usuario particular?{' '}
                                    <Link to="/register" className="text-[#6EA838] font-semibold hover:underline transition-all">
                                        Regístrate aquí
                                    </Link>
                                </p>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
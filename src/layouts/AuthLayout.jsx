import { Outlet } from 'react-router-dom'
import logo from '../assets/logo-binova-icono.png'
import fondo from '../assets/fondoo.jpg'

export default function AuthLayout() {
    return (
        <div
            className="min-h-screen flex items-center justify-center p-4 relative"
            style={{
                backgroundImage: `url(${fondo})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
            }}
        >
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/50"></div>

            <div className="w-full max-w-md relative z-10">
                {/* Logo (siempre visible) */}
                <div className="text-center mb-8">
                    <img
                        src={logo}
                        alt="BINOVA"
                        className="h-16 mx-auto mb-4 drop-shadow-lg"
                    />
                    <h1 className="text-3xl font-black font-['Montserrat'] tracking-wider uppercase text-[#ffffff]">
                        <span className="text-[#6EA838]">BÍ</span>NOVA
                    </h1>
                    <p className="text-gray-300 text-sm mt-1 drop-shadow">
                        Inteligencia que transforma residuos
                    </p>
                </div>

                {/* Aquí se renderiza Login o Register */}
                <Outlet />
            </div>
        </div>
    )
}
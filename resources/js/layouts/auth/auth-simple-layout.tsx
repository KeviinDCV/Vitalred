import AppLogoIcon from '@/components/app-logo-icon';
import { Link } from '@inertiajs/react';
import { type PropsWithChildren, useState, useEffect } from 'react';

interface AuthLayoutProps {
    name?: string;
    title?: string;
    description?: string;
    showHeader?: boolean;
}

export default function AuthSimpleLayout({ children, title, description, showHeader = true }: PropsWithChildren<AuthLayoutProps>) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const images = ['/images/1.png', '/images/2.png', '/images/3.png'];

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, 4000);

        return () => clearInterval(interval);
    }, [images.length]);

    return (
        <div className="flex h-screen w-full overflow-hidden bg-slate-100">
            {/* Lado izquierdo - Formulario (1/3 en desktop) */}
            <div className="w-full lg:w-1/3 flex flex-col justify-center items-center p-6 sm:p-8 lg:p-12 bg-white shadow-xl z-10 overflow-y-auto">
                <div className="w-full max-w-md">
                    {/* Header con Logo HERMES */}
                    {showHeader && (
                        <div className="text-center mb-6 sm:mb-8">
                            <Link href={route('home')} className="inline-block">
                                <AppLogoIcon size={100} className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 mx-auto mb-2" />
                                <h1 className="text-3xl sm:text-4xl font-bold text-primary tracking-tight">
                                    HERMES
                                </h1>
                            </Link>
                        </div>
                    )}

                    {/* Card del formulario */}
                    <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-200">
                        {/* Título y descripción */}
                        <div className="text-center mb-5 sm:mb-6">
                            <h2 className="text-xl sm:text-2xl font-semibold text-slate-800">{title}</h2>
                            <p className="text-xs sm:text-sm text-slate-500 mt-1">{description}</p>
                        </div>

                        {/* Contenido del formulario */}
                        {children}
                    </div>

                    {/* Footer */}
                    <p className="text-xs text-center text-slate-400 mt-6 sm:mt-8">
                        © 2025 Hospital Universitario Del Valle. Todos los derechos reservados.
                    </p>
                </div>
            </div>

            {/* Lado derecho - Imagen/Carrusel (2/3 en desktop) */}
            <div className="hidden lg:flex lg:w-2/3 relative bg-primary items-center justify-center overflow-hidden">
                {/* Overlay gradiente */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-900 to-primary opacity-90 mix-blend-multiply z-10"></div>

                {/* Patrón de fondo decorativo */}
                <div className="absolute inset-0 opacity-5 z-0" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                }}></div>

                {/* Contenido principal */}
                <div className="relative z-20 w-full max-w-5xl px-8 flex flex-col items-center">
                    {/* Logo HUV */}
                    <div className="mb-8 text-center text-white opacity-90">
                        <div className="flex flex-col items-center justify-center mb-4">
                            <img
                                src="/images/huv-h.png"
                                alt="Hospital Universitario del Valle"
                                className="h-28 xl:h-36 w-auto object-contain filter drop-shadow-lg"
                            />
                        </div>
                    </div>

                    {/* Título de bienvenida */}
                    <h2 className="text-4xl xl:text-5xl font-bold text-white mb-10 xl:mb-12 drop-shadow-lg text-center">
                        Bienvenido a <span className="text-blue-200">HERMES</span>
                    </h2>

                    {/* Carrusel de imágenes */}
                    <div className="relative w-full aspect-video max-h-[450px] xl:max-h-[500px] rounded-2xl overflow-hidden shadow-2xl border-4 border-white/10">
                        <div
                            className="flex transition-transform duration-1000 ease-in-out h-full"
                            style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}
                        >
                            {images.map((image, index) => (
                                <div key={index} className="w-full h-full flex-shrink-0 relative">
                                    <img
                                        src={image}
                                        alt={`Imagen ${index + 1} de HERMES`}
                                        className="w-full h-full object-cover"
                                        loading={index === 0 ? "eager" : "lazy"}
                                        decoding="async"
                                    />
                                    {/* Overlay gradiente */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                                </div>
                            ))}
                        </div>

                        {/* Indicadores de navegación */}
                        <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 flex space-x-3">
                            {images.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentImageIndex(index)}
                                    className={`w-3 h-3 rounded-full transition-all duration-300 shadow-md ${currentImageIndex === index
                                        ? 'bg-white opacity-100 scale-110'
                                        : 'bg-white opacity-40 hover:opacity-75'
                                        }`}
                                    aria-label={`Ir a imagen ${index + 1}`}
                                />
                            ))}
                        </div>

                        {/* Etiquetas en la imagen */}
                        <div className="absolute bottom-14 left-6 text-white max-w-md">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded">Referencia</span>
                                <span className="bg-primary text-white text-xs font-bold px-2 py-0.5 rounded">Contrareferencia</span>
                            </div>
                            <h3 className="text-2xl xl:text-3xl font-bold leading-tight mb-1">Sistema de Referencia</h3>
                            <p className="text-sm text-gray-200">Coordinación eficiente de referencias y contrareferencias entre instituciones de salud.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

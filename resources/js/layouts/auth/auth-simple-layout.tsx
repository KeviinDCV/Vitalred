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
        }, 4000); // Cambiar imagen cada 4 segundos

        return () => clearInterval(interval);
    }, [images.length]);

    return (
        <div className="flex min-h-screen w-full max-w-full bg-slate-50 overflow-hidden">
            {/* Lado izquierdo - Formulario de Login */}
            <div className="flex flex-1 flex-col px-5 py-6 sm:px-8 sm:py-8 md:px-12 md:py-10 lg:flex-none lg:px-16 lg:py-8 xl:px-24 bg-slate-100 overflow-y-auto">
                <div className="mx-auto w-full max-w-[420px] sm:max-w-md md:max-w-lg lg:max-w-md lg:w-full">
                    {/* Header con Logo y Título Principal - Compacto con animación */}
                    {showHeader && (
                        <div className="mb-6 sm:mb-7 md:mb-8 text-center">
                            <Link href={route('home')} className="inline-block group">
                                <div className="mx-auto relative">
                                    <AppLogoIcon size={100} className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-[120px] lg:h-[120px] transition-transform duration-300 group-hover:scale-105 filter drop-shadow-[0_4px_6px_rgba(0,0,0,0.1)] group-hover:drop-shadow-[0_8px_16px_rgba(0,0,0,0.15)]" />
                                    {/* Título HERMES con animación suave */}
                                    <h1 className="text-2xl sm:text-3xl md:text-3xl lg:text-4xl font-bold text-primary tracking-tight leading-tight drop-shadow-sm mt-2 sm:mt-3 md:mt-4 animate-[slideUp_0.6s_ease-out]">
                                        HERMES
                                    </h1>
                                </div>
                                <span className="sr-only">Ir al inicio</span>
                            </Link>
                        </div>
                    )}

                    {/* Sección de Login - Responsive spacing */}
                    <div className="space-y-4 sm:space-y-5">
                        <div className="text-center space-y-1 sm:space-y-1.5">
                            <h2 className="text-xl sm:text-2xl md:text-2xl font-semibold text-slate-800">{title}</h2>
                            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed px-2 sm:px-0">{description}</p>
                        </div>

                        {/* Formulario - Layer 3: Responsive padding & shadow */}
                        <div className="bg-gradient-to-b from-white to-slate-50/30 rounded-xl sm:rounded-2xl p-6 sm:p-7 md:p-8 shadow-[0_1px_2px_rgba(0,0,0,0.05),0_8px_24px_rgba(0,0,0,0.08)] before:absolute before:inset-0 before:rounded-xl sm:before:rounded-2xl before:shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] before:pointer-events-none relative">
                            {children}
                        </div>
                    </div>
                </div>
            </div>

            {/* Lado derecho - Espacio para imágenes/videos - Purposeful display */}
            <div className="relative hidden lg:flex w-0 flex-1 lg:w-1/2 xl:w-[55%]">
                <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/95 to-primary/80 flex items-center justify-center overflow-hidden">
                    {/* Elementos decorativos de fondo - Scaled for viewport */}
                    <div className="absolute top-8 right-8 lg:top-10 lg:right-10 w-24 h-24 lg:w-32 lg:h-32 bg-white/10 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-16 left-8 lg:bottom-20 lg:left-10 w-20 h-20 lg:w-24 lg:h-24 bg-white/5 rounded-full blur-2xl"></div>
                    <div className="absolute top-1/3 left-1/4 w-12 h-12 lg:w-16 lg:h-16 bg-white/10 rounded-full blur-xl"></div>

                    {/* Contenedor principal - Fluid sizing */}
                    <div className="relative z-10 text-center text-white p-8 lg:p-10 xl:p-12 w-full">
                        <div className="mb-8 lg:mb-10 xl:mb-12">
                            <h2 className="text-3xl lg:text-4xl xl:text-4xl font-bold mb-4 lg:mb-6 leading-tight">
                                Bienvenido a
                                <span className="text-white/90"> HERMES</span>
                            </h2>
                        </div>

                        {/* Carousel de imágenes - Fluid height & spacing */}
                        <div className="w-full max-w-3xl lg:max-w-4xl h-[22rem] lg:h-[26rem] xl:h-[28rem] mx-auto rounded-xl lg:rounded-2xl overflow-hidden shadow-[0_4px_6px_rgba(0,0,0,0.2),0_24px_48px_rgba(0,0,0,0.3)] relative">
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
                                        {/* Overlay sutil para mejor contraste */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                                    </div>
                                ))}
                            </div>
                            
                            {/* Indicadores de navegación - Responsive positioning */}
                            <div className="absolute bottom-3 lg:bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                                {images.map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setCurrentImageIndex(index)}
                                        className={`w-3 h-3 rounded-full transition-all duration-300 ${
                                            currentImageIndex === index
                                                ? 'bg-white shadow-[0_1px_2px_rgba(0,0,0,0.2),0_2px_8px_rgba(255,255,255,0.4)] scale-110'
                                                : 'bg-white/50 hover:bg-white/70 shadow-[0_1px_2px_rgba(0,0,0,0.15)]'
                                        }`}
                                        aria-label={`Ir a imagen ${index + 1}`}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

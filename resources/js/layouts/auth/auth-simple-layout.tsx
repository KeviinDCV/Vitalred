import AppLogoIcon from '@/components/app-logo-icon';
import { Link } from '@inertiajs/react';
import { type PropsWithChildren, useState, useEffect } from 'react';

/*
  RESPONSIVE DESIGN PRINCIPLES:
  
  Principle 1 - Box System:
  - Main container: flex row (desktop) / flex col (mobile)
  - Left box: Form area (full mobile, 1/3 desktop)
  - Right box: Branding/Carousel (hidden mobile, 2/3 desktop)
  - Each box has clear padding progression: p-4 → p-6 → p-8 → p-12
  
  Principle 2 - Rearrange with Purpose:
  - Mobile (<1024px): Single column, form centered, minimal branding in header
  - Desktop (≥1024px): Two columns, rich branding experience on right
  - Elements shift and reprioritize, not just shrink
  
  Breakpoints:
  - Mobile: < 640px (compact, essential only)
  - Tablet: 640px - 1023px (balanced, some breathing room)
  - Desktop: ≥ 1024px (full experience, two columns)
*/

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
        <div className="flex min-h-screen min-h-[100dvh] w-full overflow-hidden bg-slate-100">
            {/* ══════════════════════════════════════════════════════════════
                BOX 1: FORM AREA
                - Mobile: Full width, vertical scroll, compact padding
                - Tablet: Full width, more breathing room
                - Desktop: 1/3 width, generous padding
               ══════════════════════════════════════════════════════════════ */}
            <div className="
                w-full lg:w-1/3 
                flex flex-col justify-center items-center 
                p-4 sm:p-6 md:p-8 lg:p-12 
                bg-white shadow-xl z-10 
                overflow-y-auto
            ">
                <div className="w-full max-w-sm sm:max-w-md">
                    {/* Header con Logo HERMES - Responsive sizing */}
                    {showHeader && (
                        <div className="text-center mb-4 sm:mb-6 lg:mb-8">
                            <Link href={route('home')} className="inline-block">
                                <AppLogoIcon 
                                    size={100} 
                                    className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 mx-auto mb-1 sm:mb-2" 
                                />
                                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary tracking-tight">
                                    HERMES
                                </h1>
                            </Link>
                        </div>
                    )}

                    {/* Card del formulario - Progressive padding */}
                    <div className="
                        bg-white 
                        p-4 sm:p-6 md:p-8 
                        rounded-xl sm:rounded-2xl 
                        shadow-sm border border-slate-200
                    ">
                        {/* Título y descripción */}
                        <div className="text-center mb-4 sm:mb-5 lg:mb-6">
                            <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-slate-800">
                                {title}
                            </h2>
                            <p className="text-xs sm:text-sm text-slate-500 mt-0.5 sm:mt-1">
                                {description}
                            </p>
                        </div>

                        {/* Contenido del formulario */}
                        {children}
                    </div>

                    {/* Footer - Visible en todos los tamaños */}
                    <p className="text-[10px] sm:text-xs text-center text-slate-400 mt-4 sm:mt-6 lg:mt-8">
                        © 2025 Hospital Universitario Del Valle. Todos los derechos reservados.
                    </p>
                </div>
            </div>

            {/* ══════════════════════════════════════════════════════════════
                BOX 2: BRANDING/CAROUSEL AREA
                - Mobile/Tablet: Hidden (reorganized, not just shrunk)
                - Desktop: 2/3 width, full branding experience
               ══════════════════════════════════════════════════════════════ */}
            <div className="
                hidden lg:flex 
                lg:w-2/3 
                relative bg-primary 
                items-center justify-center 
                overflow-hidden
            ">
                {/* Overlay gradiente */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-900 to-primary opacity-90 mix-blend-multiply z-10" />

                {/* Patrón de fondo decorativo */}
                <div 
                    className="absolute inset-0 opacity-5 z-0" 
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                    }}
                />

                {/* Contenido principal - Progressive sizing */}
                <div className="relative z-20 w-full max-w-4xl xl:max-w-5xl px-6 xl:px-8 flex flex-col items-center">
                    {/* Logo HUV */}
                    <div className="mb-6 xl:mb-8 text-center text-white opacity-90">
                        <img
                            src="/images/huv-h.png"
                            alt="Hospital Universitario del Valle"
                            className="h-24 xl:h-32 2xl:h-36 w-auto object-contain filter drop-shadow-lg mx-auto"
                        />
                    </div>

                    {/* Título de bienvenida */}
                    <h2 className="text-3xl xl:text-4xl 2xl:text-5xl font-bold text-white mb-8 xl:mb-10 2xl:mb-12 drop-shadow-lg text-center">
                        Bienvenido a <span className="text-blue-200">HERMES</span>
                    </h2>

                    {/* Carrusel de imágenes - Responsive aspect ratio */}
                    <div className="
                        relative w-full 
                        aspect-video 
                        max-h-[380px] xl:max-h-[450px] 2xl:max-h-[500px] 
                        rounded-xl xl:rounded-2xl 
                        overflow-hidden shadow-2xl 
                        border-2 xl:border-4 border-white/10
                    ">
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
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                                </div>
                            ))}
                        </div>

                        {/* Indicadores de navegación */}
                        <div className="absolute bottom-4 xl:bottom-5 left-1/2 transform -translate-x-1/2 flex space-x-2 xl:space-x-3">
                            {images.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentImageIndex(index)}
                                    className={`
                                        w-2.5 h-2.5 xl:w-3 xl:h-3 
                                        rounded-full transition-all duration-300 shadow-md 
                                        ${currentImageIndex === index
                                            ? 'bg-white opacity-100 scale-110'
                                            : 'bg-white opacity-40 hover:opacity-75'
                                        }
                                    `}
                                    aria-label={`Ir a imagen ${index + 1}`}
                                />
                            ))}
                        </div>

                        {/* Etiquetas en la imagen */}
                        <div className="absolute bottom-12 xl:bottom-14 left-4 xl:left-6 text-white max-w-sm xl:max-w-md">
                            <div className="flex items-center gap-1.5 xl:gap-2 mb-1.5 xl:mb-2">
                                <span className="bg-red-600 text-white text-[10px] xl:text-xs font-bold px-1.5 xl:px-2 py-0.5 rounded">
                                    Referencia
                                </span>
                                <span className="bg-primary text-white text-[10px] xl:text-xs font-bold px-1.5 xl:px-2 py-0.5 rounded">
                                    Contrareferencia
                                </span>
                            </div>
                            <h3 className="text-xl xl:text-2xl 2xl:text-3xl font-bold leading-tight mb-0.5 xl:mb-1">
                                Sistema de Referencia
                            </h3>
                            <p className="text-xs xl:text-sm text-gray-200 line-clamp-2">
                                Coordinación eficiente de referencias y contrareferencias entre instituciones de salud.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

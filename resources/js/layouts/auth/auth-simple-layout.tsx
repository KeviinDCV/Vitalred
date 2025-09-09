import AppLogoIcon from '@/components/app-logo-icon';
import { Link } from '@inertiajs/react';
import { type PropsWithChildren, useState, useEffect } from 'react';

interface AuthLayoutProps {
    name?: string;
    title?: string;
    description?: string;
}

export default function AuthSimpleLayout({ children, title, description }: PropsWithChildren<AuthLayoutProps>) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const images = ['/images/1.png', '/images/2.png', '/images/3.png'];

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, 4000); // Cambiar imagen cada 4 segundos

        return () => clearInterval(interval);
    }, [images.length]);

    return (
        <div className="flex min-h-screen bg-background">
            {/* Lado izquierdo - Formulario de Login */}
            <div className="flex flex-1 flex-col px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
                <div className="mx-auto w-full max-w-sm lg:w-96">
                    {/* Header con Logo y Título Principal */}
                    <div className="mb-12 text-center">
                        <Link href={route('home')} className="inline-block group mb-8">
                            <div className="mx-auto mb-6">
                                <AppLogoIcon size={120} className="transition-transform duration-300 group-hover:scale-105 drop-shadow-lg" />
                            </div>
                            <span className="sr-only">Ir al inicio</span>
                        </Link>

                        <div className="space-y-3">
                            <h1 className="text-4xl font-bold text-primary tracking-tight leading-tight">
                                Vital Red
                            </h1>
                            <p className="text-base text-muted-foreground font-medium tracking-wide uppercase leading-relaxed max-w-sm mx-auto">
                                Sistema de Referencia y Contrareferencia
                            </p>
                        </div>
                    </div>

                    {/* Sección de Login */}
                    <div className="space-y-6">
                        <div className="text-center space-y-2">
                            <h2 className="text-2xl font-semibold text-foreground">{title}</h2>
                            <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
                        </div>

                        {/* Formulario */}
                        <div className="bg-card border border-border/50 rounded-2xl p-8 shadow-xl">
                            {children}
                        </div>
                    </div>
                </div>
            </div>

            {/* Lado derecho - Espacio para imágenes/videos */}
            <div className="relative hidden w-0 flex-1 lg:block">
                <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-primary/70 flex items-center justify-center overflow-hidden">
                    {/* Elementos decorativos de fondo */}
                    <div className="absolute top-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
                    <div className="absolute bottom-20 left-10 w-24 h-24 bg-white/5 rounded-full blur-lg"></div>
                    <div className="absolute top-1/3 left-1/4 w-16 h-16 bg-white/10 rounded-full blur-md"></div>

                    {/* Contenedor principal */}
                    <div className="relative z-10 text-center text-white p-12 max-w-lg">
                        <div className="mb-12">
                            <h2 className="text-4xl font-bold mb-6 leading-tight">
                                Bienvenido a
                                <span className="text-white/90"> Vital Red</span>
                            </h2>
                        </div>

                        {/* Carousel de imágenes */}
                        <div className="w-full max-w-md h-80 mx-auto rounded-2xl overflow-hidden shadow-2xl relative">
                            <div 
                                className="flex transition-transform duration-1000 ease-in-out h-full"
                                style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}
                            >
                                {images.map((image, index) => (
                                    <div key={index} className="w-full h-full flex-shrink-0 relative">
                                        <img
                                            src={image}
                                            alt={`Imagen ${index + 1} de Vital Red`}
                                            className="w-full h-full object-cover"
                                        />
                                        {/* Overlay sutil para mejor contraste */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                                    </div>
                                ))}
                            </div>
                            
                            {/* Indicadores de navegación */}
                            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                                {images.map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setCurrentImageIndex(index)}
                                        className={`w-3 h-3 rounded-full transition-all duration-300 ${
                                            currentImageIndex === index
                                                ? 'bg-white shadow-lg scale-110'
                                                : 'bg-white/50 hover:bg-white/70'
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

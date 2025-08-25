import AppLogoIcon from '@/components/app-logo-icon';
import { Link } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';

interface AuthLayoutProps {
    name?: string;
    title?: string;
    description?: string;
}

export default function AuthSimpleLayout({ children, title, description }: PropsWithChildren<AuthLayoutProps>) {
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
                                Bienvenido a <br />
                                <span className="text-white/90">Vital Red</span>
                            </h2>
                            <p className="text-lg opacity-90 leading-relaxed">
                                Sistema integral de referencia y contrareferencia para una atención médica coordinada y eficiente.
                            </p>
                        </div>

                        {/* Placeholder mejorado para futuras imágenes/videos */}
                        <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20 shadow-2xl">
                            <div className="w-72 h-48 mx-auto bg-white/10 rounded-2xl flex items-center justify-center border border-white/10">
                                <div className="text-center">
                                    <div className="w-20 h-20 mx-auto mb-4 bg-white/20 rounded-2xl flex items-center justify-center">
                                        <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <p className="text-sm opacity-75 font-medium">Espacio para contenido multimedia</p>
                                    <p className="text-xs opacity-60 mt-1">Imágenes, videos o presentaciones</p>
                                </div>
                            </div>
                        </div>

                        {/* Indicadores decorativos */}
                        <div className="flex justify-center space-x-2 mt-8">
                            <div className="w-2 h-2 bg-white/60 rounded-full"></div>
                            <div className="w-2 h-2 bg-white/40 rounded-full"></div>
                            <div className="w-2 h-2 bg-white/40 rounded-full"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

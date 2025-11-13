import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';
import { Form, Head, Link } from '@inertiajs/react';
import { LoaderCircle, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useState, useEffect } from 'react';
import { ErrorModal } from '@/components/error-modal';

interface LoginProps {
    status?: string;
    throttle_error?: boolean;
    throttle_seconds?: number;
    throttle_minutes?: number;
}

export default function Login({ status, throttle_error, throttle_seconds, throttle_minutes }: LoginProps) {
    const [showPassword, setShowPassword] = useState(false);
    const [showThrottleModal, setShowThrottleModal] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    // Mostrar modal cuando hay error de rate limiting
    useEffect(() => {
        if (throttle_error) {
            setShowThrottleModal(true);
        }
    }, [throttle_error]);

    return (
        <AuthLayout title="Iniciar Sesión" description="Accede a tu cuenta de HERMES">
            <Head title="Iniciar Sesión - HERMES">
                <meta 
                    name="description" 
                    content="Accede a HERMES, el sistema integral de referencia y contrareferencia para una atención médica coordinada y eficiente. Inicia sesión de forma segura." 
                />
            </Head>

            <Form method="post" action={route('login')} resetOnSuccess={['password']} className="space-y-5 sm:space-y-6">
                {({ processing, errors }) => {
                    // Detectar si hay un error de throttle en los errores de validación
                    useEffect(() => {
                        if (errors.email && (
                            errors.email.toLowerCase().includes('too many') ||
                            errors.email.toLowerCase().includes('throttle') ||
                            errors.email.toLowerCase().includes('demasiados') ||
                            errors.email.toLowerCase().includes('intentos')
                        )) {
                            setShowThrottleModal(true);
                        }
                    }, [errors.email]);

                    return (
                    <>
                        <div className="space-y-4 sm:space-y-5">
                            <div className="space-y-1.5 sm:space-y-2">
                                <Label htmlFor="email" className="text-xs sm:text-sm font-medium text-slate-700">
                                    Correo Electrónico
                                </Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 h-3.5 w-3.5 sm:h-4 sm:w-4 -translate-y-1/2 text-slate-400" />
                                    <Input
                                        id="email"
                                        type="email"
                                        name="email"
                                        required
                                        autoFocus
                                        tabIndex={1}
                                        autoComplete="email"
                                        placeholder="correo@ejemplo.com"
                                        className="pl-9 sm:pl-10 h-10 sm:h-11 text-sm sm:text-base bg-gradient-to-b from-slate-50 to-slate-100/50 border-0 shadow-[inset_0_1px_2px_rgba(0,0,0,0.05),inset_0_2px_4px_rgba(0,0,0,0.06)] focus:bg-gradient-to-b focus:from-white focus:to-slate-50/50 focus:shadow-[inset_0_1px_2px_rgba(0,0,0,0.05),inset_0_2px_4px_rgba(0,0,0,0.06),0_0_0_3px_rgba(59,130,246,0.1),0_1px_3px_rgba(59,130,246,0.2)] transition-all duration-200"
                                    />
                                </div>
                                <InputError message={errors.email} />
                            </div>

                            <div className="space-y-1.5 sm:space-y-2">
                                <Label htmlFor="password" className="text-xs sm:text-sm font-medium text-slate-700">
                                    Contraseña
                                </Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 h-3.5 w-3.5 sm:h-4 sm:w-4 -translate-y-1/2 text-slate-400" />
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        required
                                        tabIndex={2}
                                        autoComplete="current-password"
                                        placeholder="Ingresa tu contraseña"
                                        className="pl-9 sm:pl-10 pr-9 sm:pr-10 h-10 sm:h-11 text-sm sm:text-base bg-gradient-to-b from-slate-50 to-slate-100/50 border-0 shadow-[inset_0_1px_2px_rgba(0,0,0,0.05),inset_0_2px_4px_rgba(0,0,0,0.06)] focus:bg-gradient-to-b focus:from-white focus:to-slate-50/50 focus:shadow-[inset_0_1px_2px_rgba(0,0,0,0.05),inset_0_2px_4px_rgba(0,0,0,0.06),0_0_0_3px_rgba(59,130,246,0.1),0_1px_3px_rgba(59,130,246,0.2)] transition-all duration-200"
                                    />
                                    <button
                                        type="button"
                                        onClick={togglePasswordVisibility}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors focus:outline-none focus:text-slate-700 touch-manipulation"
                                        tabIndex={-1}
                                        aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                        ) : (
                                            <Eye className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                        )}
                                    </button>
                                </div>
                                <InputError message={errors.password} />
                            </div>

                            <div className="flex items-center space-x-2.5 sm:space-x-3 pt-1 sm:pt-2">
                                <Checkbox id="remember" name="remember" tabIndex={3} className="h-4 w-4 sm:h-[18px] sm:w-[18px] border-0 shadow-[inset_0_1px_2px_rgba(0,0,0,0.05),inset_0_2px_4px_rgba(0,0,0,0.06)] data-[state=checked]:shadow-[0_1px_2px_rgba(59,130,246,0.2),0_2px_4px_rgba(59,130,246,0.15)] data-[state=checked]:bg-gradient-to-b data-[state=checked]:from-primary data-[state=checked]:to-primary/90" />
                                <Label htmlFor="remember" className="text-xs sm:text-sm text-slate-600 cursor-pointer hover:text-slate-800 transition-colors">
                                    Recordar mi sesión
                                </Label>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="w-full h-10 sm:h-11 text-sm sm:text-base bg-gradient-to-b from-primary via-primary to-primary/95 hover:from-primary hover:via-primary/95 hover:to-primary/90 text-primary-foreground font-medium transition-all duration-200 shadow-[0_1px_3px_rgba(0,0,0,0.1),0_4px_12px_rgba(59,130,246,0.3),inset_0_1px_0_rgba(255,255,255,0.2)] hover:shadow-[0_2px_4px_rgba(0,0,0,0.12),0_8px_20px_rgba(59,130,246,0.4),inset_0_1px_0_rgba(255,255,255,0.3)] hover:-translate-y-0.5 active:translate-y-0 active:shadow-[0_1px_2px_rgba(0,0,0,0.1),0_2px_6px_rgba(59,130,246,0.25),inset_0_1px_0_rgba(255,255,255,0.15)] touch-manipulation"
                            tabIndex={4}
                            disabled={processing}
                        >
                            {processing ? (
                                <>
                                    <LoaderCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 animate-spin mr-2" />
                                    <span className="hidden sm:inline">Iniciando sesión...</span>
                                    <span className="sm:hidden">Iniciando...</span>
                                </>
                            ) : (
                                'Iniciar Sesión'
                            )}
                        </Button>
                    </>
                    );
                }}
            </Form>

            {/* Botón de Registrarse */}
            <div className="mt-4 sm:mt-5 text-center">
                <Link
                    href={route('register')}
                    className="inline-flex items-center justify-center text-sm sm:text-base font-medium text-primary hover:text-primary/80 transition-colors underline underline-offset-4"
                >
                    ¿No tienes cuenta? Solicita tu registro aquí
                </Link>
            </div>

            {status && (
                <div className="mt-3 sm:mt-4 p-2.5 sm:p-3 text-center text-xs sm:text-sm font-medium text-emerald-700 bg-gradient-to-b from-emerald-50 to-emerald-100/50 rounded-lg shadow-[0_1px_2px_rgba(0,0,0,0.05),inset_0_1px_0_rgba(255,255,255,0.5)]">
                    {status}
                </div>
            )}

            {/* Modal de error de rate limiting */}
            <ErrorModal
                open={showThrottleModal}
                onClose={() => setShowThrottleModal(false)}
                type="rate-limit"
                title="Demasiados intentos de inicio de sesión"
                description={`Por tu seguridad, hemos bloqueado temporalmente los intentos de inicio de sesión. Por favor, espera ${throttle_minutes || 1} minuto${(throttle_minutes || 1) > 1 ? 's' : ''} antes de volver a intentar.`}
            />
        </AuthLayout>
    );
}

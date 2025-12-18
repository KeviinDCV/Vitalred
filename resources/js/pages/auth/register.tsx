import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AuthLayout from '@/layouts/auth-layout';
import { Form, Head, usePage, useForm } from '@inertiajs/react';
import { LoaderCircle, Building2, FileText, User, Briefcase, Phone, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

interface EPS {
    id: number;
    nombre: string;
    nit: string | null;
}

interface RegisterProps {
    eps: EPS[];
    nits: string[];
}

export default function Register({ eps, nits }: RegisterProps) {
    const { flash } = usePage<{ flash: any }>().props;
    const [epsSeleccionada, setEpsSeleccionada] = useState<string>('');
    const [epsManual, setEpsManual] = useState('');
    const [nitSeleccionado, setNitSeleccionado] = useState<string>('');
    const [nitManual, setNitManual] = useState('');
    const [searchEps, setSearchEps] = useState('');
    const [searchNit, setSearchNit] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        eps_id: null as number | null,
        eps_nombre: '',
        nit: '',
        nombre_responsable: '',
        cargo_responsable: '',
        telefono: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    // Filtrar EPS según búsqueda
    const epsFiltradas = eps.filter(epsItem =>
        epsItem.nombre.toLowerCase().includes(searchEps.toLowerCase())
    );

    // Filtrar NITs según búsqueda
    const nitsFiltrados = nits.filter(nit =>
        nit.toLowerCase().includes(searchNit.toLowerCase())
    );

    // Autocompletar NIT cuando se selecciona una EPS
    useEffect(() => {
        if (epsSeleccionada && epsSeleccionada !== 'manual') {
            const epsItem = eps.find(e => e.id === parseInt(epsSeleccionada));
            if (epsItem?.nit) {
                setNitSeleccionado('');
                setNitManual(epsItem.nit);
                setData('nit', epsItem.nit);
            }
        }
    }, [epsSeleccionada, eps]);

    // Mostrar mensajes flash
    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        }
        if (flash?.error) {
            toast.error(flash.error);
        }
    }, [flash]);

    return (
        <AuthLayout title="Registro de EPS" description="Regístrate como EPS en el sistema HERMES" showHeader={true}>
            <Head title="Registro de EPS - HERMES">
                <meta
                    name="description"
                    content="Regístrate como Entidad Promotora de Salud en el sistema HERMES"
                />
            </Head>

            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    post(route('register'), {
                        onSuccess: () => {
                            toast.success('Registro enviado exitosamente. Será revisado por un administrador.');
                            setTimeout(() => {
                                window.location.href = route('login');
                            }, 1500);
                        },
                        onError: (errors) => {
                            // Los errores se mostrarán automáticamente por InputError
                        }
                    });
                }}
                className="space-y-5 sm:space-y-6"
            >
                {/* Manejar cambio de EPS seleccionada */}
                {(() => {
                    const handleEpsChange = (value: string) => {
                        setEpsSeleccionada(value);
                        if (value === 'manual') {
                            setData('eps_id', null);
                            setData('eps_nombre', '');
                            setNitManual('');
                            setData('nit', '');
                        } else {
                            const epsItem = eps.find(e => e.id === parseInt(value));
                            if (epsItem) {
                                // Siempre enviamos el nombre, no el ID (porque los IDs del JSON no son reales)
                                setData('eps_id', null);
                                setData('eps_nombre', epsItem.nombre);
                                setEpsManual(epsItem.nombre);
                                if (epsItem.nit) {
                                    setNitManual(epsItem.nit);
                                    setData('nit', epsItem.nit);
                                }
                            }
                        }
                    };

                    // Manejar cambio de NIT seleccionado
                    const handleNitChange = (value: string) => {
                        setNitSeleccionado(value);
                        if (value === 'manual') {
                            setData('nit', '');
                        } else {
                            setData('nit', value);
                            setNitManual(value);
                        }
                    };

                    return (
                        <>
                            <div className="space-y-3">
                                {/* Row 1: EPS and NIT - 2 columnas en desktop */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {/* Selección de EPS */}
                                    <div className="space-y-1">
                                        <Label htmlFor="eps" className="text-xs font-medium text-slate-700">
                                            EPS <span className="text-red-500">*</span>
                                        </Label>
                                        <Select value={epsSeleccionada} onValueChange={handleEpsChange}>
                                            <SelectTrigger className="h-9">
                                                <SelectValue placeholder="Seleccione una EPS" />
                                            </SelectTrigger>
                                            <SelectContent className="max-h-80">
                                                <div className="px-2 pb-2 sticky top-0 bg-white border-b z-10">
                                                    <Input
                                                        type="text"
                                                        placeholder="Buscar EPS..."
                                                        value={searchEps}
                                                        onChange={(e) => setSearchEps(e.target.value)}
                                                        className="h-8 text-xs"
                                                        onClick={(e) => e.stopPropagation()}
                                                    />
                                                </div>
                                                <SelectItem value="manual" className="font-medium text-primary text-xs">
                                                    + Escribir manualmente
                                                </SelectItem>
                                                {epsFiltradas.map((epsItem) => (
                                                    <SelectItem key={epsItem.id} value={epsItem.id.toString()} className="text-xs">
                                                        {epsItem.nombre}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {epsSeleccionada === 'manual' && (
                                            <div className="mt-1">
                                                <div className="relative">
                                                    <Building2 className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                                                    <Input
                                                        id="eps_nombre"
                                                        type="text"
                                                        name="eps_nombre"
                                                        value={epsManual}
                                                        onChange={(e) => {
                                                            setEpsManual(e.target.value);
                                                            setData('eps_nombre', e.target.value);
                                                        }}
                                                        placeholder="Nombre de la EPS"
                                                        className="pl-8 h-9 text-sm"
                                                        required={epsSeleccionada === 'manual'}
                                                    />
                                                </div>
                                            </div>
                                        )}
                                        <InputError message={errors.eps_id || errors.eps_nombre} />
                                    </div>

                                    {/* Selección de NIT */}
                                    <div className="space-y-1">
                                        <Label htmlFor="nit" className="text-xs font-medium text-slate-700">
                                            NIT <span className="text-red-500">*</span>
                                        </Label>
                                        <Select value={nitSeleccionado} onValueChange={handleNitChange}>
                                            <SelectTrigger className="h-9">
                                                <SelectValue placeholder="Seleccione un NIT" />
                                            </SelectTrigger>
                                            <SelectContent className="max-h-80">
                                                <div className="px-2 pb-2 sticky top-0 bg-white border-b z-10">
                                                    <Input
                                                        type="text"
                                                        placeholder="Buscar NIT..."
                                                        value={searchNit}
                                                        onChange={(e) => setSearchNit(e.target.value)}
                                                        className="h-8 text-xs"
                                                        onClick={(e) => e.stopPropagation()}
                                                    />
                                                </div>
                                                <SelectItem value="manual" className="font-medium text-primary text-xs">
                                                    + Escribir manualmente
                                                </SelectItem>
                                                {nitsFiltrados.map((nit) => (
                                                    <SelectItem key={nit} value={nit} className="text-xs">
                                                        {nit}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {(nitSeleccionado === 'manual' || (!nitSeleccionado && nitManual)) && (
                                            <div className="mt-1">
                                                <div className="relative">
                                                    <FileText className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                                                    <Input
                                                        id="nit"
                                                        type="text"
                                                        name="nit"
                                                        value={nitManual}
                                                        onChange={(e) => {
                                                            setNitManual(e.target.value);
                                                            setData('nit', e.target.value);
                                                        }}
                                                        placeholder="NIT de la entidad"
                                                        className="pl-8 h-9 text-sm"
                                                        required
                                                    />
                                                </div>
                                            </div>
                                        )}
                                        <InputError message={errors.nit} />
                                    </div>
                                </div>

                                {/* Row 2: Nombre y Cargo del responsable - 2 columnas en desktop */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {/* Nombre del responsable */}
                                    <div className="space-y-1">
                                        <Label htmlFor="nombre_responsable" className="text-xs font-medium text-slate-700">
                                            Nombre del Responsable <span className="text-red-500">*</span>
                                        </Label>
                                        <div className="relative">
                                            <User className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                                            <Input
                                                id="nombre_responsable"
                                                type="text"
                                                name="nombre_responsable"
                                                value={data.nombre_responsable || ''}
                                                onChange={(e) => setData('nombre_responsable', e.target.value)}
                                                placeholder="Ej: Dr. Juan Pérez"
                                                className="pl-8 h-9 text-sm"
                                                required
                                            />
                                        </div>
                                        <InputError message={errors.nombre_responsable} />
                                    </div>

                                    {/* Cargo del responsable */}
                                    <div className="space-y-1">
                                        <Label htmlFor="cargo_responsable" className="text-xs font-medium text-slate-700">
                                            Cargo del Responsable <span className="text-red-500">*</span>
                                        </Label>
                                        <div className="relative">
                                            <Briefcase className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                                            <Input
                                                id="cargo_responsable"
                                                type="text"
                                                name="cargo_responsable"
                                                value={data.cargo_responsable || ''}
                                                onChange={(e) => setData('cargo_responsable', e.target.value)}
                                                placeholder="Ej: Director Médico"
                                                className="pl-8 h-9 text-sm"
                                                required
                                            />
                                        </div>
                                        <InputError message={errors.cargo_responsable} />
                                    </div>
                                </div>

                                {/* Row 3: Teléfono y Email - 2 columnas en desktop */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {/* Teléfono */}
                                    <div className="space-y-1">
                                        <Label htmlFor="telefono" className="text-xs font-medium text-slate-700">
                                            Teléfono/Contacto <span className="text-red-500">*</span>
                                        </Label>
                                        <div className="relative">
                                            <Phone className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                                            <Input
                                                id="telefono"
                                                type="tel"
                                                name="telefono"
                                                value={data.telefono || ''}
                                                onChange={(e) => setData('telefono', e.target.value)}
                                                placeholder="Ej: 3001234567"
                                                className="pl-8 h-9 text-sm"
                                                required
                                            />
                                        </div>
                                        <InputError message={errors.telefono} />
                                    </div>

                                    {/* Correo electrónico */}
                                    <div className="space-y-1">
                                        <Label htmlFor="email" className="text-xs font-medium text-slate-700">
                                            Correo Institucional <span className="text-red-500">*</span>
                                        </Label>
                                        <div className="relative">
                                            <Mail className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                                            <Input
                                                id="email"
                                                type="email"
                                                name="email"
                                                value={data.email || ''}
                                                onChange={(e) => setData('email', e.target.value)}
                                                placeholder="correo@institucion.com"
                                                className="pl-8 h-9 text-sm"
                                                required
                                            />
                                        </div>
                                        <InputError message={errors.email} />
                                    </div>
                                </div>

                                {/* Row 4: Contraseñas - 2 columnas en desktop */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {/* Contraseña */}
                                    <div className="space-y-1">
                                        <Label htmlFor="password" className="text-xs font-medium text-slate-700">
                                            Contraseña <span className="text-red-500">*</span>
                                        </Label>
                                        <div className="relative">
                                            <Lock className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                                            <Input
                                                id="password"
                                                type={showPassword ? "text" : "password"}
                                                name="password"
                                                value={data.password || ''}
                                                onChange={(e) => setData('password', e.target.value)}
                                                placeholder="Mínimo 8 caracteres"
                                                className="pl-8 pr-8 h-9 text-sm"
                                                required
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                                            >
                                                {showPassword ? (
                                                    <EyeOff className="h-3.5 w-3.5" />
                                                ) : (
                                                    <Eye className="h-3.5 w-3.5" />
                                                )}
                                            </button>
                                        </div>
                                        <InputError message={errors.password} />
                                    </div>

                                    {/* Confirmar Contraseña */}
                                    <div className="space-y-1">
                                        <Label htmlFor="password_confirmation" className="text-xs font-medium text-slate-700">
                                            Confirmar Contraseña <span className="text-red-500">*</span>
                                        </Label>
                                        <div className="relative">
                                            <Lock className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                                            <Input
                                                id="password_confirmation"
                                                type={showPasswordConfirmation ? "text" : "password"}
                                                name="password_confirmation"
                                                value={data.password_confirmation || ''}
                                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                                placeholder="Repite la contraseña"
                                                className="pl-8 pr-8 h-9 text-sm"
                                                required
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPasswordConfirmation(!showPasswordConfirmation)}
                                                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                                            >
                                                {showPasswordConfirmation ? (
                                                    <EyeOff className="h-3.5 w-3.5" />
                                                ) : (
                                                    <Eye className="h-3.5 w-3.5" />
                                                )}
                                            </button>
                                        </div>
                                        <InputError message={errors.password_confirmation} />
                                    </div>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className="w-full h-10 sm:h-11 text-sm sm:text-base bg-gradient-to-b from-primary via-primary to-primary/95 hover:from-primary hover:via-primary/95 hover:to-primary/90 text-primary-foreground font-medium transition-all duration-200 shadow-[0_1px_3px_rgba(0,0,0,0.1),0_4px_12px_rgba(59,130,246,0.3),inset_0_1px_0_rgba(255,255,255,0.2)] hover:shadow-[0_2px_4px_rgba(0,0,0,0.12),0_8px_20px_rgba(59,130,246,0.4),inset_0_1px_0_rgba(255,255,255,0.3)] hover:-translate-y-0.5 active:translate-y-0 active:shadow-[0_1px_2px_rgba(0,0,0,0.1),0_2px_6px_rgba(59,130,246,0.25),inset_0_1px_0_rgba(255,255,255,0.15)] touch-manipulation"
                                disabled={processing}
                            >
                                {processing ? (
                                    <>
                                        <LoaderCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 animate-spin mr-2" />
                                        <span className="hidden sm:inline">Registrando...</span>
                                        <span className="sm:hidden">Registrando...</span>
                                    </>
                                ) : (
                                    'Registrarse'
                                )}
                            </Button>

                            <div className="text-center text-xs sm:text-sm text-slate-600">
                                ¿Ya tienes una cuenta?{' '}
                                <a
                                    href={route('login')}
                                    className="text-primary hover:text-primary/80 font-medium underline underline-offset-4"
                                >
                                    Inicia sesión
                                </a>
                            </div>
                        </>
                    );
                })()}
            </form>
        </AuthLayout>
    );
}

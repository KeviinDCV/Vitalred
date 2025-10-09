import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayoutInertia from '@/layouts/app-layout-inertia';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm, router } from '@inertiajs/react';
import { Edit, Calendar, Upload, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Ingresar Registro',
        href: '/medico/ingresar-registro',
    },
];

export default function IngresarRegistro({ auth }: { auth: { user: { nombre: string; role: string } } }) {
    const [currentStep, setCurrentStep] = useState(1);
    const [isTransitioning, setIsTransitioning] = useState(false);

    const { data, setData, post, processing } = useForm({
        // Paso 1: Información Personal
        tipo_identificacion: '',
        numero_identificacion: '',
        nombre: '',
        apellidos: '',
        fecha_nacimiento: '',
        edad: 0,
        sexo: '',
        historia_clinica: null as File | null,

        // Paso 2: Datos Sociodemográficos
        asegurador: '',
        departamento: '',
        ciudad: '',
        institucion_remitente: '',

        // Paso 3: Datos Clínicos
        tipo_paciente: '',
        diagnostico_principal: '',
        fecha_ingreso: '',
        motivo_consulta: '',
        clasificacion_triage: '',
        enfermedad_actual: '',
        antecedentes: '',
        frecuencia_cardiaca: 0,
        frecuencia_respiratoria: 0,
        temperatura: 0,
        tension_sistolica: 0,
        tension_diastolica: 0,
        saturacion_oxigeno: 0,
        escala_glasgow: '',
        examen_fisico: '',
        tratamiento: '',

        // Paso 4: Datos De Remisión
        motivo_remision: '',
        tipo_solicitud: '',
        especialidad_solicitada: [] as string[],
        requerimiento_oxigeno: 'NO',
        tipo_servicio: '',
    });

    const steps = [
        { number: 1, title: 'Información Personal' },
        { number: 2, title: 'Datos Sociodemográficos' },
        { number: 3, title: 'Datos Clínicos' },
        { number: 4, title: 'Datos De Remisión' },
    ];

    const handleNext = () => {
        if (currentStep < 4) {
            setIsTransitioning(true);
            setTimeout(() => {
                setCurrentStep(currentStep + 1);
                setIsTransitioning(false);
            }, 150);
        }
    };

    const handlePrevious = () => {
        if (currentStep > 1) {
            setIsTransitioning(true);
            setTimeout(() => {
                setCurrentStep(currentStep - 1);
                setIsTransitioning(false);
            }, 150);
        }
    };

    const calculateAge = (birthDate: string) => {
        if (!birthDate) return 0;
        const today = new Date();
        const birth = new Date(birthDate);
        let age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
            age--;
        }
        return age;
    };

    const handleDateChange = (date: string) => {
        setData('fecha_nacimiento', date);
        setData('edad', calculateAge(date));
    };

    const handleSubmit = () => {
        const formData = new FormData();
        
        Object.keys(data).forEach(key => {
            const value = data[key as keyof typeof data];
            if (key === 'especialidad_solicitada' && Array.isArray(value)) {
                value.forEach((item, index) => {
                    formData.append(`especialidad_solicitada[${index}]`, item);
                });
            } else if (key === 'historia_clinica' && value instanceof File) {
                formData.append('historia_clinica', value);
            } else if (value !== null && value !== undefined) {
                formData.append(key, String(value));
            }
        });

        router.post('/medico/registros', formData, {
            forceFormData: true,
            onSuccess: () => {
                toast.success("¡Registro médico creado exitosamente!");
                router.visit('/medico/consulta-pacientes');
            },
            onError: () => {
                toast.error("Error al guardar el registro");
            },
        });
    };

    return (
        <AppLayoutInertia breadcrumbs={breadcrumbs} user={auth.user}>
            <Head title="Ingresar Registro - Vital Red" />

            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div className="max-w-7xl mx-auto w-full">
                    {/* Header */}
                    <Card className="bg-primary text-primary-foreground mb-6">
                        <CardContent className="p-6">
                            <div className="flex items-center gap-3">
                                <Edit className="h-6 w-6" />
                                <div>
                                    <h2 className="text-xl font-semibold">Ingreso de datos</h2>
                                    <p className="text-primary-foreground/80">Fecha de consulta:</p>
                                    <p className="text-lg font-medium">
                                        {new Date().toLocaleDateString('es-ES', {
                                            day: '2-digit',
                                            month: '2-digit',
                                            year: 'numeric'
                                        })}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Layout principal */}
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                        {/* Stepper */}
                        <div className="lg:col-span-1">
                            <div className="sticky top-6">
                                <div className="space-y-1">
                                    {steps.map((step, index) => (
                                        <div key={step.number} className="relative">
                                            <div className="flex items-center group">
                                                <div className={`
                                                    flex items-center justify-center w-10 h-10 rounded-full text-white font-semibold
                                                    transition-all duration-500 ease-in-out transform
                                                    ${step.number === currentStep
                                                        ? 'bg-primary scale-110 shadow-lg shadow-primary/30 ring-4 ring-primary/20'
                                                        : step.number < currentStep
                                                            ? 'bg-green-500 scale-105 shadow-md shadow-green-500/20'
                                                            : 'bg-gray-300 scale-100 hover:scale-105'
                                                    }
                                                `}>
                                                    <span>{step.number}</span>
                                                </div>
                                                <div className="ml-4 flex-1">
                                                    <p className={`
                                                        font-medium text-sm transition-all duration-300
                                                        ${step.number === currentStep
                                                            ? 'text-primary font-semibold'
                                                            : step.number < currentStep
                                                                ? 'text-green-600'
                                                                : 'text-gray-600'
                                                        }
                                                    `}>
                                                        {step.title}
                                                    </p>
                                                </div>
                                            </div>
                                            {index < steps.length - 1 && (
                                                <div className="ml-5 w-px h-8 bg-gray-300"></div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-6 p-3 bg-gray-50 rounded-lg border">
                                    <div className="flex items-center justify-between text-xs text-gray-600 mb-2">
                                        <span>Progreso</span>
                                        <span>{Math.round((currentStep / steps.length) * 100)}%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className="bg-primary h-2 rounded-full transition-all duration-700"
                                            style={{ width: `${(currentStep / steps.length) * 100}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Contenido */}
                        <div className="lg:col-span-3">
                            <div className={`
                                transition-all duration-300 ease-in-out
                                ${isTransitioning ? 'opacity-0 transform translate-x-4' : 'opacity-100 transform translate-x-0'}
                            `}>
                                {/* Paso 1: Información Personal */}
                                {currentStep === 1 && (
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="text-xl">Información Personal</CardTitle>
                                            <CardDescription>
                                                Complete los datos personales del paciente. Los campos marcados con (*) son obligatorios
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-6">
                                            <div className="grid gap-6 md:grid-cols-2">
                                                <div className="space-y-2">
                                                    <Label htmlFor="tipo_identificacion">Tipo de identificación *</Label>
                                                    <Select value={data.tipo_identificacion} onValueChange={(value) => setData('tipo_identificacion', value)}>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Seleccione" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="cc">Cédula de Ciudadanía</SelectItem>
                                                            <SelectItem value="ti">Tarjeta de Identidad</SelectItem>
                                                            <SelectItem value="ce">Cédula de Extranjería</SelectItem>
                                                            <SelectItem value="pp">Pasaporte</SelectItem>
                                                            <SelectItem value="rc">Registro Civil</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor="numero_identificacion">Número de identificación *</Label>
                                                    <Input
                                                        id="numero_identificacion"
                                                        value={data.numero_identificacion}
                                                        onChange={(e) => setData('numero_identificacion', e.target.value)}
                                                        placeholder="Ingrese el número sin puntos ni comas"
                                                    />
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor="nombre">Nombre *</Label>
                                                    <Input
                                                        id="nombre"
                                                        value={data.nombre}
                                                        onChange={(e) => setData('nombre', e.target.value)}
                                                        placeholder="Nombres completos"
                                                    />
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor="apellidos">Apellidos *</Label>
                                                    <Input
                                                        id="apellidos"
                                                        value={data.apellidos}
                                                        onChange={(e) => setData('apellidos', e.target.value)}
                                                        placeholder="Apellidos completos"
                                                    />
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor="fecha_nacimiento">Fecha de nacimiento *</Label>
                                                    <Input
                                                        id="fecha_nacimiento"
                                                        type="date"
                                                        value={data.fecha_nacimiento}
                                                        onChange={(e) => handleDateChange(e.target.value)}
                                                    />
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor="edad">Edad</Label>
                                                    <Input
                                                        id="edad"
                                                        value={data.edad}
                                                        readOnly
                                                        className="bg-gray-50"
                                                    />
                                                </div>

                                                <div className="space-y-2 md:col-span-2">
                                                    <Label htmlFor="sexo">Sexo *</Label>
                                                    <Select value={data.sexo} onValueChange={(value) => setData('sexo', value)}>
                                                        <SelectTrigger className="w-full md:w-1/2">
                                                            <SelectValue placeholder="Seleccione" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="masculino">Masculino</SelectItem>
                                                            <SelectItem value="femenino">Femenino</SelectItem>
                                                            <SelectItem value="otro">Otro</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            </div>

                                            <div className="flex justify-end pt-6">
                                                <Button onClick={handleNext} className="px-8" disabled={isTransitioning}>
                                                    Siguiente
                                                    <ChevronRight className="h-4 w-4 ml-2" />
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                )}

                                {/* Paso 2: Datos Sociodemográficos */}
                                {currentStep === 2 && (
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="text-xl">Datos Sociodemográficos</CardTitle>
                                            <CardDescription>
                                                Complete la información sociodemográfica del paciente
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-6">
                                            <div className="grid gap-6 md:grid-cols-2">
                                                <div className="space-y-2">
                                                    <Label htmlFor="asegurador">Asegurador *</Label>
                                                    <Input
                                                        id="asegurador"
                                                        value={data.asegurador}
                                                        onChange={(e) => setData('asegurador', e.target.value)}
                                                        placeholder="EPS, ARL, etc."
                                                    />
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor="departamento">Departamento *</Label>
                                                    <Input
                                                        id="departamento"
                                                        value={data.departamento}
                                                        onChange={(e) => setData('departamento', e.target.value)}
                                                        placeholder="Departamento de residencia"
                                                    />
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor="ciudad">Ciudad *</Label>
                                                    <Input
                                                        id="ciudad"
                                                        value={data.ciudad}
                                                        onChange={(e) => setData('ciudad', e.target.value)}
                                                        placeholder="Ciudad de residencia"
                                                    />
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor="institucion_remitente">Institución remitente *</Label>
                                                    <Input
                                                        id="institucion_remitente"
                                                        value={data.institucion_remitente}
                                                        onChange={(e) => setData('institucion_remitente', e.target.value)}
                                                        placeholder="Nombre de la institución que remite"
                                                    />
                                                </div>
                                            </div>

                                            <div className="flex justify-between pt-6">
                                                <Button variant="outline" onClick={handlePrevious} disabled={isTransitioning}>
                                                    Anterior
                                                </Button>
                                                <Button onClick={handleNext} disabled={isTransitioning}>
                                                    Siguiente
                                                    <ChevronRight className="h-4 w-4 ml-2" />
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                )}

                                {/* Paso 3: Datos Clínicos */}
                                {currentStep === 3 && (
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="text-xl">Datos Clínicos</CardTitle>
                                            <CardDescription>
                                                Complete la información clínica del paciente
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-6">
                                            <div className="grid gap-6 md:grid-cols-2">
                                                <div className="space-y-2">
                                                    <Label htmlFor="tipo_paciente">Tipo de paciente *</Label>
                                                    <Select value={data.tipo_paciente} onValueChange={(value) => setData('tipo_paciente', value)}>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Seleccione" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="menor_de_edad">Menor de edad</SelectItem>
                                                            <SelectItem value="adulto">Adulto</SelectItem>
                                                            <SelectItem value="gestante">Gestante</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor="clasificacion_triage">Clasificación Triage *</Label>
                                                    <Select value={data.clasificacion_triage} onValueChange={(value) => setData('clasificacion_triage', value)}>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Seleccione" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="triage_1">Triage I - Resucitación (Rojo)</SelectItem>
                                                            <SelectItem value="triage_2">Triage II - Emergencia (Naranja)</SelectItem>
                                                            <SelectItem value="triage_3">Triage III - Urgencia (Amarillo)</SelectItem>
                                                            <SelectItem value="triage_4">Triage IV - Urgencia Menor (Verde)</SelectItem>
                                                            <SelectItem value="triage_5">Triage V - Sin Urgencia (Azul)</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor="fecha_ingreso">Fecha de ingreso *</Label>
                                                    <Input
                                                        id="fecha_ingreso"
                                                        type="date"
                                                        value={data.fecha_ingreso}
                                                        onChange={(e) => setData('fecha_ingreso', e.target.value)}
                                                    />
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor="diagnostico_principal">Diagnóstico principal *</Label>
                                                    <Input
                                                        id="diagnostico_principal"
                                                        value={data.diagnostico_principal}
                                                        onChange={(e) => setData('diagnostico_principal', e.target.value)}
                                                        placeholder="Código CIE-10"
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="motivo_consulta">Motivo consulta *</Label>
                                                    <textarea
                                                        id="motivo_consulta"
                                                        value={data.motivo_consulta}
                                                        onChange={(e) => setData('motivo_consulta', e.target.value)}
                                                        placeholder="Describa el motivo de la consulta"
                                                        className="w-full min-h-[80px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-vertical"
                                                    />
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor="enfermedad_actual">Enfermedad actual *</Label>
                                                    <textarea
                                                        id="enfermedad_actual"
                                                        value={data.enfermedad_actual}
                                                        onChange={(e) => setData('enfermedad_actual', e.target.value)}
                                                        placeholder="Describa la enfermedad actual del paciente"
                                                        className="w-full min-h-[100px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-vertical"
                                                    />
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor="antecedentes">Antecedentes *</Label>
                                                    <textarea
                                                        id="antecedentes"
                                                        value={data.antecedentes}
                                                        onChange={(e) => setData('antecedentes', e.target.value)}
                                                        placeholder="Antecedentes médicos, quirúrgicos, familiares, etc."
                                                        className="w-full min-h-[100px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-vertical"
                                                    />
                                                </div>
                                            </div>

                                            <div className="flex justify-between pt-6">
                                                <Button variant="outline" onClick={handlePrevious} disabled={isTransitioning}>
                                                    Anterior
                                                </Button>
                                                <Button onClick={handleNext} disabled={isTransitioning}>
                                                    Siguiente
                                                    <ChevronRight className="h-4 w-4 ml-2" />
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                )}

                                {/* Paso 4: Datos De Remisión */}
                                {currentStep === 4 && (
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="text-xl">Datos De Remisión</CardTitle>
                                            <CardDescription>
                                                Complete la información de remisión del paciente
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-6">
                                            <div className="grid gap-6 md:grid-cols-2">
                                                <div className="space-y-2 md:col-span-2">
                                                    <Label htmlFor="motivo_remision">Motivo de remisión *</Label>
                                                    <textarea
                                                        id="motivo_remision"
                                                        value={data.motivo_remision}
                                                        onChange={(e) => setData('motivo_remision', e.target.value)}
                                                        placeholder="Describa el motivo por el cual se remite al paciente"
                                                        className="w-full min-h-[100px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-vertical"
                                                    />
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor="tipo_solicitud">Tipo de solicitud *</Label>
                                                    <Select value={data.tipo_solicitud} onValueChange={(value) => setData('tipo_solicitud', value)}>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Seleccione" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="solicitud_remision">Solicitud de remisión</SelectItem>
                                                            <SelectItem value="solicitud_traslado_redondo">Solicitud traslado redondo</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor="requerimiento_oxigeno">Requerimiento de oxígeno *</Label>
                                                    <Select value={data.requerimiento_oxigeno} onValueChange={(value) => setData('requerimiento_oxigeno', value)}>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Seleccione" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="SI">SÍ</SelectItem>
                                                            <SelectItem value="NO">NO</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor="tipo_servicio">Tipo de servicio *</Label>
                                                    <Input
                                                        id="tipo_servicio"
                                                        value={data.tipo_servicio}
                                                        onChange={(e) => setData('tipo_servicio', e.target.value)}
                                                        placeholder="Tipo de servicio requerido"
                                                    />
                                                </div>
                                            </div>

                                            <div className="flex justify-between pt-6">
                                                <Button variant="outline" onClick={handlePrevious} disabled={processing || isTransitioning}>
                                                    Anterior
                                                </Button>
                                                <Button
                                                    onClick={handleSubmit}
                                                    disabled={processing || isTransitioning}
                                                    className="bg-green-600 hover:bg-green-700"
                                                >
                                                    {processing ? (
                                                        <>
                                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                                            Guardando...
                                                        </>
                                                    ) : (
                                                        <>
                                                            Guardar Registro
                                                            <Calendar className="h-4 w-4 ml-2" />
                                                        </>
                                                    )}
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayoutInertia>
    );
}
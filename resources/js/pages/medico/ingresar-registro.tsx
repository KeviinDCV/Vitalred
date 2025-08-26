import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm, router } from '@inertiajs/react';
import { Edit, Calendar, Upload, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import axios from 'axios';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Ingresar Registro',
        href: '/medico/ingresar-registro',
    },
];

// Datos para los selects
const aseguradores = [
    { value: 'eps_sanitas', label: 'EPS Sanitas' },
    { value: 'eps_sura', label: 'EPS Sura' },
    { value: 'eps_compensar', label: 'EPS Compensar' },
    { value: 'eps_famisanar', label: 'EPS Famisanar' },
    { value: 'eps_salud_total', label: 'EPS Salud Total' },
    { value: 'eps_nueva_eps', label: 'Nueva EPS' },
    { value: 'sisben', label: 'Sisben' },
    { value: 'particular', label: 'Particular' },
];

const departamentos = [
    { value: 'antioquia', label: 'Antioquia' },
    { value: 'atlantico', label: 'Atlántico' },
    { value: 'bogota', label: 'Bogotá D.C.' },
    { value: 'bolivar', label: 'Bolívar' },
    { value: 'boyaca', label: 'Boyacá' },
    { value: 'caldas', label: 'Caldas' },
    { value: 'cundinamarca', label: 'Cundinamarca' },
    { value: 'valle', label: 'Valle del Cauca' },
];

const ciudadesPorDepartamento: Record<string, Array<{value: string, label: string}>> = {
    antioquia: [
        { value: 'medellin', label: 'Medellín' },
        { value: 'bello', label: 'Bello' },
        { value: 'itagui', label: 'Itagüí' },
        { value: 'envigado', label: 'Envigado' },
    ],
    bogota: [
        { value: 'bogota', label: 'Bogotá D.C.' },
    ],
    valle: [
        { value: 'cali', label: 'Cali' },
        { value: 'palmira', label: 'Palmira' },
        { value: 'buenaventura', label: 'Buenaventura' },
    ],
    cundinamarca: [
        { value: 'soacha', label: 'Soacha' },
        { value: 'facatativa', label: 'Facatativá' },
        { value: 'zipaquira', label: 'Zipaquirá' },
    ],
    // Agregar más ciudades según sea necesario
};

const tiposPaciente = [
    { value: 'ambulatorio', label: 'Ambulatorio' },
    { value: 'hospitalizado', label: 'Hospitalizado' },
    { value: 'urgencias', label: 'Urgencias' },
    { value: 'uci', label: 'UCI' },
    { value: 'consulta_externa', label: 'Consulta Externa' },
];

const clasificacionesTriage = [
    { value: 'triage_1', label: 'Triage I - Resucitación (Rojo)' },
    { value: 'triage_2', label: 'Triage II - Emergencia (Naranja)' },
    { value: 'triage_3', label: 'Triage III - Urgencia (Amarillo)' },
    { value: 'triage_4', label: 'Triage IV - Urgencia Menor (Verde)' },
    { value: 'triage_5', label: 'Triage V - Sin Urgencia (Azul)' },
];

const escalasGlasgow = [
    { value: '15', label: '15 - Normal' },
    { value: '14', label: '14 - Leve' },
    { value: '13', label: '13 - Leve' },
    { value: '12', label: '12 - Moderado' },
    { value: '11', label: '11 - Moderado' },
    { value: '10', label: '10 - Moderado' },
    { value: '9', label: '9 - Moderado' },
    { value: '8', label: '8 - Severo' },
    { value: '7', label: '7 - Severo' },
    { value: '6', label: '6 - Severo' },
    { value: '5', label: '5 - Severo' },
    { value: '4', label: '4 - Severo' },
    { value: '3', label: '3 - Severo' },
];

const tiposSolicitud = [
    { value: 'interconsulta', label: 'Interconsulta' },
    { value: 'remision', label: 'Remisión' },
    { value: 'contraremision', label: 'Contraremisión' },
    { value: 'segunda_opinion', label: 'Segunda Opinión' },
    { value: 'procedimiento', label: 'Procedimiento' },
];

const especialidades = [
    { value: 'medicina_interna', label: 'Medicina Interna' },
    { value: 'cardiologia', label: 'Cardiología' },
    { value: 'neurologia', label: 'Neurología' },
    { value: 'cirugia_general', label: 'Cirugía General' },
    { value: 'ortopedia', label: 'Ortopedia y Traumatología' },
    { value: 'ginecologia', label: 'Ginecología y Obstetricia' },
    { value: 'pediatria', label: 'Pediatría' },
    { value: 'psiquiatria', label: 'Psiquiatría' },
    { value: 'dermatologia', label: 'Dermatología' },
    { value: 'oftalmologia', label: 'Oftalmología' },
    { value: 'otorrinolaringologia', label: 'Otorrinolaringología' },
    { value: 'urologia', label: 'Urología' },
    { value: 'endocrinologia', label: 'Endocrinología' },
    { value: 'gastroenterologia', label: 'Gastroenterología' },
    { value: 'neumologia', label: 'Neumología' },
    { value: 'nefrologia', label: 'Nefrología' },
    { value: 'oncologia', label: 'Oncología' },
    { value: 'hematologia', label: 'Hematología' },
    { value: 'reumatologia', label: 'Reumatología' },
    { value: 'infectologia', label: 'Infectología' },
];

const tiposServicio = [
    { value: 'ambulatorio', label: 'Ambulatorio' },
    { value: 'hospitalizacion', label: 'Hospitalización' },
    { value: 'urgencias', label: 'Urgencias' },
    { value: 'uci', label: 'UCI' },
    { value: 'cirugia', label: 'Cirugía' },
    { value: 'consulta_externa', label: 'Consulta Externa' },
];

const tiposApoyo = [
    { value: 'diagnostico', label: 'Apoyo Diagnóstico' },
    { value: 'terapeutico', label: 'Apoyo Terapéutico' },
    { value: 'laboratorio', label: 'Laboratorio Clínico' },
    { value: 'imagenes', label: 'Imágenes Diagnósticas' },
    { value: 'patologia', label: 'Patología' },
    { value: 'rehabilitacion', label: 'Rehabilitación' },
    { value: 'nutricion', label: 'Nutrición' },
    { value: 'psicologia', label: 'Psicología' },
    { value: 'trabajo_social', label: 'Trabajo Social' },
];

export default function IngresarRegistro() {
    const [currentStep, setCurrentStep] = useState(1);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [validationErrors, setValidationErrors] = useState<string[]>([]);
    const [isAnalyzingWithAI, setIsAnalyzingWithAI] = useState(false);
    const [aiAnalysisResult, setAiAnalysisResult] = useState<any>(null);

    const { data, setData, post, processing, errors, reset } = useForm({
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
        diagnostico_1: '',
        diagnostico_2: '',
        fecha_ingreso: '',
        dias_hospitalizados: 0,
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
        glucometria: 0,
        escala_glasgow: '',
        examen_fisico: '',
        tratamiento: '',
        plan_terapeutico: '',

        // Paso 4: Datos De Remisión
        motivo_remision: '',
        tipo_solicitud: '',
        especialidad_solicitada: '',
        requerimiento_oxigeno: 'NO',
        tipo_servicio: '',
        tipo_apoyo: '',
    });

    const steps = [
        { number: 1, title: 'Información Personal', active: true },
        { number: 2, title: 'Datos Sociodemográficos', active: false },
        { number: 3, title: 'Datos Clínicos', active: false },
        { number: 4, title: 'Datos De Remisión', active: false },
    ];

    const handleNext = () => {
        if (currentStep < 4) {
            // Validar el paso actual antes de avanzar
            let isValid = false;

            switch (currentStep) {
                case 1:
                    isValid = validateStep1();
                    break;
                case 2:
                    isValid = validateStep2();
                    break;
                case 3:
                    isValid = validateStep3();
                    break;
                default:
                    isValid = true;
            }

            if (isValid) {
                setIsTransitioning(true);
                setTimeout(() => {
                    setCurrentStep(currentStep + 1);
                    setIsTransitioning(false);
                }, 150);
            }
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

    const handleDepartamentoChange = (departamento: string) => {
        setData('departamento', departamento);
        setData('ciudad', ''); // Limpiar ciudad cuando cambia departamento
    };

    const getCiudadesDisponibles = () => {
        return ciudadesPorDepartamento[data.departamento] || [];
    };

    const calculateDiasHospitalizados = (fechaIngreso: string) => {
        if (!fechaIngreso) return 0;

        const today = new Date();
        const ingreso = new Date(fechaIngreso);
        const diffTime = Math.abs(today.getTime() - ingreso.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        return diffDays;
    };

    const handleFechaIngresoChange = (fecha: string) => {
        setData('fecha_ingreso', fecha);
        setData('dias_hospitalizados', calculateDiasHospitalizados(fecha));
    };

    // Validaciones por paso
    const validateStep1 = () => {
        const requiredFields = [
            'tipo_identificacion',
            'numero_identificacion',
            'nombre',
            'apellidos',
            'fecha_nacimiento',
            'sexo'
        ];

        const missingFields = requiredFields.filter(field => !data[field as keyof typeof data]);

        if (missingFields.length > 0) {
            setValidationErrors(missingFields);

            const fieldNames: Record<string, string> = {
                tipo_identificacion: 'Tipo de identificación',
                numero_identificacion: 'Número de identificación',
                nombre: 'Nombre',
                apellidos: 'Apellidos',
                fecha_nacimiento: 'Fecha de nacimiento',
                sexo: 'Sexo'
            };

            const missingFieldNames = missingFields.map(field => fieldNames[field]);

            toast.error("Campos obligatorios faltantes", {
                description: `Por favor complete: ${missingFieldNames.join(', ')}`,
                duration: 5000,
            });
            return false;
        }

        setValidationErrors([]);
        return true;
    };

    // Función para analizar archivo con IA
    const analyzeFileWithAI = async (file: File) => {
        setIsAnalyzingWithAI(true);
        setAiAnalysisResult(null);

        try {
            const formData = new FormData();
            formData.append('file', file);

            // Usar axios para manejar la respuesta JSON correctamente
            const response = await axios.post(route('medico.ai.extract-patient-data'), formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
            });

            const result = response.data;

            if (result.success) {
                setAiAnalysisResult(result);

                // Llenar automáticamente los campos con los datos extraídos
                const extractedData = result.data;

                console.log('Datos extraídos por IA:', extractedData);

                if (extractedData.tipo_identificacion) {
                    setData('tipo_identificacion', extractedData.tipo_identificacion);
                    console.log('Tipo identificación llenado:', extractedData.tipo_identificacion);
                }
                if (extractedData.numero_identificacion) {
                    setData('numero_identificacion', extractedData.numero_identificacion);
                    console.log('Número identificación llenado:', extractedData.numero_identificacion);
                }
                if (extractedData.nombre) {
                    setData('nombre', extractedData.nombre);
                    console.log('Nombre llenado:', extractedData.nombre);
                }
                if (extractedData.apellidos) {
                    setData('apellidos', extractedData.apellidos);
                    console.log('Apellidos llenado:', extractedData.apellidos);
                }
                // Manejar fecha de nacimiento y edad
                if (extractedData.fecha_nacimiento) {
                    // Usar handleDateChange para que también calcule la edad
                    handleDateChange(extractedData.fecha_nacimiento);
                    console.log('Fecha nacimiento llenada:', extractedData.fecha_nacimiento);

                    // Si también hay edad de la IA, usarla en lugar de la calculada
                    if (extractedData.edad) {
                        setData('edad', extractedData.edad);
                        console.log('Edad de IA usada:', extractedData.edad);
                    } else {
                        console.log('Edad calculada desde fecha');
                    }
                } else if (extractedData.edad) {
                    // Si no hay fecha pero sí edad, llenar la edad
                    setData('edad', extractedData.edad);
                    console.log('Edad llenada desde IA:', extractedData.edad);
                    console.log('Fecha de nacimiento no disponible - usuario deberá ingresarla manualmente');
                } else {
                    console.log('No se encontró fecha_nacimiento ni edad en los datos extraídos');
                }

                if (extractedData.sexo) {
                    setData('sexo', extractedData.sexo);
                    console.log('Sexo llenado:', extractedData.sexo);
                }

                toast.success("🤖 ¡Datos extraídos automáticamente!", {
                    description: "Los campos se han llenado con IA. Revisa los datos y haz clic en 'Siguiente' para continuar.",
                    duration: 6000,
                });
            } else {
                throw new Error(result.message || 'Error desconocido');
            }
        } catch (error: any) {
            console.error('Error analizando archivo con IA:', error);

            let errorMessage = "No se pudieron extraer los datos del documento.";
            if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            } else if (error.message) {
                errorMessage = error.message;
            }

            toast.error("Error al analizar el archivo", {
                description: errorMessage,
                duration: 5000,
            });
        } finally {
            setIsAnalyzingWithAI(false);
        }
    };

    // Helper para verificar si un campo tiene error
    const hasFieldError = (fieldName: string) => {
        return validationErrors.includes(fieldName);
    };

    // Helper para obtener clases CSS de error
    const getFieldErrorClass = (fieldName: string) => {
        return hasFieldError(fieldName)
            ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
            : 'border-gray-300 focus:border-primary focus:ring-primary';
    };

    const validateStep2 = () => {
        const requiredFields = [
            'asegurador',
            'departamento',
            'ciudad',
            'institucion_remitente'
        ];

        const missingFields = requiredFields.filter(field => !data[field as keyof typeof data]);

        if (missingFields.length > 0) {
            const fieldNames: Record<string, string> = {
                asegurador: 'Asegurador',
                departamento: 'Departamento',
                ciudad: 'Ciudad',
                institucion_remitente: 'Institución remitente'
            };

            const missingFieldNames = missingFields.map(field => fieldNames[field]);

            toast.error("Campos obligatorios faltantes", {
                description: `Por favor complete: ${missingFieldNames.join(', ')}`,
                duration: 5000,
            });
            return false;
        }

        return true;
    };

    const validateStep3 = () => {
        const requiredFields = [
            'tipo_paciente',
            'diagnostico_principal',
            'fecha_ingreso',
            'motivo_consulta',
            'clasificacion_triage',
            'enfermedad_actual',
            'antecedentes',
            'frecuencia_cardiaca',
            'frecuencia_respiratoria',
            'temperatura',
            'tension_sistolica',
            'tension_diastolica',
            'saturacion_oxigeno',
            'escala_glasgow',
            'examen_fisico',
            'tratamiento'
        ];

        const missingFields = requiredFields.filter(field => !data[field as keyof typeof data]);

        if (missingFields.length > 0) {
            const fieldNames: Record<string, string> = {
                tipo_paciente: 'Tipo de paciente',
                diagnostico_principal: 'Diagnóstico principal',
                fecha_ingreso: 'Fecha de ingreso',
                motivo_consulta: 'Motivo consulta',
                clasificacion_triage: 'Clasificación Triage',
                enfermedad_actual: 'Enfermedad actual',
                antecedentes: 'Antecedentes',
                frecuencia_cardiaca: 'Frecuencia Cardíaca',
                frecuencia_respiratoria: 'Frecuencia Respiratoria',
                temperatura: 'Temperatura',
                tension_sistolica: 'Tensión Arterial Sistólica',
                tension_diastolica: 'Tensión Arterial Diastólica',
                saturacion_oxigeno: 'Saturación de Oxígeno',
                escala_glasgow: 'Escala de Glasgow',
                examen_fisico: 'Examen físico',
                tratamiento: 'Tratamiento'
            };

            const missingFieldNames = missingFields.map(field => fieldNames[field]);

            toast.error("Campos obligatorios faltantes", {
                description: `Por favor complete: ${missingFieldNames.join(', ')}`,
                duration: 5000,
            });
            return false;
        }

        return true;
    };

    const validateStep4 = () => {
        const requiredFields = [
            'motivo_remision',
            'tipo_solicitud',
            'especialidad_solicitada',
            'requerimiento_oxigeno',
            'tipo_servicio'
        ];

        const missingFields = requiredFields.filter(field => !data[field as keyof typeof data]);

        if (missingFields.length > 0) {
            const fieldNames: Record<string, string> = {
                motivo_remision: 'Motivo de remisión',
                tipo_solicitud: 'Tipo solicitud',
                especialidad_solicitada: 'Especialidad solicitada',
                requerimiento_oxigeno: 'Requerimiento de oxígeno',
                tipo_servicio: 'Tipo de servicio'
            };

            const missingFieldNames = missingFields.map(field => fieldNames[field]);

            toast.error("Campos obligatorios faltantes", {
                description: `Por favor complete: ${missingFieldNames.join(', ')}`,
                duration: 5000,
            });
            return false;
        }

        return true;
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Ingresar Registro - Vital Red" />

            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div className="max-w-7xl mx-auto w-full">
                    {/* Header con información de consulta */}
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

                    {/* Layout principal con stepper y contenido */}
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                        {/* Stepper - Columna izquierda */}
                        <div className="lg:col-span-1">
                            <div className="sticky top-6">
                                <div className="space-y-1">
                                    {steps.map((step, index) => (
                                        <div key={step.number} className="relative">
                                            <div className="flex items-center group">
                                                {/* Círculo del paso con animaciones */}
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
                                                    <span className={`
                                                        transition-all duration-300
                                                        ${step.number === currentStep ? 'font-bold' : 'font-semibold'}
                                                    `}>
                                                        {step.number}
                                                    </span>
                                                </div>

                                                {/* Texto del paso con animaciones */}
                                                <div className="ml-4 flex-1 overflow-hidden">
                                                    <p className={`
                                                        font-medium text-sm transition-all duration-300 ease-in-out
                                                        ${step.number === currentStep
                                                            ? 'text-primary font-semibold transform translate-x-1'
                                                            : step.number < currentStep
                                                                ? 'text-green-600'
                                                                : 'text-gray-600'
                                                        }
                                                    `}>
                                                        {step.title}
                                                    </p>

                                                    {/* Barra de progreso debajo del texto activo */}
                                                    {step.number === currentStep && (
                                                        <div className="mt-1 h-0.5 bg-primary rounded-full transform origin-left animate-in slide-in-from-left-full duration-500"></div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Línea conectora con animación */}
                                            {index < steps.length - 1 && (
                                                <div className="ml-5 w-px h-8 relative">
                                                    {/* Línea base */}
                                                    <div className="absolute inset-0 bg-gray-300 transition-colors duration-300"></div>

                                                    {/* Línea de progreso animada */}
                                                    {step.number < currentStep && (
                                                        <div className="absolute inset-0 bg-green-500 transform origin-top animate-in slide-in-from-top duration-700"></div>
                                                    )}

                                                    {/* Línea activa */}
                                                    {step.number === currentStep && (
                                                        <div className="absolute inset-0 bg-primary/50"></div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>

                                {/* Indicador de progreso general */}
                                <div className="mt-6 p-3 bg-gray-50 rounded-lg border">
                                    <div className="flex items-center justify-between text-xs text-gray-600 mb-2">
                                        <span>Progreso</span>
                                        <span>{Math.round((currentStep / steps.length) * 100)}%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className="bg-primary h-2 rounded-full transition-all duration-700 ease-out"
                                            style={{ width: `${(currentStep / steps.length) * 100}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Contenido principal - Columna derecha */}
                        <div className="lg:col-span-3">

                            {/* Contenido del paso actual con animación */}
                            <div className={`
                                transition-all duration-300 ease-in-out
                                ${isTransitioning ? 'opacity-0 transform translate-x-4' : 'opacity-100 transform translate-x-0'}
                            `}>
                                {currentStep === 1 && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-xl">Información Personal</CardTitle>
                                <CardDescription className="space-y-2">
                                    <p><strong>Datos Personales</strong></p>
                                    <p>Escriba los datos solicitados tal como aparecen en su documento de identidad.</p>
                                    <p>Escriba el número de su documento de identidad sin puntos ni comas.</p>
                                    <p>Escriba la fecha separada por guión (-), o haga uso del calendario ubicando el cursor dentro del campo.</p>
                                    <p>Los campos marcados con (*) son obligatorios</p>
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Cargar historia clínica */}
                                <div className="space-y-2">
                                    <Label className="text-base font-medium">
                                        Cargar historia clínica con nota de ingreso
                                    </Label>
                                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                                        <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                                        <p className="text-sm text-gray-600 mb-2">
                                            Haga clic para cargar documentos o arrastre archivos aquí
                                        </p>
                                        <input
                                            type="file"
                                            id="historia-clinica-upload"
                                            className="hidden"
                                            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (file) {
                                                    setData('historia_clinica', file);
                                                    // Analizar automáticamente con IA
                                                    analyzeFileWithAI(file);
                                                }
                                            }}
                                        />
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            type="button"
                                            onClick={() => document.getElementById('historia-clinica-upload')?.click()}
                                            disabled={isAnalyzingWithAI}
                                        >
                                            <Upload className="h-4 w-4 mr-2" />
                                            {isAnalyzingWithAI ? 'Analizando con IA...' : 'Seleccionar archivo'}
                                        </Button>

                                        {data.historia_clinica && !isAnalyzingWithAI && !aiAnalysisResult && (
                                            <div className="mt-2">
                                                <p className="text-sm text-blue-600">
                                                    📄 Archivo seleccionado: {data.historia_clinica.name}
                                                </p>
                                                <p className="text-xs text-blue-500 mt-1">
                                                    🤖 Analizando automáticamente con IA...
                                                </p>
                                            </div>
                                        )}

                                        {isAnalyzingWithAI && (
                                            <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                                <div className="flex items-center gap-2">
                                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                                                    <span className="text-sm font-medium text-blue-800">Analizando documento con IA...</span>
                                                </div>
                                                <p className="text-xs text-blue-600 mt-1">
                                                    Extrayendo texto y analizando datos del paciente. Esto puede tomar unos segundos.
                                                </p>
                                            </div>
                                        )}

                                        {aiAnalysisResult && (
                                            <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span className="text-green-600">✅</span>
                                                    <span className="text-sm font-medium text-green-800">Datos extraídos automáticamente</span>
                                                </div>
                                                <p className="text-xs text-green-600 mb-2">
                                                    Los campos se han llenado con la información del documento. Revisa los datos y haz clic en "Siguiente".
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Formulario de datos personales */}
                                <div className="grid gap-6 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="tipo_identificacion" className={hasFieldError('tipo_identificacion') ? 'text-red-600' : ''}>
                                            Tipo de identificación *
                                        </Label>
                                        <Select value={data.tipo_identificacion} onValueChange={(value) => setData('tipo_identificacion', value)}>
                                            <SelectTrigger className={hasFieldError('tipo_identificacion') ? 'border-red-500' : ''}>
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
                                        {hasFieldError('tipo_identificacion') && (
                                            <p className="text-sm text-red-600">Este campo es obligatorio</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="numero_identificacion" className={hasFieldError('numero_identificacion') ? 'text-red-600' : ''}>
                                            Número de identificación *
                                        </Label>
                                        <Input
                                            id="numero_identificacion"
                                            value={data.numero_identificacion}
                                            onChange={(e) => setData('numero_identificacion', e.target.value)}
                                            placeholder="Ingrese el número sin puntos ni comas"
                                            className={getFieldErrorClass('numero_identificacion')}
                                        />
                                        {hasFieldError('numero_identificacion') && (
                                            <p className="text-sm text-red-600">Este campo es obligatorio</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="nombre" className={hasFieldError('nombre') ? 'text-red-600' : ''}>
                                            Nombre *
                                        </Label>
                                        <Input
                                            id="nombre"
                                            value={data.nombre}
                                            onChange={(e) => setData('nombre', e.target.value)}
                                            placeholder="Nombres completos"
                                            className={getFieldErrorClass('nombre')}
                                        />
                                        {hasFieldError('nombre') && (
                                            <p className="text-sm text-red-600">Este campo es obligatorio</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="apellidos" className={hasFieldError('apellidos') ? 'text-red-600' : ''}>
                                            Apellidos *
                                        </Label>
                                        <Input
                                            id="apellidos"
                                            value={data.apellidos}
                                            onChange={(e) => setData('apellidos', e.target.value)}
                                            placeholder="Apellidos completos"
                                            className={getFieldErrorClass('apellidos')}
                                        />
                                        {hasFieldError('apellidos') && (
                                            <p className="text-sm text-red-600">Este campo es obligatorio</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="fecha_nacimiento" className={hasFieldError('fecha_nacimiento') ? 'text-red-600' : ''}>
                                            Fecha de nacimiento *
                                        </Label>
                                        <Input
                                            id="fecha_nacimiento"
                                            type="date"
                                            value={data.fecha_nacimiento}
                                            onChange={(e) => handleDateChange(e.target.value)}
                                            placeholder="yyyy-mm-dd"
                                            className={getFieldErrorClass('fecha_nacimiento')}
                                        />
                                        {hasFieldError('fecha_nacimiento') && (
                                            <p className="text-sm text-red-600">Este campo es obligatorio</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="edad">Edad *</Label>
                                        <Input
                                            id="edad"
                                            value={data.edad}
                                            readOnly
                                            placeholder="0"
                                            className="bg-gray-50"
                                        />
                                    </div>

                                    <div className="space-y-2 md:col-span-2">
                                        <Label htmlFor="sexo" className={hasFieldError('sexo') ? 'text-red-600' : ''}>
                                            Sexo *
                                        </Label>
                                        <Select value={data.sexo} onValueChange={(value) => setData('sexo', value)}>
                                            <SelectTrigger className={`w-full md:w-1/2 ${hasFieldError('sexo') ? 'border-red-500' : ''}`}>
                                                <SelectValue placeholder="Seleccione" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="masculino">Masculino</SelectItem>
                                                <SelectItem value="femenino">Femenino</SelectItem>
                                                <SelectItem value="otro">Otro</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {hasFieldError('sexo') && (
                                            <p className="text-sm text-red-600">Este campo es obligatorio</p>
                                        )}
                                    </div>
                                </div>

                                {/* Botón siguiente */}
                                <div className="flex justify-end pt-6">
                                    <Button
                                        onClick={handleNext}
                                        className="px-8"
                                        disabled={isTransitioning}
                                    >
                                        {isTransitioning ? (
                                            <>
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                                Cargando...
                                            </>
                                        ) : (
                                            <>
                                                Siguiente
                                                <ChevronRight className="h-4 w-4 ml-2" />
                                            </>
                                        )}
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
                                                Los campos marcados con (*) son obligatorios
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-6">
                                            <div className="grid gap-6 md:grid-cols-2">
                                                {/* Asegurador */}
                                                <div className="space-y-2">
                                                    <Label htmlFor="asegurador">Asegurador *</Label>
                                                    <Select value={data.asegurador} onValueChange={(value) => setData('asegurador', value)}>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Seleccione" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {aseguradores.map((asegurador) => (
                                                                <SelectItem key={asegurador.value} value={asegurador.value}>
                                                                    {asegurador.label}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </div>

                                                {/* Departamento */}
                                                <div className="space-y-2">
                                                    <Label htmlFor="departamento">Departamento *</Label>
                                                    <Select value={data.departamento} onValueChange={handleDepartamentoChange}>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Seleccione" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {departamentos.map((departamento) => (
                                                                <SelectItem key={departamento.value} value={departamento.value}>
                                                                    {departamento.label}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </div>

                                                {/* Ciudad */}
                                                <div className="space-y-2">
                                                    <Label htmlFor="ciudad">Ciudad *</Label>
                                                    <Select
                                                        value={data.ciudad}
                                                        onValueChange={(value) => setData('ciudad', value)}
                                                        disabled={!data.departamento}
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue placeholder={data.departamento ? "Seleccione" : "Primero seleccione un departamento"} />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {getCiudadesDisponibles().map((ciudad) => (
                                                                <SelectItem key={ciudad.value} value={ciudad.value}>
                                                                    {ciudad.label}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </div>

                                                {/* Institución remitente */}
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

                                            {/* Botones de navegación */}
                                            <div className="flex justify-between pt-6">
                                                <Button
                                                    variant="outline"
                                                    onClick={handlePrevious}
                                                    disabled={isTransitioning}
                                                >
                                                    Anterior
                                                </Button>
                                                <Button
                                                    onClick={handleNext}
                                                    disabled={isTransitioning}
                                                >
                                                    {isTransitioning ? (
                                                        <>
                                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                                            Cargando...
                                                        </>
                                                    ) : (
                                                        <>
                                                            Siguiente
                                                            <ChevronRight className="h-4 w-4 ml-2" />
                                                        </>
                                                    )}
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
                                                Los campos marcados con (*) son obligatorios
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-6">
                                            {/* Primera sección: Información básica */}
                                            <div className="grid gap-6 md:grid-cols-2">
                                                {/* Tipo de paciente */}
                                                <div className="space-y-2">
                                                    <Label htmlFor="tipo_paciente">Tipo de paciente *</Label>
                                                    <Select value={data.tipo_paciente} onValueChange={(value) => setData('tipo_paciente', value)}>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Seleccione" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {tiposPaciente.map((tipo) => (
                                                                <SelectItem key={tipo.value} value={tipo.value}>
                                                                    {tipo.label}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </div>

                                                {/* Clasificación Triage */}
                                                <div className="space-y-2">
                                                    <Label htmlFor="clasificacion_triage">Clasificación Triage *</Label>
                                                    <Select value={data.clasificacion_triage} onValueChange={(value) => setData('clasificacion_triage', value)}>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Seleccione" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {clasificacionesTriage.map((triage) => (
                                                                <SelectItem key={triage.value} value={triage.value}>
                                                                    {triage.label}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </div>

                                                {/* Fecha de ingreso */}
                                                <div className="space-y-2">
                                                    <Label htmlFor="fecha_ingreso">Fecha de ingreso *</Label>
                                                    <Input
                                                        id="fecha_ingreso"
                                                        type="date"
                                                        value={data.fecha_ingreso}
                                                        onChange={(e) => handleFechaIngresoChange(e.target.value)}
                                                        placeholder="yyyy-mm-dd"
                                                    />
                                                </div>

                                                {/* Días hospitalizados */}
                                                <div className="space-y-2">
                                                    <Label htmlFor="dias_hospitalizados">Días hospitalizados</Label>
                                                    <Input
                                                        id="dias_hospitalizados"
                                                        value={data.dias_hospitalizados}
                                                        readOnly
                                                        placeholder="0"
                                                        className="bg-gray-50"
                                                    />
                                                </div>
                                            </div>

                                            {/* Segunda sección: Diagnósticos */}
                                            <div className="space-y-4">
                                                <h3 className="text-lg font-medium">Diagnósticos</h3>
                                                <div className="grid gap-4">
                                                    <div className="space-y-2">
                                                        <Label htmlFor="diagnostico_principal">Diagnóstico principal (CIE-10) *</Label>
                                                        <Input
                                                            id="diagnostico_principal"
                                                            value={data.diagnostico_principal}
                                                            onChange={(e) => setData('diagnostico_principal', e.target.value)}
                                                            placeholder="Código CIE-10 y descripción"
                                                        />
                                                    </div>

                                                    <div className="grid gap-4 md:grid-cols-2">
                                                        <div className="space-y-2">
                                                            <Label htmlFor="diagnostico_1">Diagnóstico No. 1</Label>
                                                            <Input
                                                                id="diagnostico_1"
                                                                value={data.diagnostico_1}
                                                                onChange={(e) => setData('diagnostico_1', e.target.value)}
                                                                placeholder="Código CIE-10 y descripción"
                                                            />
                                                        </div>

                                                        <div className="space-y-2">
                                                            <Label htmlFor="diagnostico_2">Diagnóstico No. 2</Label>
                                                            <Input
                                                                id="diagnostico_2"
                                                                value={data.diagnostico_2}
                                                                onChange={(e) => setData('diagnostico_2', e.target.value)}
                                                                placeholder="Código CIE-10 y descripción"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Tercera sección: Información clínica */}
                                            <div className="space-y-4">
                                                <h3 className="text-lg font-medium">Información Clínica</h3>
                                                <div className="grid gap-4">
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
                                            </div>

                                            {/* Cuarta sección: Signos vitales */}
                                            <div className="space-y-4">
                                                <h3 className="text-lg font-medium">Signos Vitales</h3>
                                                <div className="grid gap-4 md:grid-cols-3">
                                                    <div className="space-y-2">
                                                        <Label htmlFor="frecuencia_cardiaca">Frecuencia Cardíaca (lpm) *</Label>
                                                        <Input
                                                            id="frecuencia_cardiaca"
                                                            type="number"
                                                            min="30"
                                                            max="200"
                                                            value={data.frecuencia_cardiaca}
                                                            onChange={(e) => setData('frecuencia_cardiaca', parseInt(e.target.value) || 0)}
                                                            placeholder="Normal: 60-100 lpm"
                                                        />
                                                        <p className="text-xs text-muted-foreground">
                                                            Rango normal: 60-100 lpm | Bradicardia: &lt;60 | Taquicardia: &gt;100
                                                        </p>
                                                    </div>

                                                    <div className="space-y-2">
                                                        <Label htmlFor="frecuencia_respiratoria">Frecuencia Respiratoria (rpm) *</Label>
                                                        <Input
                                                            id="frecuencia_respiratoria"
                                                            type="number"
                                                            min="8"
                                                            max="40"
                                                            value={data.frecuencia_respiratoria}
                                                            onChange={(e) => setData('frecuencia_respiratoria', parseInt(e.target.value) || 0)}
                                                            placeholder="Normal: 12-20 rpm"
                                                        />
                                                        <p className="text-xs text-muted-foreground">
                                                            Rango normal: 12-20 rpm | Bradipnea: &lt;12 | Taquipnea: &gt;20
                                                        </p>
                                                    </div>

                                                    <div className="space-y-2">
                                                        <Label htmlFor="temperatura">Temperatura (°C) *</Label>
                                                        <Input
                                                            id="temperatura"
                                                            type="number"
                                                            step="0.1"
                                                            min="32"
                                                            max="45"
                                                            value={data.temperatura}
                                                            onChange={(e) => setData('temperatura', parseFloat(e.target.value) || 0)}
                                                            placeholder="Normal: 36.1-37.2°C"
                                                        />
                                                        <p className="text-xs text-muted-foreground">
                                                            Normal: 36.1-37.2°C | Hipotermia: &lt;36°C | Fiebre: &gt;37.5°C
                                                        </p>
                                                    </div>

                                                    <div className="space-y-2">
                                                        <Label htmlFor="tension_sistolica">Tensión Arterial Sistólica (mmHg) *</Label>
                                                        <Input
                                                            id="tension_sistolica"
                                                            type="number"
                                                            min="60"
                                                            max="250"
                                                            value={data.tension_sistolica}
                                                            onChange={(e) => setData('tension_sistolica', parseInt(e.target.value) || 0)}
                                                            placeholder="Normal: 90-120 mmHg"
                                                        />
                                                        <p className="text-xs text-muted-foreground">
                                                            Normal: 90-120 mmHg | Hipotensión: &lt;90 | Hipertensión: &gt;140
                                                        </p>
                                                    </div>

                                                    <div className="space-y-2">
                                                        <Label htmlFor="tension_diastolica">Tensión Arterial Diastólica (mmHg) *</Label>
                                                        <Input
                                                            id="tension_diastolica"
                                                            type="number"
                                                            min="40"
                                                            max="150"
                                                            value={data.tension_diastolica}
                                                            onChange={(e) => setData('tension_diastolica', parseInt(e.target.value) || 0)}
                                                            placeholder="Normal: 60-80 mmHg"
                                                        />
                                                        <p className="text-xs text-muted-foreground">
                                                            Normal: 60-80 mmHg | Hipotensión: &lt;60 | Hipertensión: &gt;90
                                                        </p>
                                                    </div>

                                                    <div className="space-y-2">
                                                        <Label htmlFor="saturacion_oxigeno">Saturación de Oxígeno (%) *</Label>
                                                        <Input
                                                            id="saturacion_oxigeno"
                                                            type="number"
                                                            min="70"
                                                            max="100"
                                                            value={data.saturacion_oxigeno}
                                                            onChange={(e) => setData('saturacion_oxigeno', parseInt(e.target.value) || 0)}
                                                            placeholder="Normal: 95-100%"
                                                        />
                                                        <p className="text-xs text-muted-foreground">
                                                            Normal: 95-100% | Hipoxemia leve: 90-94% | Hipoxemia severa: &lt;90%
                                                        </p>
                                                    </div>

                                                    <div className="space-y-2">
                                                        <Label htmlFor="glucometria">Glucometría (mg/dL)</Label>
                                                        <Input
                                                            id="glucometria"
                                                            type="number"
                                                            min="20"
                                                            max="600"
                                                            value={data.glucometria}
                                                            onChange={(e) => setData('glucometria', parseInt(e.target.value) || 0)}
                                                            placeholder="Normal: 70-110 mg/dL"
                                                        />
                                                        <p className="text-xs text-muted-foreground">
                                                            Normal: 70-110 mg/dL | Hipoglucemia: &lt;70 | Hiperglucemia: &gt;126 (ayunas)
                                                        </p>
                                                    </div>

                                                    <div className="space-y-2">
                                                        <Label htmlFor="escala_glasgow">Escala de Glasgow *</Label>
                                                        <Select value={data.escala_glasgow} onValueChange={(value) => setData('escala_glasgow', value)}>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Seleccione" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {escalasGlasgow.map((escala) => (
                                                                    <SelectItem key={escala.value} value={escala.value}>
                                                                        {escala.label}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Quinta sección: Examen físico y tratamiento */}
                                            <div className="space-y-4">
                                                <h3 className="text-lg font-medium">Examen Físico y Tratamiento</h3>
                                                <div className="grid gap-4">
                                                    <div className="space-y-2">
                                                        <Label htmlFor="examen_fisico">Examen físico *</Label>
                                                        <textarea
                                                            id="examen_fisico"
                                                            value={data.examen_fisico}
                                                            onChange={(e) => setData('examen_fisico', e.target.value)}
                                                            placeholder="Describa los hallazgos del examen físico"
                                                            className="w-full min-h-[120px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-vertical"
                                                        />
                                                    </div>

                                                    <div className="space-y-2">
                                                        <Label htmlFor="tratamiento">Tratamiento *</Label>
                                                        <textarea
                                                            id="tratamiento"
                                                            value={data.tratamiento}
                                                            onChange={(e) => setData('tratamiento', e.target.value)}
                                                            placeholder="Describa el tratamiento administrado"
                                                            className="w-full min-h-[100px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-vertical"
                                                        />
                                                    </div>

                                                    <div className="space-y-2">
                                                        <Label htmlFor="plan_terapeutico">Plan terapéutico</Label>
                                                        <textarea
                                                            id="plan_terapeutico"
                                                            value={data.plan_terapeutico}
                                                            onChange={(e) => setData('plan_terapeutico', e.target.value)}
                                                            placeholder="Describa el plan terapéutico a seguir"
                                                            className="w-full min-h-[100px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-vertical"
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Botones de navegación */}
                                            <div className="flex justify-between pt-6">
                                                <Button
                                                    variant="outline"
                                                    onClick={handlePrevious}
                                                    disabled={isTransitioning}
                                                >
                                                    Anterior
                                                </Button>
                                                <Button
                                                    onClick={handleNext}
                                                    disabled={isTransitioning}
                                                >
                                                    {isTransitioning ? (
                                                        <>
                                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                                            Cargando...
                                                        </>
                                                    ) : (
                                                        <>
                                                            Siguiente
                                                            <ChevronRight className="h-4 w-4 ml-2" />
                                                        </>
                                                    )}
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
                                                Los campos marcados con (*) son obligatorios
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-6">
                                            {/* Primera sección: Información de remisión */}
                                            <div className="space-y-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="motivo_remision">Motivo de remisión *</Label>
                                                    <textarea
                                                        id="motivo_remision"
                                                        value={data.motivo_remision}
                                                        onChange={(e) => setData('motivo_remision', e.target.value)}
                                                        placeholder="Describa detalladamente el motivo por el cual se remite al paciente"
                                                        className="w-full min-h-[120px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-vertical"
                                                    />
                                                </div>
                                            </div>

                                            {/* Segunda sección: Tipo de solicitud y especialidad */}
                                            <div className="grid gap-6 md:grid-cols-2">
                                                <div className="space-y-2">
                                                    <Label htmlFor="tipo_solicitud">Tipo solicitud *</Label>
                                                    <Select value={data.tipo_solicitud} onValueChange={(value) => setData('tipo_solicitud', value)}>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Seleccione" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {tiposSolicitud.map((tipo) => (
                                                                <SelectItem key={tipo.value} value={tipo.value}>
                                                                    {tipo.label}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor="especialidad_solicitada">Especialidad solicitada *</Label>
                                                    <Select value={data.especialidad_solicitada} onValueChange={(value) => setData('especialidad_solicitada', value)}>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Seleccione" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {especialidades.map((especialidad) => (
                                                                <SelectItem key={especialidad.value} value={especialidad.value}>
                                                                    {especialidad.label}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            </div>

                                            {/* Tercera sección: Requerimientos */}
                                            <div className="grid gap-6 md:grid-cols-2">
                                                <div className="space-y-2">
                                                    <Label htmlFor="requerimiento_oxigeno">Requerimiento de oxígeno *</Label>
                                                    <Select value={data.requerimiento_oxigeno} onValueChange={(value) => setData('requerimiento_oxigeno', value)}>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Seleccione" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="NO">NO</SelectItem>
                                                            <SelectItem value="SI">SÍ</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor="tipo_servicio">Tipo de servicio *</Label>
                                                    <Select value={data.tipo_servicio} onValueChange={(value) => setData('tipo_servicio', value)}>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Seleccione" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {tiposServicio.map((servicio) => (
                                                                <SelectItem key={servicio.value} value={servicio.value}>
                                                                    {servicio.label}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            </div>

                                            {/* Cuarta sección: Tipo de apoyo */}
                                            <div className="space-y-2">
                                                <Label htmlFor="tipo_apoyo">Tipo de apoyo</Label>
                                                <Select value={data.tipo_apoyo} onValueChange={(value) => setData('tipo_apoyo', value)}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Seleccione" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {tiposApoyo.map((apoyo) => (
                                                            <SelectItem key={apoyo.value} value={apoyo.value}>
                                                                {apoyo.label}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            {/* Botones de navegación */}
                                            <div className="flex justify-between pt-6">
                                                <Button
                                                    variant="outline"
                                                    onClick={handlePrevious}
                                                    disabled={isTransitioning}
                                                >
                                                    Anterior
                                                </Button>
                                                <Button
                                                    onClick={() => {
                                                        // Validar paso 4 antes de finalizar
                                                        if (validateStep4()) {
                                                            console.log('Datos a enviar:', data);

                                                            // Enviar formulario al servidor
                                                            post(route('medico.ingresar-registro.store'), {
                                                                onStart: () => {
                                                                    console.log('Iniciando envío...');
                                                                },
                                                                onSuccess: (response) => {
                                                                    console.log('Éxito:', response);
                                                                    toast.success("¡Registro médico guardado exitosamente!", {
                                                                        description: "Los datos del paciente han sido registrados en el sistema.",
                                                                        duration: 4000,
                                                                    });
                                                                    // Limpiar formulario después del éxito
                                                                    reset();
                                                                    setCurrentStep(1);
                                                                    setValidationErrors([]);
                                                                },
                                                                onError: (errors) => {
                                                                    console.error('Errores de validación:', errors);
                                                                    toast.error("Error al guardar el registro", {
                                                                        description: "Por favor revise los datos e intente nuevamente.",
                                                                        duration: 5000,
                                                                    });
                                                                },
                                                                onFinish: () => {
                                                                    console.log('Envío finalizado');
                                                                }
                                                            });
                                                        }
                                                    }}
                                                    disabled={isTransitioning}
                                                    className="bg-green-600 hover:bg-green-700"
                                                >
                                                    {isTransitioning ? (
                                                        <>
                                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                                            Enviando...
                                                        </>
                                                    ) : (
                                                        <>
                                                            Finalizar Registro
                                                            <ChevronRight className="h-4 w-4 ml-2" />
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
        </AppLayout>
    );
}

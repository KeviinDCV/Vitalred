import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { Brain, AlertTriangle, CheckCircle, XCircle, ArrowLeft, ChevronDown, ChevronRight, Upload, FileText, Loader2, Heart, Users, Stethoscope } from 'lucide-react';
import { useState, useRef } from 'react';
import axios from 'axios';

// Interfaces para el análisis de priorización
interface CriterioAnalisis {
    nombre: string;
    valor: string;
    puntuacion: number;
    categoria: 'Muy alto' | 'Alto' | 'Intermedio' | 'Bajo' | 'Muy bajo' | 'No priorizado';
    descripcion: string;
}

interface AnalisisPriorizacion {
    paciente: {
        id: number;
        nombre: string;
        apellidos: string;
        numero_identificacion: string;
        edad: number;
        tipo_paciente: string;
    };
    resultado: {
        prioriza: boolean;
        puntuacion_total: number;
        puntuacion_maxima: number;
        porcentaje: number;
        nivel_prioridad: 'ALTA' | 'MEDIA' | 'BAJA';
    };
    criterios: {
        datos_generales: CriterioAnalisis[];
        datos_clinicos: CriterioAnalisis[];
        signos_vitales: CriterioAnalisis[];
        sintomas: CriterioAnalisis[];
        servicios: CriterioAnalisis[];
        especialidades: CriterioAnalisis[];
        apoyo_diagnostico: CriterioAnalisis[];
        convenios: CriterioAnalisis[];
    };
    razonamiento: string;
    fecha_analisis: string;
}

interface Props {
    analisis: AnalisisPriorizacion;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Consulta Pacientes',
        href: '/medico/consulta-pacientes',
    },
    {
        title: 'Análisis IA Priorización',
        href: '#',
    },
];

export default function AnalisisPriorizacion({ analisis: analisisInicial }: Props) {
    const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
    const [archivo, setArchivo] = useState<File | null>(null);
    const [cargando, setCargando] = useState(false);
    const [procesando, setProcesando] = useState(false);
    const [analisis, setAnalisis] = useState<AnalisisPriorizacion | null>(analisisInicial || null);
    const [error, setError] = useState<string>('');
    const [progreso, setProgreso] = useState(0);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const toggleSection = (section: string) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    const handleArchivoSeleccionado = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            // Validar tipos de archivo permitidos
            const tiposPermitidos = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg', 'text/plain', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
            
            if (!tiposPermitidos.includes(file.type)) {
                setError('Tipo de archivo no permitido. Solo se aceptan PDF, imágenes (JPG, PNG) y documentos de Word.');
                return;
            }

            if (file.size > 10 * 1024 * 1024) { // 10MB máximo
                setError('El archivo es demasiado grande. Máximo 10MB permitido.');
                return;
            }

            setArchivo(file);
            setError('');
            setAnalisis(null);
        }
    };

    const handleCargarArchivo = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleAnalizar = async () => {
        if (!archivo) {
            setError('Por favor selecciona un archivo primero.');
            return;
        }

        setCargando(true);
        setProcesando(false);
        setProgreso(10);
        setError('');

        try {
            // Paso 1: Subir y extraer datos del archivo
            const formData = new FormData();
            formData.append('historia_clinica', archivo);

            setProgreso(30);

            const extractResponse = await axios.post('/medico/ai/extraer-datos-documento', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
                }
            });

            setProgreso(60);
            setProcesando(true);

            if (extractResponse.data.success) {
                // Paso 2: Analizar con IA de priorización
                const analisisResponse = await axios.post('/medico/priorizacion/analizar', {
                    datos_paciente: extractResponse.data.data
                });

                setProgreso(100);
                
                if (analisisResponse.data) {
                    setAnalisis(analisisResponse.data);
                } else {
                    throw new Error('No se pudo completar el análisis de priorización');
                }
            } else {
                throw new Error(extractResponse.data.message || 'Error al procesar el archivo');
            }

        } catch (error: unknown) {
                        setError(error.response?.data?.message || error.message || 'Error desconocido al procesar el archivo');
        } finally {
            setCargando(false);
            setProcesando(false);
            setProgreso(0);
        }
    };

    const handleNuevoAnalisis = () => {
        setArchivo(null);
        setAnalisis(null);
        setError('');
        setProgreso(0);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const getCategoriaColor = (categoria: string) => {
        const colores: Record<string, string> = {
            'Muy alto': 'bg-red-100 text-red-800 border-red-200',
            'Alto': 'bg-orange-100 text-orange-800 border-orange-200',
            'Intermedio': 'bg-yellow-100 text-yellow-800 border-yellow-200',
            'Bajo': 'bg-blue-100 text-blue-800 border-blue-200',
            'Muy bajo': 'bg-gray-100 text-gray-800 border-gray-200',
            'No priorizado': 'bg-slate-100 text-slate-600 border-slate-200'
        };
        return colores[categoria] || colores['No priorizado'];
    };

    const getPuntuacionColor = (puntuacion: number) => {
        if (puntuacion >= 4) return 'text-red-600';
        if (puntuacion >= 3) return 'text-orange-600';
        if (puntuacion >= 2) return 'text-yellow-600';
        if (puntuacion >= 1) return 'text-blue-600';
        return 'text-gray-600';
    };

    const renderCriterio = (criterio: CriterioAnalisis) => (
        <div key={criterio.nombre} className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm">{criterio.nombre}</span>
                    <Badge 
                        variant="outline" 
                        className={`text-xs ${getCategoriaColor(criterio.categoria)}`}
                    >
                        {criterio.categoria}
                    </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{criterio.valor}</p>
                {criterio.descripcion && (
                    <p className="text-xs text-muted-foreground mt-1">{criterio.descripcion}</p>
                )}
            </div>
            <div className="text-right">
                <span className={`text-lg font-bold ${getPuntuacionColor(criterio.puntuacion)}`}>
                    {criterio.puntuacion}
                </span>
                <p className="text-xs text-muted-foreground">pts</p>
            </div>
        </div>
    );

    const renderSeccionCriterios = (
        titulo: string,
        icono: React.ReactNode,
        criterios: CriterioAnalisis[],
        seccionKey: string
    ) => {
        const puntuacionTotal = criterios.reduce((sum, c) => sum + c.puntuacion, 0);
        const isExpanded = seccionExpandida === seccionKey;

        return (
            <Card className="mb-4">
                <CardHeader className="pb-3">
                    <div 
                        className="flex items-center justify-between cursor-pointer"
                        onClick={() => toggleSeccion(seccionKey)}
                    >
                        <div className="flex items-center gap-3">
                            {icono}
                            <div>
                                <CardTitle className="text-base">{titulo}</CardTitle>
                                <CardDescription className="text-sm">
                                    {criterios.length} criterio(s) evaluado(s)
                                </CardDescription>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="text-right">
                                <span className={`text-lg font-bold ${getPuntuacionColor(puntuacionTotal)}`}>
                                    {puntuacionTotal}
                                </span>
                                <p className="text-xs text-muted-foreground">puntos</p>
                            </div>
                            <Button variant="ghost" size="sm">
                                {isExpanded ? '−' : '+'}
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                {isExpanded && (
                    <CardContent className="space-y-3">
                        {criterios.map(renderCriterio)}
                    </CardContent>
                )}
            </Card>
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Análisis IA Priorización - Vital Red" />

            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => router.visit('/medico/consulta-pacientes')}
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Volver
                        </Button>
                        <div>
                            <h1 className="text-2xl font-bold">Análisis de Priorización IA</h1>
                            <p className="text-muted-foreground">
                                Vista temporal para evaluación del algoritmo de priorización
                            </p>
                        </div>
                    </div>
                </div>

                {/* Información del Paciente */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Users className="h-5 w-5" />
                            Información del Paciente
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div>
                                <p className="text-sm text-muted-foreground">Nombre completo</p>
                                <p className="font-medium">{analisis.paciente.nombre} {analisis.paciente.apellidos}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Identificación</p>
                                <p className="font-medium">{analisis.paciente.numero_identificacion}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Edad</p>
                                <p className="font-medium">{analisis.paciente.edad} años</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Tipo de paciente</p>
                                <Badge variant="outline">{analisis.paciente.tipo_paciente}</Badge>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Resultado de Priorización */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Brain className="h-5 w-5" />
                            Resultado del Análisis IA
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="text-center">
                                <div className={`inline-flex items-center gap-2 px-6 py-3 rounded-full text-lg font-bold ${
                                    analisis.resultado.prioriza 
                                        ? 'bg-green-100 text-green-800 border border-green-200' 
                                        : 'bg-red-100 text-red-800 border border-red-200'
                                }`}>
                                    {analisis.resultado.prioriza ? (
                                        <CheckCircle className="h-6 w-6" />
                                    ) : (
                                        <XCircle className="h-6 w-6" />
                                    )}
                                    {analisis.resultado.prioriza ? 'PRIORIZA' : 'NO PRIORIZA'}
                                </div>
                            </div>
                            
                            <div>
                                <p className="text-sm text-muted-foreground mb-2">Puntuación Total</p>
                                <div className="flex items-center gap-3">
                                    <span className="text-2xl font-bold">{analisis.resultado.puntuacion_total}</span>
                                    <span className="text-muted-foreground">/ {analisis.resultado.puntuacion_maxima}</span>
                                </div>
                                <Progress 
                                    value={analisis.resultado.porcentaje} 
                                    className="mt-2"
                                />
                                <p className="text-xs text-muted-foreground mt-1">
                                    {analisis.resultado.porcentaje.toFixed(1)}% del máximo posible
                                </p>
                            </div>

                            <div>
                                <p className="text-sm text-muted-foreground mb-2">Nivel de Prioridad</p>
                                <Badge 
                                    variant="outline" 
                                    className={`text-lg px-4 py-2 ${
                                        analisis.resultado.nivel_prioridad === 'ALTA' ? 'bg-red-100 text-red-800 border-red-200' :
                                        analisis.resultado.nivel_prioridad === 'MEDIA' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                                        'bg-gray-100 text-gray-800 border-gray-200'
                                    }`}
                                >
                                    {analisis.resultado.nivel_prioridad}
                                </Badge>
                                <p className="text-xs text-muted-foreground mt-2">
                                    Fecha de análisis: {new Date(analisis.fecha_analisis).toLocaleString('es-ES')}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Razonamiento de la IA */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5" />
                            Razonamiento del Algoritmo
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="bg-muted/50 p-4 rounded-lg">
                            <p className="text-sm leading-relaxed">{analisis.razonamiento}</p>
                        </div>
                    </CardContent>
                </Card>

                {/* Desglose por Criterios */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <FileText className="h-5 w-5" />
                            Desglose Detallado por Criterios
                        </CardTitle>
                        <CardDescription>
                            Haz clic en cada sección para ver los detalles de evaluación
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {renderSeccionCriterios(
                            'Datos Generales', 
                            <Users className="h-5 w-5 text-blue-600" />, 
                            analisis.criterios.datos_generales, 
                            'datos_generales'
                        )}
                        
                        {renderSeccionCriterios(
                            'Datos Clínicos', 
                            <FileText className="h-5 w-5 text-green-600" />, 
                            analisis.criterios.datos_clinicos, 
                            'datos_clinicos'
                        )}
                        
                        {renderSeccionCriterios(
                            'Signos Vitales', 
                            <Heart className="h-5 w-5 text-red-600" />, 
                            analisis.criterios.signos_vitales, 
                            'signos_vitales'
                        )}
                        
                        {renderSeccionCriterios(
                            'Síntomas', 
                            <Stethoscope className="h-5 w-5 text-purple-600" />, 
                            analisis.criterios.sintomas, 
                            'sintomas'
                        )}
                        
                        {renderSeccionCriterios(
                            'Servicios Solicitados', 
                            <FileText className="h-5 w-5 text-indigo-600" />, 
                            analisis.criterios.servicios, 
                            'servicios'
                        )}
                        
                        {renderSeccionCriterios(
                            'Especialidades', 
                            <Stethoscope className="h-5 w-5 text-teal-600" />, 
                            analisis.criterios.especialidades, 
                            'especialidades'
                        )}
                        
                        {renderSeccionCriterios(
                            'Apoyo Diagnóstico', 
                            <Brain className="h-5 w-5 text-orange-600" />, 
                            analisis.criterios.apoyo_diagnostico, 
                            'apoyo_diagnostico'
                        )}
                        
                        {renderSeccionCriterios(
                            'Convenios (Evaluado al final)', 
                            <FileText className="h-5 w-5 text-gray-600" />, 
                            analisis.criterios.convenios, 
                            'convenios'
                        )}
                    </CardContent>
                </Card>

                {/* Nota temporal */}
                <Card className="border-dashed border-2 border-yellow-200 bg-yellow-50/50">
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-2 text-yellow-800 mb-2">
                            <AlertTriangle className="h-5 w-5" />
                            <span className="font-medium">Vista Temporal de Prueba</span>
                        </div>
                        <p className="text-sm text-yellow-700">
                            Esta vista está diseñada para evaluar la efectividad del algoritmo de priorización IA. 
                            Una vez validado su correcto funcionamiento, esta interfaz será reemplazada por la 
                            integración directa en el sistema principal.
                        </p>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}

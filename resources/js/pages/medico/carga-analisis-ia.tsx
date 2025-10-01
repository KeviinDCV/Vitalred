import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { Brain, FileText, Upload, AlertTriangle, CheckCircle, XCircle, ArrowLeft, Loader2 } from 'lucide-react';
import { useState, useRef } from 'react';
import axios from 'axios';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Consulta Pacientes',
        href: '/medico/consulta-pacientes',
    },
    {
        title: 'Análisis IA con Carga de Archivo',
        href: '#',
    },
];

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
    criterios: any;
    razonamiento: string;
    fecha_analisis: string;
}

export default function CargaAnalisisIA() {
    const [archivo, setArchivo] = useState<File | null>(null);
    const [cargando, setCargando] = useState(false);
    const [procesando, setProcesando] = useState(false);
    const [analisis, setAnalisis] = useState<AnalisisPriorizacion | null>(null);
    const [error, setError] = useState<string>('');
    const [progreso, setProgreso] = useState(0);
    const fileInputRef = useRef<HTMLInputElement>(null);

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

        } catch (error: any) {
            console.error('Error en el análisis:', error);
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

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Análisis IA con Carga de Archivo - Vital Red" />

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
                                Carga una historia clínica y obtén el análisis de priorización
                            </p>
                        </div>
                    </div>
                </div>

                {/* Sección de Carga de Archivo */}
                {!analisis && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Upload className="h-5 w-5" />
                                Cargar Historia Clínica
                            </CardTitle>
                            <CardDescription>
                                Selecciona un archivo de historia clínica para analizar con IA
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Área de carga */}
                            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                                <div className="mx-auto flex max-w-sm flex-col items-center gap-4">
                                    <FileText className="h-12 w-12 text-muted-foreground" />
                                    
                                    {archivo ? (
                                        <div className="space-y-2">
                                            <p className="text-sm font-medium text-green-700">
                                                Archivo seleccionado:
                                            </p>
                                            <div className="bg-green-50 border border-green-200 rounded-md p-3">
                                                <p className="text-sm font-medium">{archivo.name}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    Tamaño: {(archivo.size / 1024 / 1024).toFixed(2)} MB
                                                </p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="space-y-2">
                                            <p className="text-sm text-muted-foreground">
                                                Haz clic para seleccionar un archivo o arrástralo aquí
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                PDF, JPG, PNG, DOC, DOCX (máx. 10MB)
                                            </p>
                                        </div>
                                    )}

                                    <div className="flex gap-2">
                                        <Button 
                                            onClick={handleCargarArchivo}
                                            variant="outline"
                                            disabled={cargando}
                                        >
                                            <Upload className="h-4 w-4 mr-2" />
                                            Seleccionar Archivo
                                        </Button>

                                        {archivo && (
                                            <Button 
                                                onClick={handleAnalizar}
                                                disabled={cargando}
                                                className="bg-green-600 hover:bg-green-700"
                                            >
                                                {cargando ? (
                                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                                ) : (
                                                    <Brain className="h-4 w-4 mr-2" />
                                                )}
                                                {cargando ? 'Analizando...' : 'Analizar con IA'}
                                            </Button>
                                        )}
                                    </div>

                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        onChange={handleArchivoSeleccionado}
                                        accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.txt"
                                        className="hidden"
                                    />
                                </div>
                            </div>

                            {/* Progreso */}
                            {cargando && (
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between text-sm">
                                        <span>Procesando archivo...</span>
                                        <span>{progreso}%</span>
                                    </div>
                                    <Progress value={progreso} className="h-2" />
                                    <div className="text-center">
                                        <p className="text-sm text-muted-foreground">
                                            {progreso < 40 && 'Extrayendo datos del documento...'}
                                            {progreso >= 40 && progreso < 80 && 'Procesando información médica...'}
                                            {progreso >= 80 && 'Generando análisis de priorización...'}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Error */}
                            {error && (
                                <div className="bg-red-50 border border-red-200 rounded-md p-4">
                                    <div className="flex items-center gap-2 text-red-700">
                                        <AlertTriangle className="h-5 w-5" />
                                        <span className="font-medium">Error</span>
                                    </div>
                                    <p className="text-sm text-red-600 mt-2">{error}</p>
                                </div>
                            )}

                            {/* Instrucciones */}
                            <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                                <h4 className="font-medium text-blue-800 mb-2">Instrucciones:</h4>
                                <ul className="text-sm text-blue-700 space-y-1">
                                    <li>• Selecciona un archivo de historia clínica (PDF, imagen o documento)</li>
                                    <li>• La IA extraerá automáticamente los datos médicos relevantes</li>
                                    <li>• Se analizarán los 8 criterios de priorización médica</li>
                                    <li>• Recibirás un análisis completo con recomendación de priorización</li>
                                </ul>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Resultado del Análisis */}
                {analisis && (
                    <div className="space-y-6">
                        {/* Información del Paciente */}
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle className="flex items-center gap-2">
                                        <CheckCircle className="h-5 w-5 text-green-600" />
                                        Análisis Completado
                                    </CardTitle>
                                    <Button 
                                        onClick={handleNuevoAnalisis}
                                        variant="outline"
                                        size="sm"
                                    >
                                        Nuevo Análisis
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                    <div>
                                        <p className="text-sm text-muted-foreground">Archivo analizado</p>
                                        <p className="font-medium">{archivo?.name}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Paciente</p>
                                        <p className="font-medium">{analisis.paciente.nombre} {analisis.paciente.apellidos}</p>
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

                        {/* Razonamiento */}
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
                    </div>
                )}

                {/* Nota temporal */}
                <Card className="border-dashed border-2 border-yellow-200 bg-yellow-50/50">
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-2 text-yellow-800 mb-2">
                            <AlertTriangle className="h-5 w-5" />
                            <span className="font-medium">Vista Temporal de Prueba</span>
                        </div>
                        <p className="text-sm text-yellow-700">
                            Esta funcionalidad permite cargar y analizar historias clínicas reales con IA. 
                            El sistema extrae automáticamente los datos médicos del documento y aplica el 
                            algoritmo de priorización para determinar la urgencia del caso.
                        </p>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}

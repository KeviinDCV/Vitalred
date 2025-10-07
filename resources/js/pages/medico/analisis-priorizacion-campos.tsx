import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { Brain, AlertTriangle, CheckCircle, XCircle, ArrowLeft, Upload, FileText, Loader2, ChevronDown, ChevronRight, Stethoscope, Save, Edit } from 'lucide-react';
import { useState, useRef } from 'react';
import axios from 'axios';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Consulta Pacientes',
        href: '/medico/consulta-pacientes',
    },
    {
        title: 'Análisis IA - Prueba',
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
    texto_extraido?: string;
    longitud_texto?: number;
    razonamiento_priorizacion?: {
        prioriza: boolean;
        color: 'verde' | 'rojo';
        razonamiento: string;
        puntaje_total: number;
        criterios_evaluados: any[];
    };
}

export default function AnalisisPriorizacion() {
    const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
    const [archivo, setArchivo] = useState<File | null>(null);
    const [cargando, setCargando] = useState(false);
    const [procesando, setProcesando] = useState(false);
    const [analisis, setAnalisis] = useState<AnalisisPriorizacion | null>(null);
    const [error, setError] = useState<string>('');
    const [progreso, setProgreso] = useState(0);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Estados para los tres campos de análisis manual
    const [nombreDocumento, setNombreDocumento] = useState('');
    const [analisisPrecisa, setAnalisisPrecisa] = useState('');
    const [analisisVitalRed, setAnalisisVitalRed] = useState('');
    const [analisisMedico, setAnalisisMedico] = useState('');
    const [guardando, setGuardando] = useState(false);
    const [guardadoExitoso, setGuardadoExitoso] = useState(false);

    const toggleSection = (section: string) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    const handleArchivoSeleccionado = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const tiposPermitidos = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg', 'text/plain', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
            
            if (!tiposPermitidos.includes(file.type)) {
                setError('Tipo de archivo no permitido. Solo se aceptan PDF, imágenes (JPG, PNG) y documentos de Word.');
                return;
            }

            if (file.size > 10 * 1024 * 1024) {
                setError('El archivo es demasiado grande. Máximo 10MB permitido.');
                return;
            }

            setArchivo(file);
            setError('');
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
                const textoExtraido = extractResponse.data.data.texto_extraido || extractResponse.data.texto_extraido || '';
                const longitudTexto = textoExtraido.length;

                const analisisResponse = await axios.post('/medico/priorizacion/analizar', {
                    datos_paciente: {
                        ...extractResponse.data.data,
                        texto_completo_extraido: textoExtraido,
                        longitud_documento: longitudTexto,
                        solicitar_extraccion_completa: true
                    },
                    config_analisis: {
                        extraer_todos_los_datos: true,
                        incluir_signos_vitales: true,
                        incluir_sintomas: true,
                        incluir_diagnosticos: true,
                        incluir_medicamentos: true,
                        incluir_convenios: true,
                        aplicar_algoritmo_priorizacion: true
                    }
                });

                setProgreso(100);
                
                if (analisisResponse.data && 
                    analisisResponse.data.paciente && 
                    analisisResponse.data.paciente.nombre && 
                    analisisResponse.data.resultado && 
                    analisisResponse.data.razonamiento &&
                    analisisResponse.data.razonamiento !== "Error al procesar análisis con IA. Se requiere revisión manual.") {
                    
                    const analisisCompleto = {
                        ...analisisResponse.data,
                        texto_extraido: textoExtraido,
                        longitud_texto: longitudTexto
                    };
                    setAnalisis(analisisCompleto);
                } else {
                    throw new Error('🤖 La IA no pudo procesar correctamente el documento. Verifique que el archivo contenga una historia clínica válida con datos del paciente.');
                }
            } else {
                throw new Error(extractResponse.data.message || 'Error al procesar el archivo');
            }

        } catch (error: any) {
            console.error('Error en el análisis:', error);
            setAnalisis(null);
            
            if (error.response?.status === 503 && error.response?.data?.error_type === 'api_overload') {
                setError('⚠️ El servicio de IA está temporalmente sobrecargado. Por favor intenta nuevamente en unos minutos. 🔄');
            } else if (error.message.includes('🤖 La IA no pudo procesar')) {
                setError(error.message);
            } else {
                setError(`❌ Error en el procesamiento: ${error.response?.data?.message || error.message || 'Error desconocido al procesar el archivo'}\n\n💡 Sugerencia: Verifique los logs del backend para más detalles técnicos.`);
            }
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

    const handleGuardarAnalisis = async () => {
        // Validar que todos los campos estén llenos
        if (!nombreDocumento.trim()) {
            setError('Por favor ingrese el nombre del documento.');
            return;
        }
        if (!analisisPrecisa.trim() || !analisisVitalRed.trim() || !analisisMedico.trim()) {
            setError('Por favor complete todos los campos de análisis manual.');
            return;
        }
        if (!analisis) {
            setError('Primero debe analizar un documento con la IA.');
            return;
        }

        setGuardando(true);
        setError('');
        setGuardadoExitoso(false);

        try {
            const response = await axios.post('/medico/priorizacion/guardar-analisis-manual', {
                nombre_documento: nombreDocumento,
                nombre_archivo_original: archivo?.name || '',
                analisis_precisa: analisisPrecisa,
                analisis_vital_red: analisisVitalRed,
                analisis_medico: analisisMedico,
                texto_extraido: analisis.texto_extraido || '',
                analisis_ia: JSON.stringify(analisis),
                razonamiento_priorizacion: analisis.razonamiento_priorizacion || null,
            }, {
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
            });

            if (response.data.success) {
                setGuardadoExitoso(true);
                console.log('Análisis guardado exitosamente:', response.data);
                
                // Limpiar campos después de guardar
                setTimeout(() => {
                    setNombreDocumento('');
                    setAnalisisPrecisa('');
                    setAnalisisVitalRed('');
                    setAnalisisMedico('');
                    setGuardadoExitoso(false);
                }, 3000);
            }
        } catch (error: any) {
            console.error('Error guardando análisis:', error);
            setError(error.response?.data?.message || 'Error al guardar el análisis');
        } finally {
            setGuardando(false);
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
            <Head title="Análisis de Priorización IA - Prueba - Vital Red" />

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

                {/* PASO 1: Sección de Carga de Archivo (se muestra si no hay análisis) */}
                {!analisis && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Upload className="h-5 w-5" />
                                1. Cargar Historia Clínica o Documento Médico
                            </CardTitle>
                            <CardDescription>
                                Selecciona un archivo de historia clínica para extraer datos y analizar con IA
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                                <div className="mx-auto flex max-w-sm flex-col items-center gap-4">
                                    <FileText className="h-12 w-12 text-muted-foreground" />
                                    
                                    {archivo ? (
                                        <div className="space-y-2">
                                            <p className="text-sm font-medium text-green-700">
                                                ✅ Archivo seleccionado:
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
                                                {cargando ? 'Analizando...' : '2. Analizar con IA'}
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

                            {cargando && (
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between text-sm">
                                        <span>
                                            {progreso < 40 && '📄 Extrayendo texto del documento...'}
                                            {progreso >= 40 && progreso < 80 && '🔍 Procesando información médica...'}
                                            {progreso >= 80 && '🧠 Generando análisis de priorización...'}
                                        </span>
                                        <span>{progreso}%</span>
                                    </div>
                                    <Progress value={progreso} className="h-2" />
                                </div>
                            )}

                            {error && (
                                <div className="bg-red-50 border border-red-200 rounded-md p-4">
                                    <div className="flex items-center gap-2 text-red-700">
                                        <AlertTriangle className="h-5 w-5" />
                                        <span className="font-medium">Error</span>
                                    </div>
                                    <p className="text-sm text-red-600 mt-2">{error}</p>
                                </div>
                            )}

                            <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                                <h4 className="font-medium text-blue-800 mb-2">📋 Instrucciones:</h4>
                                <ul className="text-sm text-blue-700 space-y-1">
                                    <li>• <strong>Paso 1:</strong> Selecciona un archivo de historia clínica (PDF, imagen o documento)</li>
                                    <li>• <strong>Paso 2:</strong> La IA extraerá automáticamente los datos médicos relevantes</li>
                                    <li>• <strong>Paso 3:</strong> Se analizarán los 8 criterios de priorización médica</li>
                                    <li>• <strong>Resultado:</strong> Recibirás análisis completo Verde/Rojo con desglose detallado</li>
                                </ul>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* PASO 2: Resultado del Análisis (se muestra solo después de analizar) */}
                {analisis && (
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle className="flex items-center gap-2">
                                        <CheckCircle className="h-5 w-5 text-green-600" />
                                        ✅ Análisis IA Completado
                                    </CardTitle>
                                    <Button 
                                        onClick={handleNuevoAnalisis}
                                        variant="outline"
                                        size="sm"
                                    >
                                        Analizar Nuevo Archivo
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                    <div>
                                        <p className="text-sm text-muted-foreground">📄 Archivo procesado</p>
                                        <p className="font-medium">{archivo?.name}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">👤 Paciente extraído</p>
                                        <p className="font-medium">{analisis.paciente.nombre} {analisis.paciente.apellidos}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">🎂 Edad</p>
                                        <p className="font-medium">{analisis.paciente.edad} años</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">👥 Tipo</p>
                                        <Badge variant="outline">{analisis.paciente.tipo_paciente}</Badge>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {analisis.texto_extraido && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <FileText className="h-5 w-5" />
                                        📋 Texto Extraído del Documento
                                    </CardTitle>
                                    <CardDescription>
                                        Texto completo extraído del archivo ({analisis.longitud_texto || 0} caracteres)
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="bg-muted/30 border rounded-lg p-4 max-h-96 overflow-y-auto">
                                        <pre className="text-sm whitespace-pre-wrap font-mono text-muted-foreground leading-relaxed">
                                            {analisis.texto_extraido}
                                        </pre>
                                    </div>
                                    <div className="mt-3 flex items-center gap-4 text-sm text-muted-foreground">
                                        <span>📊 Longitud: {analisis.longitud_texto || 0} caracteres</span>
                                        <span>📄 Páginas: Todas las páginas procesadas</span>
                                        <span>✅ Estado: Extracción completa</span>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {analisis.razonamiento_priorizacion && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Brain className="h-5 w-5" />
                                        🎯 Análisis de Priorización Médica
                                    </CardTitle>
                                    <CardDescription>
                                        Análisis basado en los 8 criterios específicos de priorización
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div className="text-center">
                                            <div className={`inline-flex items-center gap-3 px-8 py-4 rounded-full text-xl font-bold border-2 ${
                                                analisis.razonamiento_priorizacion.color === 'verde' 
                                                    ? 'bg-green-100 text-green-800 border-green-300' 
                                                    : 'bg-red-100 text-red-800 border-red-300'
                                            }`}>
                                                {analisis.razonamiento_priorizacion.color === 'verde' ? (
                                                    <CheckCircle className="h-8 w-8" />
                                                ) : (
                                                    <XCircle className="h-8 w-8" />
                                                )}
                                                {analisis.razonamiento_priorizacion.prioriza ? '🟢 PRIORIZA' : '🔴 NO PRIORIZA'}
                                            </div>
                                        </div>

                                        <div className="bg-muted/50 p-4 rounded-lg">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="font-medium">🏥 Decisión Clínica:</span>
                                                <span className={`font-bold text-lg ${analisis.razonamiento_priorizacion.prioriza ? 'text-green-700' : 'text-red-700'}`}>
                                                    {analisis.razonamiento_priorizacion.prioriza ? 'PRIORIZAR' : 'NO PRIORIZAR'}
                                                </span>
                                            </div>
                                            <div className="text-sm text-muted-foreground">
                                                <p>• Análisis basado en criterios oficiales de priorización médica</p>
                                                <p>• Evaluación integral considerando factores de riesgo y urgencia clínica</p>
                                            </div>
                                        </div>

                                        <div className="bg-muted/30 border rounded-lg p-6">
                                            <h4 className="font-semibold mb-3 flex items-center gap-2">
                                                <AlertTriangle className="h-4 w-4" />
                                                Razonamiento Detallado de la IA
                                            </h4>
                                            <div className="text-sm leading-relaxed whitespace-pre-wrap max-h-96 overflow-y-auto">
                                                {analisis.razonamiento_priorizacion.razonamiento}
                                            </div>
                                            <div className="text-xs text-muted-foreground mt-2 pt-2 border-t">
                                                📝 Caracteres: {analisis.razonamiento_priorizacion.razonamiento?.length || 0}
                                            </div>
                                        </div>

                                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                            <h5 className="font-medium text-blue-800 mb-2">🔍 Criterios de Evaluación Aplicados:</h5>
                                            <div className="text-sm text-blue-700 space-y-1">
                                                <p>✓ Datos Generales (edad, institución remitente)</p>
                                                <p>✓ Datos Clínicos (tipo paciente, fecha ingreso)</p>
                                                <p>✓ Signos Vitales (FC, FR, TA, Temperatura, SatO2, Glasgow)</p>
                                                <p>✓ Síntomas (por tipo de paciente)</p>
                                                <p>✓ Servicios (UCI, urgencias, medicina general)</p>
                                                <p>✓ Especialidades (oncología, trasplantes, etc.)</p>
                                                <p>✓ Apoyo Diagnóstico (procedimientos especializados)</p>
                                                <p>✓ Convenios (evaluado al final)</p>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                )}

                {/* Sección de Campos de Análisis Manual */}
                {analisis && (
                    <Card className="border-2 border-blue-200 bg-blue-50/30">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-blue-800">
                                <Edit className="h-5 w-5" />
                                📝 Campos de Análisis Manual
                            </CardTitle>
                            <CardDescription className="text-blue-700">
                                Complete estos campos para registrar su análisis manual y compararlo con el análisis de la IA
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {guardadoExitoso && (
                                <div className="bg-green-100 border border-green-300 rounded-lg p-4 mb-4">
                                    <div className="flex items-center gap-2 text-green-800">
                                        <CheckCircle className="h-5 w-5" />
                                        <span className="font-medium">¡Análisis guardado exitosamente!</span>
                                    </div>
                                </div>
                            )}

                            <div className="space-y-4">
                                <div>
                                    <Label htmlFor="nombre_documento" className="text-blue-900 font-medium">
                                        Nombre del Documento / Historia Clínica *
                                    </Label>
                                    <input
                                        id="nombre_documento"
                                        type="text"
                                        value={nombreDocumento}
                                        onChange={(e) => setNombreDocumento(e.target.value)}
                                        placeholder="Ej: HC-12345 - Juan Pérez"
                                        className="w-full mt-2 px-4 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                    <p className="text-xs text-blue-600 mt-1">
                                        Archivo cargado: {archivo?.name || 'Sin archivo'}
                                    </p>
                                </div>

                                <div>
                                    <Label htmlFor="analisis_precisa" className="text-blue-900 font-medium">
                                        1. Análisis Precisa *
                                    </Label>
                                    <Textarea
                                        id="analisis_precisa"
                                        value={analisisPrecisa}
                                        onChange={(e) => setAnalisisPrecisa(e.target.value)}
                                        placeholder="Ingrese su análisis desde la perspectiva de Precisa..."
                                        className="mt-2 min-h-[100px] border-blue-300 focus:ring-blue-500"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="analisis_vital_red" className="text-blue-900 font-medium">
                                        2. Análisis Vital Red *
                                    </Label>
                                    <Textarea
                                        id="analisis_vital_red"
                                        value={analisisVitalRed}
                                        onChange={(e) => setAnalisisVitalRed(e.target.value)}
                                        placeholder="Ingrese su análisis desde la perspectiva de Vital Red..."
                                        className="mt-2 min-h-[100px] border-blue-300 focus:ring-blue-500"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="analisis_medico" className="text-blue-900 font-medium">
                                        3. Análisis Médico *
                                    </Label>
                                    <Textarea
                                        id="analisis_medico"
                                        value={analisisMedico}
                                        onChange={(e) => setAnalisisMedico(e.target.value)}
                                        placeholder="Ingrese su análisis médico profesional..."
                                        className="mt-2 min-h-[100px] border-blue-300 focus:ring-blue-500"
                                    />
                                </div>

                                <Button
                                    onClick={handleGuardarAnalisis}
                                    disabled={guardando || !nombreDocumento.trim() || !analisisPrecisa.trim() || !analisisVitalRed.trim() || !analisisMedico.trim()}
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 text-lg"
                                >
                                    {guardando ? (
                                        <>
                                            <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                                            Guardando...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="h-5 w-5 mr-2" />
                                            Guardar Análisis Manual
                                        </>
                                    )}
                                </Button>

                                <div className="bg-blue-100 border border-blue-300 rounded-lg p-4">
                                    <p className="text-sm text-blue-800">
                                        💡 <strong>Nota:</strong> Los datos guardados se almacenarán temporalmente para análisis y comparación con los resultados de la IA.
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppLayoutInertia from '@/layouts/app-layout-inertia';
import { type BreadcrumbItem } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { Search, Users, FileText, Eye, ChevronLeft, ChevronRight, Download, Brain, Stethoscope, X, CheckCircle, Clock, Info } from 'lucide-react';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import PDFViewer from '@/components/pdf-viewer';

interface RegistroMedico {
    id: number;
    // Paso 1: Información Personal
    tipo_identificacion?: string;
    numero_identificacion: string;
    nombre: string;
    apellidos: string;
    fecha_nacimiento: string;
    edad: number;
    sexo: string;
    historia_clinica_path?: string;

    // Paso 2: Datos Sociodemográficos
    asegurador: string;
    departamento: string;
    ciudad: string;
    institucion_remitente: string;

    // Paso 3: Datos Clínicos
    tipo_paciente: string;
    diagnostico_principal: string;
    diagnostico_1?: string;
    diagnostico_2?: string;
    fecha_ingreso: string;
    dias_hospitalizados?: number;
    motivo_consulta?: string;
    clasificacion_triage: string;
    enfermedad_actual?: string;
    antecedentes?: string;
    frecuencia_cardiaca?: number;
    frecuencia_respiratoria?: number;
    temperatura?: number;
    tension_sistolica?: number;
    tension_diastolica?: number;
    saturacion_oxigeno?: number;
    glucometria?: number;
    escala_glasgow?: string;
    examen_fisico?: string;
    tratamiento?: string;
    plan_terapeutico?: string;

    // Paso 4: Datos De Remisión
    motivo_remision?: string;
    tipo_solicitud?: string;
    especialidad_solicitada?: string;
    requerimiento_oxigeno?: string;
    tipo_servicio?: string;
    tipo_apoyo?: string;

    // Campos de control
    estado: string;
    fecha_envio?: string;
    prioriza_ia?: boolean;
    medico_asignado_id?: number;
    fecha_atencion?: string;
    motivo_rechazo?: string;
    created_at: string;
    updated_at: string;
    user?: {
        id: number;
        name: string;
        email: string;
        role: string;
    };
}

interface PaginatedData {
    data: RegistroMedico[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
}

interface Props {
    registros: PaginatedData;
    filters: {
        search?: string;
    };
    stats?: {
        total: number;
        priorizados: number;
        no_priorizados: number;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Consulta Pacientes',
        href: '/medico/consulta-pacientes',
    },
];

export default function ConsultaPacientes({ registros, filters, stats, auth }: Props & { auth: { user: { nombre: string; role: string } } }) {
    // Mapear nombre a name para el layout
    const userForLayout = {
        name: auth.user.nombre,
        role: auth.user.role
    };
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [isSearching, setIsSearching] = useState(false);
    const [selectedRegistro, setSelectedRegistro] = useState<RegistroMedico | null>(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [isPDFViewerOpen, setIsPDFViewerOpen] = useState(false);
    const [pdfUrl, setPdfUrl] = useState<string>('');
    const { props } = usePage();

    // Mostrar mensajes flash
    useEffect(() => {
        if ((props as any).flash?.success) {
            toast.success((props as any).flash.success);
        }
        if ((props as any).flash?.error) {
            toast.error((props as any).flash.error);
        }
    }, [(props as any).flash]);

    // Calcular estadísticas si no vienen del backend
    const estadisticas = stats || {
        total: registros.total || 0,
        priorizados: registros.data.filter(r => r.prioriza_ia === true).length,
        no_priorizados: registros.data.filter(r => r.prioriza_ia === false).length,
    };

    const handleSearch = (term: string) => {
        setIsSearching(true);
        router.get(route('medico.consulta-pacientes'),
            { search: term },
            {
                preserveState: true,
                onFinish: () => setIsSearching(false)
            }
        );
    };

    const handlePageChange = (page: number) => {
        router.get(route('medico.consulta-pacientes'),
            { page, search: searchTerm },
            { preserveState: true }
        );
    };

    const getPrioridadIABadge = (priorizaIA?: boolean) => {
        if (priorizaIA === undefined || priorizaIA === null) {
            return (
                <Badge variant="outline" className="bg-gray-50">
                    Pendiente IA
                </Badge>
            );
        }

        return priorizaIA ? (
            <Badge variant="destructive" className="bg-red-600">
                ✓ Prioriza
            </Badge>
        ) : (
            <Badge variant="secondary" className="bg-gray-200 text-gray-700">
                ✗ No Prioriza
            </Badge>
        );
    };

    const getEstadoBadge = (estado: string) => {
        switch (estado) {
            case 'aceptado':
                return (
                    <Badge className="bg-green-100 text-green-700 border-green-200">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Aceptado
                    </Badge>
                );
            case 'rechazado':
                return (
                    <Badge className="bg-red-100 text-red-700 border-red-200">
                        <X className="h-3 w-3 mr-1" />
                        Rechazado
                    </Badge>
                );
            case 'enviado':
                return (
                    <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">
                        <Clock className="h-3 w-3 mr-1" />
                        Pendiente
                    </Badge>
                );
            default:
                return (
                    <Badge variant="outline">
                        {estado}
                    </Badge>
                );
        }
    };

    const handleDownloadHistoria = (registro: RegistroMedico) => {
        if (registro.historia_clinica_path) {
            // Usar la ruta protegida del controlador
            const downloadUrl = route('medico.descargar-historia', registro.id);

            // Crear elemento temporal para descargar
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.target = '_blank'; // Abrir en nueva pestaña por si hay errores
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    const handleAtender = (registro: RegistroMedico) => {
        router.post(
            route('medico.atender-caso', registro.id),
            {},
            {
                preserveScroll: true,
            }
        );
    };

    const handleDerivar = (registro: RegistroMedico) => {
        const motivo = prompt('Motivo de rechazo/derivación (opcional):');
        
        if (motivo === null) return; // Usuario canceló
        
        router.post(
            route('medico.rechazar-caso', registro.id),
            { motivo: motivo || 'No especificado' },
            {
                preserveScroll: true,
            }
        );
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });
    };

    const handleVerMas = (registro: RegistroMedico) => {
        setSelectedRegistro(registro);
        setIsDetailModalOpen(true);
    };

    const handleVerPDF = (registro: RegistroMedico) => {
        if (registro.historia_clinica_path) {
            // Construir URL del PDF usando la ruta protegida del controlador
            const url = route('medico.descargar-historia', registro.id);
            setPdfUrl(url);
            setIsPDFViewerOpen(true);
            // Cerrar el modal de detalles cuando se abre el PDF
            setIsDetailModalOpen(false);
        }
    };

    return (
        <AppLayoutInertia breadcrumbs={breadcrumbs} user={userForLayout}>
            <Head title="Consulta Pacientes - HERMES" />

            <div className="flex h-full flex-1 flex-col gap-4 p-4 sm:gap-5 sm:p-5 md:gap-6 md:p-6">
                {/* Header con estadísticas inline */}
                <div className="flex flex-col sm:flex-row items-start sm:items-start sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Consulta Pacientes</h1>
                        <div className="flex flex-wrap items-center gap-2 sm:gap-3 md:gap-4 mt-3 sm:mt-4">
                            <div className="flex items-center gap-1.5 sm:gap-2 bg-gradient-to-b from-white to-slate-50/50 px-3 py-2 sm:px-4 sm:py-2.5 rounded-lg shadow-[0_1px_2px_rgba(0,0,0,0.05),0_4px_8px_rgba(0,0,0,0.08),inset_0_1px_0_rgba(255,255,255,0.8)] touch-manipulation">
                                <Users className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-slate-500" />
                                <span className="text-xs sm:text-sm text-slate-600">Total:</span>
                                <span className="text-base sm:text-lg font-bold text-slate-900">{estadisticas.total}</span>
                            </div>
                            {estadisticas.priorizados > 0 && (
                                <div className="flex items-center gap-1.5 sm:gap-2 bg-gradient-to-b from-white to-green-50/30 px-3 py-2 sm:px-4 sm:py-2.5 rounded-lg shadow-[0_1px_2px_rgba(0,0,0,0.05),0_4px_8px_rgba(34,197,94,0.15),inset_0_1px_0_rgba(255,255,255,0.8)] touch-manipulation">
                                    <Brain className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-green-600" />
                                    <span className="text-xs sm:text-sm text-slate-600">Priorizados:</span>
                                    <span className="text-base sm:text-lg font-bold text-green-600">{estadisticas.priorizados}</span>
                                </div>
                            )}
                            {estadisticas.no_priorizados > 0 && (
                                <div className="flex items-center gap-1.5 sm:gap-2 bg-gradient-to-b from-white to-blue-50/30 px-3 py-2 sm:px-4 sm:py-2.5 rounded-lg shadow-[0_1px_2px_rgba(0,0,0,0.05),0_4px_8px_rgba(59,130,246,0.15),inset_0_1px_0_rgba(255,255,255,0.8)] touch-manipulation">
                                    <FileText className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-blue-600" />
                                    <span className="text-xs sm:text-sm text-slate-600">No Priorizados:</span>
                                    <span className="text-base sm:text-lg font-bold text-blue-600">{estadisticas.no_priorizados}</span>
                                </div>
                            )}
                        </div>
                    </div>
                    <Button
                        onClick={() => router.visit('/medico/priorizacion/prueba')}
                        variant="outline"
                        className="w-full sm:w-auto border-0 bg-gradient-to-b from-green-50 to-green-100/50 text-green-700 hover:from-green-100 hover:to-green-50 shadow-[0_1px_2px_rgba(0,0,0,0.05),0_2px_6px_rgba(34,197,94,0.15),inset_0_1px_0_rgba(255,255,255,0.6)] hover:shadow-[0_2px_4px_rgba(0,0,0,0.06),0_4px_12px_rgba(34,197,94,0.2)] hover:-translate-y-0.5 transition-all duration-200 touch-manipulation"
                    >
                        <Eye className="h-4 w-4 mr-2" />
                        <span className="hidden sm:inline">🧠 Prueba IA Priorización</span>
                        <span className="sm:hidden">🧠 IA Priorización</span>
                    </Button>
                </div>

                {/* Tabla de registros con buscador integrado */}
                <Card className="bg-gradient-to-b from-white to-slate-50/20 border-0 shadow-[0_2px_4px_rgba(0,0,0,0.06),0_8px_20px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,1)]">
                    <CardHeader className="border-b border-slate-100">
                        <CardTitle className="text-slate-900">Registros Médicos</CardTitle>
                        <CardDescription>
                            Busca y consulta los registros médicos de pacientes
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {/* Buscador integrado */}
                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                            <div className="flex-1">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        placeholder="Buscar por nombre, apellidos, documento..."
                                        className="pl-10"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                handleSearch(searchTerm);
                                            }
                                        }}
                                    />
                                </div>
                            </div>
                            <Button
                                onClick={() => handleSearch(searchTerm)}
                                disabled={isSearching}
                                className="w-full sm:w-auto touch-manipulation"
                            >
                                {isSearching ? (
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                ) : (
                                    <Search className="h-4 w-4 mr-2" />
                                )}
                                Buscar
                            </Button>
                            {searchTerm && (
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        setSearchTerm('');
                                        handleSearch('');
                                    }}
                                    className="w-full sm:w-auto touch-manipulation"
                                >
                                    <X className="h-4 w-4 sm:mr-2" />
                                    <span className="hidden sm:inline">Limpiar</span>
                                </Button>
                            )}
                        </div>

                        {/* Tabla */}
                        {registros.data.length > 0 ? (
                            <div className="space-y-4">
                                <div className="rounded-lg bg-gradient-to-b from-slate-50 to-slate-100/50 border-0 overflow-x-auto shadow-[inset_0_1px_2px_rgba(0,0,0,0.04)]">
                                    <Table>
                                        <TableHeader className="bg-slate-100 border-0">
                                            <TableRow className="border-0 hover:bg-slate-100">
                                                <TableHead>ID</TableHead>
                                                <TableHead>Nombre</TableHead>
                                                <TableHead>Fecha solicitud</TableHead>
                                                <TableHead>EPS</TableHead>
                                                <TableHead>Ingresado por</TableHead>
                                                <TableHead>Edad</TableHead>
                                                <TableHead>Tipo de Paciente</TableHead>
                                                <TableHead>Prioridad</TableHead>
                                                <TableHead>Historia</TableHead>
                                                <TableHead>Estado</TableHead>
                                                <TableHead>Acciones</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {registros.data.map((registro) => (
                                                <TableRow key={registro.id} className="bg-gradient-to-b from-white to-white border-0 border-b border-slate-100 last:border-b-0 hover:from-slate-50 hover:to-white hover:shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-all duration-200">
                                                    <TableCell>
                                                        <div className="font-mono text-sm font-medium">
                                                            #{registro.id}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div>
                                                            <div className="font-medium">
                                                                {registro.nombre} {registro.apellidos}
                                                            </div>
                                                            <div className="text-sm text-muted-foreground">
                                                                {registro.numero_identificacion}
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="text-sm">
                                                            {formatDate(registro.created_at)}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="text-sm">
                                                            {registro.asegurador || 'No especificado'}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="text-sm text-muted-foreground">
                                                            {registro.user?.name || 'Desconocido'}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge variant="outline">
                                                            {registro.edad} años
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge variant="secondary">
                                                            {registro.tipo_paciente}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell>
                                                        {getPrioridadIABadge(registro.prioriza_ia)}
                                                    </TableCell>
                                                    <TableCell>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => handleDownloadHistoria(registro)}
                                                            disabled={!registro.historia_clinica_path}
                                                        >
                                                            <Download className="h-4 w-4" />
                                                        </Button>
                                                    </TableCell>
                                                    <TableCell>
                                                        {getEstadoBadge(registro.estado)}
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center gap-1">
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => handleVerMas(registro)}
                                                                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                                                title="Ver información completa"
                                                            >
                                                                <Info className="h-4 w-4" />
                                                            </Button>
                                                            {registro.estado === 'enviado' && (
                                                                <>
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        onClick={() => handleAtender(registro)}
                                                                        className="text-green-600 hover:text-green-700 hover:bg-green-50"
                                                                        title="Atender caso"
                                                                    >
                                                                        <Stethoscope className="h-4 w-4" />
                                                                    </Button>
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        onClick={() => handleDerivar(registro)}
                                                                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                                        title="Rechazar/Derivar caso"
                                                                    >
                                                                        <X className="h-4 w-4" />
                                                                    </Button>
                                                                </>
                                                            )}
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <Users className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                                <h3 className="text-lg font-medium mb-2">No hay registros</h3>
                                <p className="text-sm text-muted-foreground mb-4">
                                    {searchTerm ? 'No se encontraron registros que coincidan con tu búsqueda.' : 'Aún no hay registros médicos creados.'}
                                </p>
                                {searchTerm && (
                                    <Button
                                        variant="outline"
                                        onClick={() => {
                                            setSearchTerm('');
                                            handleSearch('');
                                        }}
                                    >
                                        Limpiar búsqueda
                                    </Button>
                                )}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Paginación */}
                {registros.last_page > 1 && (
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div className="text-sm text-muted-foreground">
                                    Mostrando {registros.from || 0} a {registros.to || 0} de {registros.total} registros
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handlePageChange(registros.current_page - 1)}
                                        disabled={registros.current_page <= 1}
                                    >
                                        <ChevronLeft className="h-4 w-4" />
                                        Anterior
                                    </Button>

                                    <div className="flex items-center space-x-1">
                                        {Array.from({ length: Math.min(5, registros.last_page) }, (_, i) => {
                                            let pageNumber;
                                            if (registros.last_page <= 5) {
                                                pageNumber = i + 1;
                                            } else if (registros.current_page <= 3) {
                                                pageNumber = i + 1;
                                            } else if (registros.current_page >= registros.last_page - 2) {
                                                pageNumber = registros.last_page - 4 + i;
                                            } else {
                                                pageNumber = registros.current_page - 2 + i;
                                            }

                                            return (
                                                <Button
                                                    key={pageNumber}
                                                    variant={pageNumber === registros.current_page ? "default" : "outline"}
                                                    size="sm"
                                                    onClick={() => handlePageChange(pageNumber)}
                                                    className="w-8 h-8 p-0"
                                                >
                                                    {pageNumber}
                                                </Button>
                                            );
                                        })}
                                    </div>

                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handlePageChange(registros.current_page + 1)}
                                        disabled={registros.current_page >= registros.last_page}
                                    >
                                        Siguiente
                                        <ChevronRight className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Modal de Detalles Completos del Paciente */}
                <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
                    <DialogContent className="max-w-[96vw] w-full h-[90vh] overflow-hidden flex flex-col p-0">
                        <DialogHeader className="flex-shrink-0 px-6 pt-6 pb-4 border-b">
                            <DialogTitle className="text-2xl font-bold text-blue-700">
                                Información Completa del Paciente
                            </DialogTitle>
                            <DialogDescription>
                                Detalles del registro médico #{selectedRegistro?.id} - {selectedRegistro?.nombre} {selectedRegistro?.apellidos}
                            </DialogDescription>
                        </DialogHeader>

                        {selectedRegistro && (
                            <Tabs defaultValue="personal" className="flex-1 flex flex-col overflow-hidden">
                                <TabsList className="mx-6 mt-4 grid w-auto grid-cols-4 bg-slate-100">
                                    <TabsTrigger value="personal" className="text-sm">📋 Personal</TabsTrigger>
                                    <TabsTrigger value="clinico" className="text-sm">🩺 Clínico</TabsTrigger>
                                    <TabsTrigger value="remision" className="text-sm">📤 Remisión</TabsTrigger>
                                    <TabsTrigger value="control" className="text-sm">ℹ️ Control</TabsTrigger>
                                </TabsList>

                                <div className="flex-1 overflow-y-auto px-6 py-4" style={{
                                    scrollbarWidth: 'thin',
                                    scrollbarColor: '#cbd5e1 transparent'
                                }}>
                                {/* Pestaña: Información Personal y Sociodemográfica */}
                                <TabsContent value="personal" className="mt-0 space-y-6">
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-semibold text-blue-600 border-b pb-2">
                                            Información Personal
                                        </h3>
                                        <div className="grid grid-cols-3 gap-4">
                                        <div>
                                            <p className="text-sm text-muted-foreground">Tipo de Identificación</p>
                                            <p className="font-medium">{selectedRegistro.tipo_identificacion || 'No especificado'}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground">Número de Identificación</p>
                                            <p className="font-medium">{selectedRegistro.numero_identificacion}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground">Nombre Completo</p>
                                            <p className="font-medium">{selectedRegistro.nombre} {selectedRegistro.apellidos}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground">Fecha de Nacimiento</p>
                                            <p className="font-medium">{formatDate(selectedRegistro.fecha_nacimiento)}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground">Edad</p>
                                            <p className="font-medium">{selectedRegistro.edad} años</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground">Sexo</p>
                                            <p className="font-medium">{selectedRegistro.sexo}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-blue-600 border-b pb-2">
                                        Datos Sociodemográficos
                                    </h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-sm text-muted-foreground">Asegurador</p>
                                            <p className="font-medium">{selectedRegistro.asegurador}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground">Departamento</p>
                                            <p className="font-medium">{selectedRegistro.departamento}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground">Ciudad</p>
                                            <p className="font-medium">{selectedRegistro.ciudad}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground">Institución Remitente</p>
                                            <p className="font-medium">{selectedRegistro.institucion_remitente}</p>
                                        </div>
                                    </div>
                                </div>
                                </TabsContent>

                                {/* Pestaña: Datos Clínicos */}
                                <TabsContent value="clinico" className="mt-0 space-y-4">
                                    <h3 className="text-lg font-semibold text-blue-600 border-b pb-2">
                                        Datos Clínicos
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        <div>
                                            <p className="text-sm text-muted-foreground">Tipo de Paciente</p>
                                            <p className="font-medium">{selectedRegistro.tipo_paciente}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground">Clasificación Triage</p>
                                            <p className="font-medium">{selectedRegistro.clasificacion_triage}</p>
                                        </div>
                                        <div className="md:col-span-2 lg:col-span-3">
                                            <p className="text-sm text-muted-foreground">Diagnóstico Principal</p>
                                            <p className="font-medium">{selectedRegistro.diagnostico_principal}</p>
                                        </div>
                                        {selectedRegistro.diagnostico_1 && (
                                            <div className="md:col-span-2 lg:col-span-3">
                                                <p className="text-sm text-muted-foreground">Diagnóstico Secundario 1</p>
                                                <p className="font-medium">{selectedRegistro.diagnostico_1}</p>
                                            </div>
                                        )}
                                        {selectedRegistro.diagnostico_2 && (
                                            <div className="md:col-span-2 lg:col-span-3">
                                                <p className="text-sm text-muted-foreground">Diagnóstico Secundario 2</p>
                                                <p className="font-medium">{selectedRegistro.diagnostico_2}</p>
                                            </div>
                                        )}
                                        <div>
                                            <p className="text-sm text-muted-foreground">Fecha de Ingreso</p>
                                            <p className="font-medium">{formatDate(selectedRegistro.fecha_ingreso)}</p>
                                        </div>
                                        {selectedRegistro.dias_hospitalizados && (
                                            <div>
                                                <p className="text-sm text-muted-foreground">Días Hospitalizados</p>
                                                <p className="font-medium">{selectedRegistro.dias_hospitalizados} días</p>
                                            </div>
                                        )}
                                        {selectedRegistro.motivo_consulta && (
                                            <div className="md:col-span-2 lg:col-span-3">
                                                <p className="text-sm text-muted-foreground">Motivo de Consulta</p>
                                                <p className="font-medium">{selectedRegistro.motivo_consulta}</p>
                                            </div>
                                        )}
                                        {selectedRegistro.enfermedad_actual && (
                                            <div className="md:col-span-2 lg:col-span-3">
                                                <p className="text-sm text-muted-foreground">Enfermedad Actual</p>
                                                <p className="font-medium whitespace-pre-wrap">{selectedRegistro.enfermedad_actual}</p>
                                            </div>
                                        )}
                                        {selectedRegistro.antecedentes && (
                                            <div className="md:col-span-2 lg:col-span-3">
                                                <p className="text-sm text-muted-foreground">Antecedentes</p>
                                                <p className="font-medium whitespace-pre-wrap">{selectedRegistro.antecedentes}</p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Signos Vitales */}
                                    {(selectedRegistro.frecuencia_cardiaca || selectedRegistro.frecuencia_respiratoria || selectedRegistro.temperatura) && (
                                        <div className="mt-4">
                                            <h4 className="font-semibold text-sm mb-2">Signos Vitales</h4>
                                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                                {selectedRegistro.frecuencia_cardiaca && (
                                                    <div>
                                                        <p className="text-xs text-muted-foreground">FC</p>
                                                        <p className="font-medium">{selectedRegistro.frecuencia_cardiaca} lpm</p>
                                                    </div>
                                                )}
                                                {selectedRegistro.frecuencia_respiratoria && (
                                                    <div>
                                                        <p className="text-xs text-muted-foreground">FR</p>
                                                        <p className="font-medium">{selectedRegistro.frecuencia_respiratoria} rpm</p>
                                                    </div>
                                                )}
                                                {selectedRegistro.temperatura && (
                                                    <div>
                                                        <p className="text-xs text-muted-foreground">Temperatura</p>
                                                        <p className="font-medium">{selectedRegistro.temperatura}°C</p>
                                                    </div>
                                                )}
                                                {selectedRegistro.tension_sistolica && (
                                                    <div>
                                                        <p className="text-xs text-muted-foreground">Tensión Arterial</p>
                                                        <p className="font-medium">{selectedRegistro.tension_sistolica}/{selectedRegistro.tension_diastolica} mmHg</p>
                                                    </div>
                                                )}
                                                {selectedRegistro.saturacion_oxigeno && (
                                                    <div>
                                                        <p className="text-xs text-muted-foreground">Saturación O2</p>
                                                        <p className="font-medium">{selectedRegistro.saturacion_oxigeno}%</p>
                                                    </div>
                                                )}
                                                {selectedRegistro.glucometria && (
                                                    <div>
                                                        <p className="text-xs text-muted-foreground">Glucometría</p>
                                                        <p className="font-medium">{selectedRegistro.glucometria} mg/dL</p>
                                                    </div>
                                                )}
                                                {selectedRegistro.escala_glasgow && (
                                                    <div>
                                                        <p className="text-xs text-muted-foreground">Escala Glasgow</p>
                                                        <p className="font-medium">{selectedRegistro.escala_glasgow}</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {selectedRegistro.examen_fisico && (
                                        <div className="mt-4">
                                            <p className="text-sm text-muted-foreground">Examen Físico</p>
                                            <p className="font-medium whitespace-pre-wrap">{selectedRegistro.examen_fisico}</p>
                                        </div>
                                    )}
                                    {selectedRegistro.tratamiento && (
                                        <div className="mt-4">
                                            <p className="text-sm text-muted-foreground">Tratamiento</p>
                                            <p className="font-medium whitespace-pre-wrap">{selectedRegistro.tratamiento}</p>
                                        </div>
                                    )}
                                    {selectedRegistro.plan_terapeutico && (
                                        <div className="mt-4">
                                            <p className="text-sm text-muted-foreground">Plan Terapéutico</p>
                                            <p className="font-medium whitespace-pre-wrap">{selectedRegistro.plan_terapeutico}</p>
                                        </div>
                                    )}
                                </TabsContent>

                                {/* Pestaña: Datos De Remisión */}
                                <TabsContent value="remision" className="mt-0 space-y-4">
                                    <h3 className="text-lg font-semibold text-blue-600 border-b pb-2">
                                        Datos De Remisión
                                    </h3>
                                    <div className="space-y-4">
                                        {selectedRegistro.motivo_remision && (
                                            <div>
                                                <p className="text-sm text-muted-foreground">Motivo de Remisión</p>
                                                <p className="font-medium whitespace-pre-wrap break-words">{selectedRegistro.motivo_remision}</p>
                                            </div>
                                        )}

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 overflow-hidden">
                                            {selectedRegistro.tipo_solicitud && (
                                                <div className="min-w-0">
                                                    <p className="text-sm text-muted-foreground">Tipo de Solicitud</p>
                                                    <p className="font-medium break-words">{selectedRegistro.tipo_solicitud}</p>
                                                </div>
                                            )}
                                            {selectedRegistro.especialidad_solicitada && (
                                                <div className="min-w-0">
                                                    <p className="text-sm text-muted-foreground">Especialidad Solicitada</p>
                                                    <p className="font-medium break-words">{selectedRegistro.especialidad_solicitada}</p>
                                                </div>
                                            )}
                                            {selectedRegistro.requerimiento_oxigeno && (
                                                <div className="min-w-0">
                                                    <p className="text-sm text-muted-foreground">Requerimiento de Oxígeno</p>
                                                    <p className="font-medium break-words">{selectedRegistro.requerimiento_oxigeno}</p>
                                                </div>
                                            )}
                                            {selectedRegistro.tipo_servicio && (
                                                <div className="min-w-0">
                                                    <p className="text-sm text-muted-foreground">Tipo de Servicio</p>
                                                    <p className="font-medium break-words">{selectedRegistro.tipo_servicio}</p>
                                                </div>
                                            )}
                                            {selectedRegistro.tipo_apoyo && (
                                                <div className="min-w-0">
                                                    <p className="text-sm text-muted-foreground">Tipo de Apoyo</p>
                                                    <p className="font-medium break-words">{selectedRegistro.tipo_apoyo}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </TabsContent>

                                {/* Pestaña: Información de Control */}
                                <TabsContent value="control" className="mt-0 space-y-4">
                                    <div className="space-y-4 bg-slate-50 p-4 rounded-lg">
                                        <h3 className="text-lg font-semibold text-blue-600 border-b pb-2">
                                            Información de Control
                                        </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                        <div>
                                            <p className="text-sm text-muted-foreground">Estado</p>
                                            {getEstadoBadge(selectedRegistro.estado)}
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground">Prioridad IA</p>
                                            {getPrioridadIABadge(selectedRegistro.prioriza_ia)}
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground">Creado por</p>
                                            <p className="font-medium">{selectedRegistro.user?.name || 'Desconocido'}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground">Fecha de Creación</p>
                                            <p className="font-medium">{formatDate(selectedRegistro.created_at)}</p>
                                        </div>
                                        {selectedRegistro.historia_clinica_path && (
                                            <div className="md:col-span-2 lg:col-span-4">
                                                <p className="text-sm text-muted-foreground mb-2">Historia Clínica</p>
                                                <div className="flex gap-2">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleVerPDF(selectedRegistro)}
                                                        className="flex-1"
                                                    >
                                                        <Eye className="h-4 w-4 mr-2" />
                                                        Ver PDF
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleDownloadHistoria(selectedRegistro)}
                                                        className="flex-1"
                                                    >
                                                        <Download className="h-4 w-4 mr-2" />
                                                        Descargar
                                                    </Button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    </div>
                                </TabsContent>
                                </div>
                            </Tabs>
                        )}
                    </DialogContent>
                </Dialog>

                {/* Visualizador de PDF */}
                {isPDFViewerOpen && (
                    <PDFViewer
                        pdfUrl={pdfUrl}
                        onClose={() => setIsPDFViewerOpen(false)}
                    />
                )}
            </div>
        </AppLayoutInertia>
    );
}

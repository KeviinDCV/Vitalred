import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayoutInertia from '@/layouts/app-layout-inertia';
import { type BreadcrumbItem } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { Search, Users, FileText, Eye, ChevronLeft, ChevronRight, Download, Brain, Stethoscope, X, CheckCircle, Clock } from 'lucide-react';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

interface RegistroMedico {
    id: number;
    numero_identificacion: string;
    nombre: string;
    apellidos: string;
    edad: number;
    sexo: string;
    fecha_nacimiento: string;
    asegurador: string;
    departamento: string;
    ciudad: string;
    institucion_remitente: string;
    diagnostico_principal: string;
    fecha_ingreso: string;
    estado: string;
    tipo_paciente: string;
    clasificacion_triage: string;
    prioriza_ia?: boolean; // Resultado de análisis IA
    historia_clinica_path?: string;
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
                                                        {registro.estado === 'enviado' ? (
                                                            <div className="flex items-center gap-1">
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
                                                            </div>
                                                        ) : (
                                                            <span className="text-sm text-muted-foreground">-</span>
                                                        )}
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
            </div>
        </AppLayoutInertia>
    );
}

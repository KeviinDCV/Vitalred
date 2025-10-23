import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayoutInertia from '@/layouts/app-layout-inertia';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { Search, Users, FileText, ChevronLeft, ChevronRight, Brain, CheckCircle, XCircle, Clock } from 'lucide-react';
import { useState } from 'react';

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
    prioriza_ia?: boolean;
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
        href: '/ips/consulta-pacientes',
    },
];

export default function ConsultaPacientesIPS({ registros, filters, stats, auth }: Props & { auth: { user: { nombre: string; role: string } } }) {
    const userForLayout = {
        name: auth.user.nombre,
        role: auth.user.role
    };
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [isSearching, setIsSearching] = useState(false);

    const estadisticas = stats || {
        total: registros.total || 0,
        priorizados: registros.data.filter(r => r.prioriza_ia === true).length,
        no_priorizados: registros.data.filter(r => r.prioriza_ia === false).length,
    };

    const handleSearch = (term: string) => {
        setIsSearching(true);
        router.get(route('ips.consulta-pacientes'),
            { search: term },
            {
                preserveState: true,
                onFinish: () => setIsSearching(false)
            }
        );
    };

    const handlePageChange = (page: number) => {
        router.get(route('ips.consulta-pacientes'),
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
        switch (estado.toLowerCase()) {
            case 'aceptado':
            case 'atendido':
                return (
                    <Badge className="bg-green-600 hover:bg-green-700">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Aceptado
                    </Badge>
                );
            case 'rechazado':
            case 'derivado':
                return (
                    <Badge variant="destructive">
                        <XCircle className="h-3 w-3 mr-1" />
                        Rechazado
                    </Badge>
                );
            case 'enviado':
            case 'pendiente':
            default:
                return (
                    <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                        <Clock className="h-3 w-3 mr-1" />
                        Pendiente
                    </Badge>
                );
        }
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
            <Head title="Consulta Pacientes - Vital Red" />

            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Header con estadísticas inline */}
                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">Consulta Pacientes</h1>
                        <div className="flex items-center gap-6 mt-3">
                            <div className="flex items-center gap-2">
                                <Users className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm text-muted-foreground">Total:</span>
                                <span className="text-lg font-bold">{estadisticas.total}</span>
                            </div>
                            {estadisticas.priorizados > 0 && (
                                <div className="flex items-center gap-2">
                                    <Brain className="h-4 w-4 text-green-600" />
                                    <span className="text-sm text-muted-foreground">Priorizados:</span>
                                    <span className="text-lg font-bold text-green-600">{estadisticas.priorizados}</span>
                                </div>
                            )}
                            {estadisticas.no_priorizados > 0 && (
                                <div className="flex items-center gap-2">
                                    <FileText className="h-4 w-4 text-blue-600" />
                                    <span className="text-sm text-muted-foreground">No Priorizados:</span>
                                    <span className="text-lg font-bold text-blue-600">{estadisticas.no_priorizados}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Tabla de registros con buscador integrado */}
                <Card>
                    <CardHeader>
                        <CardTitle>Registros Enviados</CardTitle>
                        <CardDescription>
                            Consulta el estado de los registros médicos que has enviado
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {/* Buscador integrado */}
                        <div className="flex gap-4">
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
                                >
                                    Limpiar
                                </Button>
                            )}
                        </div>

                        {/* Tabla */}
                        {registros.data.length > 0 ? (
                            <div className="space-y-4">
                                <div className="rounded-md border">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>ID</TableHead>
                                                <TableHead>Nombre</TableHead>
                                                <TableHead>Fecha solicitud</TableHead>
                                                <TableHead>EPS</TableHead>
                                                <TableHead>Edad</TableHead>
                                                <TableHead>Tipo de Paciente</TableHead>
                                                <TableHead>Prioridad</TableHead>
                                                <TableHead>Estado</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {registros.data.map((registro) => (
                                                <TableRow key={registro.id}>
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
                                                        {getEstadoBadge(registro.estado)}
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
                                    {searchTerm ? 'No se encontraron registros que coincidan con tu búsqueda.' : 'Aún no has enviado registros médicos.'}
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

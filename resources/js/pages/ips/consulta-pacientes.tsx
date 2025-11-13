import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayoutInertia from '@/layouts/app-layout-inertia';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { Search, Users, ChevronLeft, ChevronRight, X } from 'lucide-react';
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
                        </div>
                    </div>
                </div>

                {/* Tabla de registros con buscador integrado */}
                <Card className="bg-gradient-to-b from-white to-slate-50/30 border-0 shadow-[0_1px_3px_rgba(0,0,0,0.08),0_4px_12px_rgba(0,0,0,0.08),inset_0_1px_0_rgba(255,255,255,0.9)]">
                    <CardHeader className="border-b border-slate-100 bg-gradient-to-b from-slate-50/50 to-white">
                        <CardTitle className="text-slate-900 text-xl sm:text-2xl">Registros Enviados</CardTitle>
                        <CardDescription className="text-slate-600">
                            Consulta el estado de los registros médicos que has enviado
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
                                                <TableHead>Edad</TableHead>
                                                <TableHead>Tipo de Paciente</TableHead>
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
                                                        <Badge variant="outline">
                                                            {registro.edad} años
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge variant="secondary">
                                                            {registro.tipo_paciente}
                                                        </Badge>
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
                    <Card className="bg-gradient-to-b from-white to-slate-50/30 border-0 shadow-[0_1px_3px_rgba(0,0,0,0.08),0_4px_12px_rgba(0,0,0,0.08),inset_0_1px_0_rgba(255,255,255,0.9)]">
                        <CardContent className="pt-6">
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                                <div className="text-sm text-slate-600 text-center sm:text-left">
                                    Mostrando {registros.from || 0} a {registros.to || 0} de {registros.total} registros
                                </div>
                                <div className="flex items-center space-x-2 flex-wrap justify-center">
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

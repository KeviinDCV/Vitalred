import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { Search, Users, FileText, Calendar, Filter, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';

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
    created_at: string;
    updated_at: string;
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
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Consulta Pacientes',
        href: '/medico/consulta-pacientes',
    },
];

export default function ConsultaPacientes({ registros, filters }: Props) {
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [isSearching, setIsSearching] = useState(false);

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

    const getEstadoBadge = (estado: string) => {
        const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
            'borrador': 'outline',
            'enviado': 'default',
            'procesado': 'secondary',
            'completado': 'destructive'
        };

        const labels: Record<string, string> = {
            'borrador': 'Borrador',
            'enviado': 'Enviado',
            'procesado': 'Procesado',
            'completado': 'Completado'
        };

        return (
            <Badge variant={variants[estado] || 'outline'}>
                {labels[estado] || estado}
            </Badge>
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
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Consulta Pacientes - Vital Red" />

            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">Consulta Pacientes</h1>
                        <p className="text-muted-foreground mt-2">
                            Consulta y gestiona los registros médicos de pacientes
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-sm">
                            {registros.total} registros totales
                        </Badge>
                    </div>
                </div>

                {/* Estadísticas */}
                <div className="grid gap-4 md:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Registros</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{registros.total}</div>
                            <p className="text-xs text-muted-foreground">Pacientes registrados</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Página Actual</CardTitle>
                            <FileText className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{registros.current_page}</div>
                            <p className="text-xs text-muted-foreground">de {registros.last_page} páginas</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Mostrando</CardTitle>
                            <Eye className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{registros.data.length}</div>
                            <p className="text-xs text-muted-foreground">de {registros.per_page} por página</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Rango</CardTitle>
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{registros.from || 0}-{registros.to || 0}</div>
                            <p className="text-xs text-muted-foreground">registros mostrados</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Buscador principal */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Search className="h-5 w-5" />
                            Buscar Pacientes
                        </CardTitle>
                        <CardDescription>
                            Busca pacientes por nombre, apellidos, número de identificación o diagnóstico
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
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
                    </CardContent>
                </Card>

                {/* Tabla de registros */}
                <Card>
                    <CardHeader>
                        <CardTitle>Registros Médicos</CardTitle>
                        <CardDescription>
                            Lista de todos los registros médicos de pacientes
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {registros.data.length > 0 ? (
                            <div className="space-y-4">
                                <div className="rounded-md border">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Paciente</TableHead>
                                                <TableHead>Identificación</TableHead>
                                                <TableHead>Edad</TableHead>
                                                <TableHead>Asegurador</TableHead>
                                                <TableHead>Diagnóstico Principal</TableHead>
                                                <TableHead>Fecha Ingreso</TableHead>
                                                <TableHead>Estado</TableHead>
                                                <TableHead>Acciones</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {registros.data.map((registro) => (
                                                <TableRow key={registro.id}>
                                                    <TableCell>
                                                        <div>
                                                            <div className="font-medium">
                                                                {registro.nombre} {registro.apellidos}
                                                            </div>
                                                            <div className="text-sm text-muted-foreground">
                                                                {registro.sexo} • {registro.ciudad}, {registro.departamento}
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="font-mono text-sm">
                                                            {registro.numero_identificacion}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge variant="outline">
                                                            {registro.edad} años
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="text-sm">
                                                            {registro.asegurador}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="max-w-xs truncate text-sm" title={registro.diagnostico_principal}>
                                                            {registro.diagnostico_principal}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="text-sm">
                                                            {formatDate(registro.fecha_ingreso)}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        {getEstadoBadge(registro.estado)}
                                                    </TableCell>
                                                    <TableCell>
                                                        <Button variant="ghost" size="sm">
                                                            <Eye className="h-4 w-4" />
                                                        </Button>
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
        </AppLayout>
    );
}

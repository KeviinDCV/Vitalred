import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { Search, Download, ChevronLeft, ChevronRight } from 'lucide-react';

import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { type BreadcrumbItem } from '@/types';

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
    historia_clinica_path?: string;
    created_at: string;
    updated_at: string;
    user?: {
        id: number;
        name: string;
        email: string;
    };
}

interface PaginatedRegistros {
    data: RegistroMedico[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number | null;
    to: number | null;
    links: Array<{
        url: string | null;
        label: string;
        active: boolean;
    }>;
}

interface Props {
    registros: PaginatedRegistros;
    search?: string;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Tablero',
        href: '/dashboard',
    },
];

export default function Dashboard({ registros, search: initialSearch }: Props) {
    const [searchTerm, setSearchTerm] = useState(initialSearch || '');
    const [isSearching, setIsSearching] = useState(false);

    // Función para formatear fecha
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-CO', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    // Función para obtener badge de prioridad
    const getPrioridadBadge = (triage: string) => {
        const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
            'triage_1': 'destructive',
            'triage_2': 'destructive',
            'triage_3': 'default',
            'triage_4': 'secondary',
            'triage_5': 'outline'
        };

        const labels: Record<string, string> = {
            'triage_1': 'Crítico',
            'triage_2': 'Alto',
            'triage_3': 'Medio',
            'triage_4': 'Bajo',
            'triage_5': 'Mínimo'
        };

        return (
            <Badge variant={variants[triage] || 'outline'}>
                {labels[triage] || 'Sin clasificar'}
            </Badge>
        );
    };

    // Función para manejar búsqueda
    const handleSearch = () => {
        setIsSearching(true);
        router.get('/dashboard', { search: searchTerm }, {
            preserveState: true,
            onFinish: () => setIsSearching(false)
        });
    };

    // Función para limpiar búsqueda
    const handleClearSearch = () => {
        setSearchTerm('');
        setIsSearching(true);
        router.get('/dashboard', {}, {
            preserveState: true,
            onFinish: () => setIsSearching(false)
        });
    };

    // Función para descargar historia clínica
    const handleDownloadHistoria = (registro: RegistroMedico) => {
        if (registro.historia_clinica_path) {
            const downloadUrl = route('admin.descargar-historia', registro.id);

            const link = document.createElement('a');
            link.href = downloadUrl;
            link.target = '_blank';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tablero - Registros Médicos" />

            {/* 
                RESPONSIVE DESIGN PRINCIPLES:
                Principle 1 - Box System: Header, Search, Table as distinct boxes
                Principle 2 - Rearrange with Purpose: Stack on mobile, side-by-side on desktop
            */}
            <div className="flex flex-col gap-4 sm:gap-5 md:gap-6">
                {/* Header - Responsive: Stack on mobile, row on tablet+ */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                    <div>
                        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground">
                            Tablero de Administración
                        </h1>
                        <p className="text-sm sm:text-base text-muted-foreground mt-1 sm:mt-2">
                            Supervisa todos los registros médicos del sistema
                        </p>
                    </div>
                    <Badge variant="outline" className="text-xs sm:text-sm w-fit">
                        {registros.total} registros totales
                    </Badge>
                </div>

                {/* Búsqueda - Responsive padding and layout */}
                <Card>
                    <CardHeader className="p-3 sm:p-4 md:p-6 pb-2 sm:pb-3">
                        <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                            <Search className="h-4 w-4 sm:h-5 sm:w-5" />
                            Buscar Registros Médicos
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-3 sm:p-4 md:p-6 pt-0">
                        {/* Search: Stack on mobile, row on tablet+ */}
                        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                            <Input
                                placeholder="Buscar por nombre, documento, diagnóstico..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                className="flex-1 h-9 sm:h-10 text-sm sm:text-base"
                            />
                            <div className="flex gap-2">
                                <Button
                                    onClick={handleSearch}
                                    disabled={isSearching}
                                    className="flex-1 sm:flex-none h-9 sm:h-10 text-sm sm:text-base"
                                >
                                    {isSearching ? 'Buscando...' : 'Buscar'}
                                </Button>
                                {(searchTerm || initialSearch) && (
                                    <Button
                                        variant="outline"
                                        onClick={handleClearSearch}
                                        disabled={isSearching}
                                        className="flex-1 sm:flex-none h-9 sm:h-10 text-sm sm:text-base"
                                    >
                                        Limpiar
                                    </Button>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Tabla de Registros - Responsive */}
                <Card>
                    <CardHeader className="p-3 sm:p-4 md:p-6">
                        <CardTitle className="text-base sm:text-lg">Registros Médicos</CardTitle>
                        <p className="text-xs sm:text-sm text-muted-foreground">
                            {registros.total} registros encontrados
                        </p>
                    </CardHeader>
                    <CardContent className="p-3 sm:p-4 md:p-6 pt-0">
                        {/* Table with horizontal scroll on mobile */}
                        <div className="-mx-3 sm:-mx-4 md:-mx-6">
                            <div className="overflow-x-auto">
                                <Table className="min-w-[800px]">
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="text-xs sm:text-sm">ID</TableHead>
                                            <TableHead className="text-xs sm:text-sm">Nombre</TableHead>
                                            <TableHead className="text-xs sm:text-sm hidden md:table-cell">Médico</TableHead>
                                            <TableHead className="text-xs sm:text-sm">Fecha</TableHead>
                                            <TableHead className="text-xs sm:text-sm hidden lg:table-cell">EPS</TableHead>
                                            <TableHead className="text-xs sm:text-sm">Edad</TableHead>
                                            <TableHead className="text-xs sm:text-sm hidden sm:table-cell">Tipo</TableHead>
                                            <TableHead className="text-xs sm:text-sm">Prioridad</TableHead>
                                            <TableHead className="text-xs sm:text-sm">HC</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {registros.data.map((registro) => (
                                            <TableRow key={registro.id}>
                                                <TableCell className="py-2 sm:py-3">
                                                    <div className="font-mono text-xs sm:text-sm font-medium">
                                                        #{registro.id}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="py-2 sm:py-3">
                                                    <div>
                                                        <div className="font-medium text-xs sm:text-sm">
                                                            {registro.nombre} {registro.apellidos}
                                                        </div>
                                                        <div className="text-[10px] sm:text-xs text-muted-foreground">
                                                            {registro.numero_identificacion}
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="py-2 sm:py-3 hidden md:table-cell">
                                                    <div className="text-xs sm:text-sm">
                                                        {registro.user?.name || 'N/A'}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="py-2 sm:py-3">
                                                    <div className="text-xs sm:text-sm">
                                                        {formatDate(registro.created_at)}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="py-2 sm:py-3 hidden lg:table-cell">
                                                    <div className="text-xs sm:text-sm max-w-[120px] truncate">
                                                        {registro.asegurador}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="py-2 sm:py-3">
                                                    <Badge variant="outline" className="text-[10px] sm:text-xs">
                                                        {registro.edad}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="py-2 sm:py-3 hidden sm:table-cell">
                                                    <Badge variant="secondary" className="text-[10px] sm:text-xs">
                                                        {registro.tipo_paciente}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="py-2 sm:py-3">
                                                    {getPrioridadBadge(registro.clasificacion_triage)}
                                                </TableCell>
                                                <TableCell className="py-2 sm:py-3">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleDownloadHistoria(registro)}
                                                        disabled={!registro.historia_clinica_path}
                                                        className="h-7 w-7 sm:h-8 sm:w-8 p-0"
                                                    >
                                                        <Download className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </div>

                        {/* Paginación - Responsive: Stack on mobile */}
                        {registros.last_page > 1 && (
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-4 pt-4 border-t">
                                <div className="text-xs sm:text-sm text-muted-foreground text-center sm:text-left">
                                    Mostrando {registros.from || 0} a {registros.to || 0} de {registros.total}
                                </div>

                                <div className="flex items-center justify-center gap-1 sm:gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => router.get(registros.links.find(link => link.label === '&laquo; Previous')?.url || '#')}
                                        disabled={registros.current_page === 1}
                                        className="h-8 px-2 sm:px-3 text-xs sm:text-sm"
                                    >
                                        <ChevronLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                        <span className="hidden sm:inline ml-1">Anterior</span>
                                    </Button>

                                    {/* Show fewer page numbers on mobile */}
                                    {registros.links
                                        .filter(link => link.label !== '&laquo; Previous' && link.label !== 'Next &raquo;')
                                        .slice(0, 3)
                                        .map((link, index) => (
                                            <Button
                                                key={index}
                                                variant={link.active ? "default" : "outline"}
                                                size="sm"
                                                onClick={() => link.url && router.get(link.url)}
                                                disabled={!link.url}
                                                className="h-8 w-8 p-0 text-xs sm:text-sm"
                                            >
                                                {link.label}
                                            </Button>
                                        ))}

                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => router.get(registros.links.find(link => link.label === 'Next &raquo;')?.url || '#')}
                                        disabled={registros.current_page === registros.last_page}
                                        className="h-8 px-2 sm:px-3 text-xs sm:text-sm"
                                    >
                                        <span className="hidden sm:inline mr-1">Siguiente</span>
                                        <ChevronRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                    </Button>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}

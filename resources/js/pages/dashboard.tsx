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

            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">Tablero de Administración</h1>
                        <p className="text-muted-foreground mt-2">
                            Supervisa todos los registros médicos del sistema
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-sm">
                            {registros.total} registros totales
                        </Badge>
                    </div>
                </div>

                {/* Búsqueda */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Search className="h-5 w-5" />
                            Buscar Registros Médicos
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex gap-2">
                            <Input
                                placeholder="Buscar por nombre, documento, diagnóstico..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                className="flex-1"
                            />
                            <Button
                                onClick={handleSearch}
                                disabled={isSearching}
                            >
                                {isSearching ? 'Buscando...' : 'Buscar'}
                            </Button>
                            {(searchTerm || initialSearch) && (
                                <Button
                                    variant="outline"
                                    onClick={handleClearSearch}
                                    disabled={isSearching}
                                >
                                    Limpiar
                                </Button>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Tabla de Registros */}
                <Card>
                    <CardHeader>
                        <CardTitle>Registros Médicos</CardTitle>
                        <p className="text-sm text-muted-foreground">
                            {registros.total} registros encontrados
                        </p>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>ID</TableHead>
                                        <TableHead>Nombre</TableHead>
                                        <TableHead>Médico</TableHead>
                                        <TableHead>Fecha solicitud</TableHead>
                                        <TableHead>EPS</TableHead>
                                        <TableHead>Edad</TableHead>
                                        <TableHead>Tipo de Paciente</TableHead>
                                        <TableHead>Prioridad</TableHead>
                                        <TableHead>Descargar Historia</TableHead>
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
                                                    {registro.user?.name || 'N/A'}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="text-sm">
                                                    {formatDate(registro.created_at)}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="text-sm">
                                                    {registro.asegurador}
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
                                                {getPrioridadBadge(registro.clasificacion_triage)}
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
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>

                        {/* Paginación */}
                        {registros.last_page > 1 && (
                            <div className="flex items-center justify-between mt-4">
                                <div className="text-sm text-muted-foreground">
                                    Mostrando {registros.from || 0} a {registros.to || 0} de {registros.total} registros
                                </div>

                                <div className="flex items-center space-x-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => router.get(registros.links.find(link => link.label === '&laquo; Previous')?.url || '#')}
                                        disabled={registros.current_page === 1}
                                    >
                                        <ChevronLeft className="h-4 w-4" />
                                        Anterior
                                    </Button>

                                    {registros.links
                                        .filter(link => link.label !== '&laquo; Previous' && link.label !== 'Next &raquo;')
                                        .slice(0, 5)
                                        .map((link, index) => (
                                            <Button
                                                key={index}
                                                variant={link.active ? "default" : "outline"}
                                                size="sm"
                                                onClick={() => link.url && router.get(link.url)}
                                                disabled={!link.url}
                                            >
                                                {link.label}
                                            </Button>
                                        ))}

                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => router.get(registros.links.find(link => link.label === 'Next &raquo;')?.url || '#')}
                                        disabled={registros.current_page === registros.last_page}
                                    >
                                        Siguiente
                                        <ChevronRight className="h-4 w-4" />
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

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Search, Users, FileText, Calendar, Filter, Eye } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Consulta Pacientes',
        href: '/medico/consulta-pacientes',
    },
];

export default function ConsultaPacientes() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Consulta Pacientes - Vital Red" />
            
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">Consulta Pacientes</h1>
                        <p className="text-muted-foreground mt-2">
                            Busca y consulta información de pacientes y sus historiales médicos
                        </p>
                    </div>
                    <Button variant="outline">
                        <Filter className="h-4 w-4 mr-2" />
                        Filtros Avanzados
                    </Button>
                </div>

                {/* Estadísticas */}
                <div className="grid gap-4 md:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Pacientes</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">0</div>
                            <p className="text-xs text-muted-foreground">Registrados en el sistema</p>
                        </CardContent>
                    </Card>
                    
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Consultas Hoy</CardTitle>
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">0</div>
                            <p className="text-xs text-muted-foreground">Consultas realizadas</p>
                        </CardContent>
                    </Card>
                    
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Referencias Activas</CardTitle>
                            <FileText className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">0</div>
                            <p className="text-xs text-muted-foreground">En proceso</p>
                        </CardContent>
                    </Card>
                    
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Búsquedas Recientes</CardTitle>
                            <Search className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">0</div>
                            <p className="text-xs text-muted-foreground">Consultas guardadas</p>
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
                            Busca pacientes por nombre, documento, número de historia clínica o diagnóstico
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                        <Input
                                            placeholder="Buscar por nombre, documento, historia clínica..."
                                            className="pl-10 h-12"
                                        />
                                    </div>
                                </div>
                                <Button className="h-12 px-8">
                                    <Search className="h-4 w-4 mr-2" />
                                    Buscar
                                </Button>
                            </div>
                            
                            <div className="grid gap-2 md:grid-cols-3">
                                <Input placeholder="Filtrar por edad" />
                                <Input placeholder="Filtrar por diagnóstico" />
                                <Input placeholder="Filtrar por fecha" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Resultados de búsqueda */}
                <div className="grid gap-6 md:grid-cols-2">
                    {/* Lista de pacientes */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Resultados de Búsqueda</CardTitle>
                            <CardDescription>
                                Pacientes que coinciden con los criterios de búsqueda
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="text-center py-12">
                                <Users className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                                <h3 className="text-lg font-medium mb-2">Sin Resultados</h3>
                                <p className="text-sm text-muted-foreground mb-4">
                                    No se encontraron pacientes. Realiza una búsqueda para ver resultados.
                                </p>
                                <div className="text-xs text-muted-foreground bg-muted p-3 rounded-lg">
                                    <strong>Se mostrará:</strong><br />
                                    • Lista de pacientes<br />
                                    • Información básica<br />
                                    • Estado de referencias<br />
                                    • Acciones rápidas
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Detalles del paciente seleccionado */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Detalles del Paciente</CardTitle>
                            <CardDescription>
                                Información detallada del paciente seleccionado
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="text-center py-12">
                                <Eye className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                                <h3 className="text-lg font-medium mb-2">Selecciona un Paciente</h3>
                                <p className="text-sm text-muted-foreground mb-4">
                                    Selecciona un paciente de la lista para ver sus detalles
                                </p>
                                <div className="text-xs text-muted-foreground bg-muted p-3 rounded-lg">
                                    <strong>Se mostrará:</strong><br />
                                    • Datos personales<br />
                                    • Historial médico<br />
                                    • Referencias activas<br />
                                    • Documentos adjuntos
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Acciones rápidas */}
                <Card>
                    <CardHeader>
                        <CardTitle>Acciones Frecuentes</CardTitle>
                        <CardDescription>
                            Herramientas de consulta y análisis de pacientes
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 md:grid-cols-4">
                            <div className="text-center p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                                <Search className="h-8 w-8 mx-auto mb-2 text-primary" />
                                <h4 className="font-medium">Búsqueda Avanzada</h4>
                                <p className="text-xs text-muted-foreground">Filtros detallados</p>
                            </div>
                            
                            <div className="text-center p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                                <FileText className="h-8 w-8 mx-auto mb-2 text-primary" />
                                <h4 className="font-medium">Generar Reporte</h4>
                                <p className="text-xs text-muted-foreground">Exportar datos</p>
                            </div>
                            
                            <div className="text-center p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                                <Calendar className="h-8 w-8 mx-auto mb-2 text-primary" />
                                <h4 className="font-medium">Historial</h4>
                                <p className="text-xs text-muted-foreground">Ver cronología</p>
                            </div>
                            
                            <div className="text-center p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                                <Users className="h-8 w-8 mx-auto mb-2 text-primary" />
                                <h4 className="font-medium">Estadísticas</h4>
                                <p className="text-xs text-muted-foreground">Análisis de datos</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Activity, Users, FileText, Clock, TrendingUp, AlertTriangle } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Panel de Supervisión',
        href: '/admin/supervision',
    },
];

export default function PanelSupervision() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Panel de Supervisión - Vital Red" />
            
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">Panel de Supervisión</h1>
                        <p className="text-muted-foreground mt-2">
                            Monitoreo en tiempo real del sistema de referencia y contrareferencia
                        </p>
                    </div>
                    <Badge variant="outline" className="text-success border-success">
                        <Activity className="h-4 w-4 mr-2" />
                        Sistema Operativo
                    </Badge>
                </div>

                {/* Métricas principales */}
                <div className="grid gap-4 md:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Referencias Hoy</CardTitle>
                            <FileText className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">24</div>
                            <p className="text-xs text-muted-foreground">
                                <span className="text-success">+12%</span> vs ayer
                            </p>
                        </CardContent>
                    </Card>
                    
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Tiempo Promedio</CardTitle>
                            <Clock className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">2.4h</div>
                            <p className="text-xs text-muted-foreground">
                                <span className="text-success">-8%</span> vs ayer
                            </p>
                        </CardContent>
                    </Card>
                    
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Usuarios Activos</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">8</div>
                            <p className="text-xs text-muted-foreground">Médicos conectados</p>
                        </CardContent>
                    </Card>
                    
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Eficiencia</CardTitle>
                            <TrendingUp className="h-4 w-4 text-success" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-success">94%</div>
                            <p className="text-xs text-muted-foreground">Referencias completadas</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Gráficos y estadísticas */}
                <div className="grid gap-6 md:grid-cols-2">
                    {/* Estado del sistema */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Estado del Sistema</CardTitle>
                            <CardDescription>Rendimiento en tiempo real</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                    <span>CPU</span>
                                    <span>45%</span>
                                </div>
                                <Progress value={45} className="h-2" />
                            </div>
                            
                            <div className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                    <span>Memoria</span>
                                    <span>62%</span>
                                </div>
                                <Progress value={62} className="h-2" />
                            </div>
                            
                            <div className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                    <span>Base de Datos</span>
                                    <span>28%</span>
                                </div>
                                <Progress value={28} className="h-2" />
                            </div>
                            
                            <div className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                    <span>Red</span>
                                    <span>15%</span>
                                </div>
                                <Progress value={15} className="h-2" />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Alertas y notificaciones */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Alertas del Sistema</CardTitle>
                            <CardDescription>Notificaciones importantes</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-start space-x-3 p-3 bg-warning/10 border border-warning/20 rounded-lg">
                                <AlertTriangle className="h-5 w-5 text-warning mt-0.5" />
                                <div className="flex-1">
                                    <p className="text-sm font-medium">Referencia pendiente</p>
                                    <p className="text-xs text-muted-foreground">
                                        Paciente Juan Pérez lleva 4 horas sin respuesta
                                    </p>
                                    <p className="text-xs text-muted-foreground mt-1">Hace 15 minutos</p>
                                </div>
                            </div>
                            
                            <div className="flex items-start space-x-3 p-3 bg-success/10 border border-success/20 rounded-lg">
                                <Activity className="h-5 w-5 text-success mt-0.5" />
                                <div className="flex-1">
                                    <p className="text-sm font-medium">Sistema actualizado</p>
                                    <p className="text-xs text-muted-foreground">
                                        Actualización de seguridad aplicada exitosamente
                                    </p>
                                    <p className="text-xs text-muted-foreground mt-1">Hace 2 horas</p>
                                </div>
                            </div>
                            
                            <div className="flex items-start space-x-3 p-3 bg-primary/10 border border-primary/20 rounded-lg">
                                <Users className="h-5 w-5 text-primary mt-0.5" />
                                <div className="flex-1">
                                    <p className="text-sm font-medium">Nuevo usuario registrado</p>
                                    <p className="text-xs text-muted-foreground">
                                        Dra. María González se unió al sistema
                                    </p>
                                    <p className="text-xs text-muted-foreground mt-1">Hace 3 horas</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Actividad reciente */}
                <Card>
                    <CardHeader>
                        <CardTitle>Actividad Reciente</CardTitle>
                        <CardDescription>Últimas acciones en el sistema</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex items-center space-x-4 p-3 border rounded-lg">
                                <div className="w-2 h-2 bg-success rounded-full"></div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium">Referencia completada</p>
                                    <p className="text-xs text-muted-foreground">
                                        Dr. Carlos Ruiz completó referencia #REF-2024-001
                                    </p>
                                </div>
                                <span className="text-xs text-muted-foreground">10:30 AM</span>
                            </div>
                            
                            <div className="flex items-center space-x-4 p-3 border rounded-lg">
                                <div className="w-2 h-2 bg-primary rounded-full"></div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium">Nueva referencia creada</p>
                                    <p className="text-xs text-muted-foreground">
                                        Dra. Ana López creó referencia #REF-2024-002
                                    </p>
                                </div>
                                <span className="text-xs text-muted-foreground">10:15 AM</span>
                            </div>
                            
                            <div className="flex items-center space-x-4 p-3 border rounded-lg">
                                <div className="w-2 h-2 bg-warning rounded-full"></div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium">Usuario conectado</p>
                                    <p className="text-xs text-muted-foreground">
                                        Dr. Miguel Torres inició sesión
                                    </p>
                                </div>
                                <span className="text-xs text-muted-foreground">09:45 AM</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}

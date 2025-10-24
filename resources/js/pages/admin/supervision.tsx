import { usePage } from '@inertiajs/react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import AppLayoutInertia from '@/layouts/app-layout-inertia'
import { type BreadcrumbItem } from '@/types'
import { Activity, Users, FileText, AlertTriangle, CheckCircle, Clock, Eye } from 'lucide-react'

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Supervisión', href: '/admin/supervision' },
]

const actividadesRecientes = [
    { id: 1, usuario: 'Dr. García', accion: 'Registro de paciente', tiempo: '2 min', estado: 'completado' },
    { id: 2, usuario: 'Dra. López', accion: 'Análisis de priorización', tiempo: '5 min', estado: 'en_proceso' },
    { id: 3, usuario: 'Dr. Martínez', accion: 'Consulta de historial', tiempo: '8 min', estado: 'completado' },
    { id: 4, usuario: 'IPS Central', accion: 'Solicitud de referencia', tiempo: '12 min', estado: 'pendiente' },
]

const metricas = [
    { titulo: 'Usuarios Activos', valor: '24', icono: Users, color: 'text-blue-600' },
    { titulo: 'Registros Hoy', valor: '156', icono: FileText, color: 'text-green-600' },
    { titulo: 'Casos Críticos', valor: '8', icono: AlertTriangle, color: 'text-red-600' },
    { titulo: 'Análisis IA', valor: '42', icono: Activity, color: 'text-purple-600' },
]

const rendimientoSistema = [
    { componente: 'Base de Datos', rendimiento: 95, estado: 'optimo' },
    { componente: 'API Gateway', rendimiento: 88, estado: 'bueno' },
    { componente: 'Servidor Web', rendimiento: 92, estado: 'optimo' },
    { componente: 'IA/ML Service', rendimiento: 78, estado: 'regular' },
]

export default function Supervision() {
    const { auth } = usePage<{ auth: { user: { nombre: string, role: string } } }>().props

    return (
        <AppLayoutInertia 
            title="Supervisión - HERMES" 
            breadcrumbs={breadcrumbs}
            user={{ name: auth.user.nombre, role: auth.user.role }}
        >
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Supervisión del Sistema</h1>
                    <p className="text-muted-foreground">Monitoreo en tiempo real de actividades y rendimiento</p>
                </div>

                {/* Métricas principales */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {metricas.map((metrica, index) => {
                        const IconComponent = metrica.icono
                        return (
                            <Card key={index}>
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">{metrica.titulo}</p>
                                            <p className="text-2xl font-bold">{metrica.valor}</p>
                                        </div>
                                        <IconComponent className={`h-8 w-8 ${metrica.color}`} />
                                    </div>
                                </CardContent>
                            </Card>
                        )
                    })}
                </div>

                <Tabs defaultValue="actividades" className="space-y-4">
                    <TabsList>
                        <TabsTrigger value="actividades">Actividades Recientes</TabsTrigger>
                        <TabsTrigger value="rendimiento">Rendimiento del Sistema</TabsTrigger>
                        <TabsTrigger value="alertas">Alertas y Notificaciones</TabsTrigger>
                    </TabsList>

                    <TabsContent value="actividades" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Actividades en Tiempo Real</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Usuario</TableHead>
                                            <TableHead>Acción</TableHead>
                                            <TableHead>Tiempo</TableHead>
                                            <TableHead>Estado</TableHead>
                                            <TableHead>Acciones</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {actividadesRecientes.map((actividad) => (
                                            <TableRow key={actividad.id}>
                                                <TableCell className="font-medium">{actividad.usuario}</TableCell>
                                                <TableCell>{actividad.accion}</TableCell>
                                                <TableCell>{actividad.tiempo}</TableCell>
                                                <TableCell>
                                                    <Badge variant={
                                                        actividad.estado === 'completado' ? 'default' :
                                                        actividad.estado === 'en_proceso' ? 'secondary' : 'destructive'
                                                    }>
                                                        {actividad.estado === 'completado' && <CheckCircle className="w-3 h-3 mr-1" />}
                                                        {actividad.estado === 'en_proceso' && <Clock className="w-3 h-3 mr-1" />}
                                                        {actividad.estado === 'pendiente' && <AlertTriangle className="w-3 h-3 mr-1" />}
                                                        {actividad.estado.replace('_', ' ')}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <Button variant="ghost" size="sm">
                                                        <Eye className="w-4 h-4" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="rendimiento" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Estado del Sistema</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {rendimientoSistema.map((item, index) => (
                                    <div key={index} className="space-y-2">
                                        <div className="flex justify-between items-center">
                                            <span className="font-medium">{item.componente}</span>
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm text-muted-foreground">{item.rendimiento}%</span>
                                                <Badge variant={
                                                    item.estado === 'optimo' ? 'default' :
                                                    item.estado === 'bueno' ? 'secondary' : 'destructive'
                                                }>
                                                    {item.estado}
                                                </Badge>
                                            </div>
                                        </div>
                                        <Progress value={item.rendimiento} className="h-2" />
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="alertas" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Alertas del Sistema</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 p-4 border rounded-lg">
                                        <AlertTriangle className="w-5 h-5 text-yellow-600" />
                                        <div className="flex-1">
                                            <p className="font-medium">Alto uso de CPU en servidor ML</p>
                                            <p className="text-sm text-muted-foreground">Uso del 85% detectado hace 5 minutos</p>
                                        </div>
                                        <Button variant="outline" size="sm">Revisar</Button>
                                    </div>
                                    <div className="flex items-center gap-3 p-4 border rounded-lg">
                                        <CheckCircle className="w-5 h-5 text-green-600" />
                                        <div className="flex-1">
                                            <p className="font-medium">Backup completado exitosamente</p>
                                            <p className="text-sm text-muted-foreground">Backup diario realizado a las 02:00 AM</p>
                                        </div>
                                        <Button variant="outline" size="sm">Ver detalles</Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </AppLayoutInertia>
    )
}
import { useState, useEffect } from 'react'
import { usePage } from '@inertiajs/react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import AppLayoutInertia from '@/layouts/app-layout-inertia'
import { type BreadcrumbItem } from '@/types'
import { 
    Server, 
    Database, 
    Cpu, 
    HardDrive, 
    Wifi, 
    Activity, 
    AlertTriangle, 
    CheckCircle, 
    RefreshCw,
    Users,
    Clock,
    Zap
} from 'lucide-react'

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Monitoreo', href: '/admin/monitoreo' },
]

const metricsData = {
    cpu: { value: 45, status: 'normal', trend: '+2%' },
    memory: { value: 68, status: 'warning', trend: '+5%' },
    disk: { value: 32, status: 'normal', trend: '-1%' },
    network: { value: 78, status: 'normal', trend: '+12%' },
}

const systemServices = [
    { name: 'Web Server', status: 'running', uptime: '15d 4h 23m', cpu: 12, memory: 256 },
    { name: 'Database', status: 'running', uptime: '15d 4h 23m', cpu: 8, memory: 512 },
    { name: 'API Gateway', status: 'running', uptime: '15d 4h 23m', cpu: 5, memory: 128 },
    { name: 'AI/ML Service', status: 'warning', uptime: '2d 1h 45m', cpu: 25, memory: 1024 },
    { name: 'File Storage', status: 'running', uptime: '15d 4h 23m', cpu: 3, memory: 64 },
]

const recentAlerts = [
    { id: 1, type: 'warning', message: 'Alto uso de memoria en AI/ML Service', time: '5 min ago', resolved: false },
    { id: 2, type: 'info', message: 'Backup completado exitosamente', time: '1 hour ago', resolved: true },
    { id: 3, type: 'error', message: 'Conexión lenta detectada en red externa', time: '2 hours ago', resolved: true },
    { id: 4, type: 'success', message: 'Actualización de seguridad aplicada', time: '4 hours ago', resolved: true },
]

const activeUsers = [
    { name: 'Dr. García', role: 'Médico', activity: 'Consultando pacientes', lastSeen: '2 min ago' },
    { name: 'Dra. López', role: 'Médico', activity: 'Análisis de priorización', lastSeen: '5 min ago' },
    { name: 'Admin Sistema', role: 'Administrador', activity: 'Revisando reportes', lastSeen: '8 min ago' },
    { name: 'IPS Central', role: 'IPS', activity: 'Gestionando solicitudes', lastSeen: '12 min ago' },
]

export default function Monitoreo() {
    const { auth } = usePage<{ auth: { user: { nombre: string, role: string } } }>().props
    const [isRefreshing, setIsRefreshing] = useState(false)
    const [lastUpdate, setLastUpdate] = useState(new Date())

    const refreshData = () => {
        setIsRefreshing(true)
        setTimeout(() => {
            setIsRefreshing(false)
            setLastUpdate(new Date())
        }, 2000)
    }

    useEffect(() => {
        const interval = setInterval(() => {
            setLastUpdate(new Date())
        }, 30000) // Auto-refresh every 30 seconds

        return () => clearInterval(interval)
    }, [])

    return (
        <AppLayoutInertia 
            title="Monitoreo - Vital Red" 
            breadcrumbs={breadcrumbs}
            user={auth.user}
        >
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">Monitoreo del Sistema</h1>
                        <p className="text-muted-foreground">
                            Monitoreo en tiempo real - Última actualización: {lastUpdate.toLocaleTimeString()}
                        </p>
                    </div>
                    <Button onClick={refreshData} disabled={isRefreshing} variant="outline">
                        <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                        Actualizar
                    </Button>
                </div>

                {/* Métricas del sistema */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">CPU</p>
                                    <p className="text-2xl font-bold">{metricsData.cpu.value}%</p>
                                    <p className="text-xs text-muted-foreground">{metricsData.cpu.trend}</p>
                                </div>
                                <Cpu className="h-8 w-8 text-blue-600" />
                            </div>
                            <Progress value={metricsData.cpu.value} className="mt-3" />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Memoria</p>
                                    <p className="text-2xl font-bold">{metricsData.memory.value}%</p>
                                    <p className="text-xs text-muted-foreground">{metricsData.memory.trend}</p>
                                </div>
                                <Zap className="h-8 w-8 text-yellow-600" />
                            </div>
                            <Progress value={metricsData.memory.value} className="mt-3" />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Disco</p>
                                    <p className="text-2xl font-bold">{metricsData.disk.value}%</p>
                                    <p className="text-xs text-muted-foreground">{metricsData.disk.trend}</p>
                                </div>
                                <HardDrive className="h-8 w-8 text-green-600" />
                            </div>
                            <Progress value={metricsData.disk.value} className="mt-3" />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Red</p>
                                    <p className="text-2xl font-bold">{metricsData.network.value}%</p>
                                    <p className="text-xs text-muted-foreground">{metricsData.network.trend}</p>
                                </div>
                                <Wifi className="h-8 w-8 text-purple-600" />
                            </div>
                            <Progress value={metricsData.network.value} className="mt-3" />
                        </CardContent>
                    </Card>
                </div>

                <Tabs defaultValue="services" className="space-y-4">
                    <TabsList>
                        <TabsTrigger value="services">Servicios</TabsTrigger>
                        <TabsTrigger value="alerts">Alertas</TabsTrigger>
                        <TabsTrigger value="users">Usuarios Activos</TabsTrigger>
                        <TabsTrigger value="performance">Rendimiento</TabsTrigger>
                    </TabsList>

                    <TabsContent value="services" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Estado de Servicios</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {systemServices.map((service, index) => (
                                        <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                                            <div className="flex items-center gap-3">
                                                <div className="flex items-center gap-2">
                                                    {service.status === 'running' ? (
                                                        <CheckCircle className="w-5 h-5 text-green-600" />
                                                    ) : (
                                                        <AlertTriangle className="w-5 h-5 text-yellow-600" />
                                                    )}
                                                    <span className="font-medium">{service.name}</span>
                                                </div>
                                                <Badge variant={service.status === 'running' ? 'default' : 'secondary'}>
                                                    {service.status}
                                                </Badge>
                                            </div>
                                            <div className="text-right text-sm text-muted-foreground">
                                                <p>Uptime: {service.uptime}</p>
                                                <p>CPU: {service.cpu}% | RAM: {service.memory}MB</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="alerts" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Alertas Recientes</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {recentAlerts.map((alert) => (
                                        <Alert key={alert.id} className={`border-l-4 ${
                                            alert.type === 'error' ? 'border-l-red-500' :
                                            alert.type === 'warning' ? 'border-l-yellow-500' :
                                            alert.type === 'success' ? 'border-l-green-500' : 'border-l-blue-500'
                                        }`}>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    {alert.type === 'error' && <AlertTriangle className="w-4 h-4 text-red-600" />}
                                                    {alert.type === 'warning' && <AlertTriangle className="w-4 h-4 text-yellow-600" />}
                                                    {alert.type === 'success' && <CheckCircle className="w-4 h-4 text-green-600" />}
                                                    {alert.type === 'info' && <Activity className="w-4 h-4 text-blue-600" />}
                                                    <AlertDescription className="font-medium">
                                                        {alert.message}
                                                    </AlertDescription>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs text-muted-foreground">{alert.time}</span>
                                                    {alert.resolved && (
                                                        <Badge variant="outline" className="text-xs">
                                                            Resuelto
                                                        </Badge>
                                                    )}
                                                </div>
                                            </div>
                                        </Alert>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="users" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Usuarios Activos</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {activeUsers.map((user, index) => (
                                        <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                                            <div className="flex items-center gap-3">
                                                <Users className="w-5 h-5 text-primary" />
                                                <div>
                                                    <p className="font-medium">{user.name}</p>
                                                    <p className="text-sm text-muted-foreground">{user.role}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm">{user.activity}</p>
                                                <p className="text-xs text-muted-foreground flex items-center gap-1">
                                                    <Clock className="w-3 h-3" />
                                                    {user.lastSeen}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="performance" className="space-y-4">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Métricas de Rendimiento</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <div className="flex justify-between">
                                            <span>Tiempo de respuesta promedio</span>
                                            <span className="font-medium">245ms</span>
                                        </div>
                                        <Progress value={75} />
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between">
                                            <span>Throughput (req/min)</span>
                                            <span className="font-medium">1,247</span>
                                        </div>
                                        <Progress value={85} />
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between">
                                            <span>Disponibilidad</span>
                                            <span className="font-medium">99.8%</span>
                                        </div>
                                        <Progress value={99.8} />
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Estadísticas de Base de Datos</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <div className="flex justify-between">
                                            <span>Conexiones activas</span>
                                            <span className="font-medium">23/100</span>
                                        </div>
                                        <Progress value={23} />
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between">
                                            <span>Consultas por segundo</span>
                                            <span className="font-medium">156</span>
                                        </div>
                                        <Progress value={65} />
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between">
                                            <span>Tamaño de BD</span>
                                            <span className="font-medium">2.4 GB</span>
                                        </div>
                                        <Progress value={40} />
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </AppLayoutInertia>
    )
}
import { useState } from 'react'
import { usePage } from '@inertiajs/react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { DatePickerWithRange } from '@/components/ui/date-range-picker'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import AppLayoutInertia from '@/layouts/app-layout-inertia'
import { type BreadcrumbItem } from '@/types'
import { BarChart, LineChart, PieChart, Download, FileText, TrendingUp, Users, Activity, Calendar } from 'lucide-react'

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Reportes', href: '/admin/reportes' },
]

const tiposReporte = [
    { id: 'actividad', nombre: 'Reporte de Actividad', icono: Activity, descripcion: 'Actividades del sistema por período' },
    { id: 'usuarios', nombre: 'Reporte de Usuarios', icono: Users, descripcion: 'Estadísticas de usuarios activos' },
    { id: 'pacientes', nombre: 'Reporte de Pacientes', icono: FileText, descripcion: 'Registros y consultas de pacientes' },
    { id: 'rendimiento', nombre: 'Reporte de Rendimiento', icono: TrendingUp, descripcion: 'Métricas de rendimiento del sistema' },
]

const reportesGenerados = [
    { id: 1, nombre: 'Actividad Mensual - Octubre 2024', tipo: 'Actividad', fecha: '2024-10-31', estado: 'completado', tamaño: '2.4 MB' },
    { id: 2, nombre: 'Usuarios Activos - Q3 2024', tipo: 'Usuarios', fecha: '2024-10-30', estado: 'completado', tamaño: '1.8 MB' },
    { id: 3, nombre: 'Pacientes Críticos - Octubre', tipo: 'Pacientes', fecha: '2024-10-29', estado: 'procesando', tamaño: '-' },
    { id: 4, nombre: 'Rendimiento Semanal', tipo: 'Rendimiento', fecha: '2024-10-28', estado: 'completado', tamaño: '3.1 MB' },
]

const estadisticasRapidas = [
    { titulo: 'Reportes Generados', valor: '156', cambio: '+12%', periodo: 'este mes' },
    { titulo: 'Tiempo Promedio', valor: '2.3 min', cambio: '-8%', periodo: 'generación' },
    { titulo: 'Descargas', valor: '89', cambio: '+24%', periodo: 'esta semana' },
    { titulo: 'Usuarios Activos', valor: '34', cambio: '+5%', periodo: 'reportes' },
]

export default function Reportes() {
    const { auth } = usePage<{ auth: { user: { nombre: string, role: string } } }>().props
    const [tipoReporte, setTipoReporte] = useState('')
    const [periodo, setPeriodo] = useState('')
    const [generandoReporte, setGenerandoReporte] = useState(false)

    const generarReporte = () => {
        setGenerandoReporte(true)
        // Simular generación de reporte
        setTimeout(() => {
            setGenerandoReporte(false)
        }, 3000)
    }

    return (
        <AppLayoutInertia 
            title="Reportes - HERMES" 
            breadcrumbs={breadcrumbs}
            user={{ name: auth.user.nombre, role: auth.user.role }}
        >
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Reportes del Sistema</h1>
                    <p className="text-muted-foreground">Generación y análisis de reportes estadísticos</p>
                </div>

                {/* Estadísticas rápidas */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {estadisticasRapidas.map((stat, index) => (
                        <Card key={index}>
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">{stat.titulo}</p>
                                        <p className="text-2xl font-bold">{stat.valor}</p>
                                        <p className="text-xs text-muted-foreground">{stat.periodo}</p>
                                    </div>
                                    <div className="text-right">
                                        <Badge variant={stat.cambio.startsWith('+') ? 'default' : 'secondary'}>
                                            {stat.cambio}
                                        </Badge>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <Tabs defaultValue="generar" className="space-y-4">
                    <TabsList>
                        <TabsTrigger value="generar">Generar Reporte</TabsTrigger>
                        <TabsTrigger value="historial">Historial</TabsTrigger>
                        <TabsTrigger value="programados">Programados</TabsTrigger>
                    </TabsList>

                    <TabsContent value="generar" className="space-y-4">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Configuración de reporte */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Configurar Nuevo Reporte</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Tipo de Reporte</label>
                                        <Select value={tipoReporte} onValueChange={setTipoReporte}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Seleccionar tipo" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {tiposReporte.map((tipo) => (
                                                    <SelectItem key={tipo.id} value={tipo.id}>
                                                        <div className="flex items-center gap-2">
                                                            <tipo.icono className="w-4 h-4" />
                                                            {tipo.nombre}
                                                        </div>
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Período</label>
                                        <Select value={periodo} onValueChange={setPeriodo}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Seleccionar período" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="hoy">Hoy</SelectItem>
                                                <SelectItem value="semana">Esta semana</SelectItem>
                                                <SelectItem value="mes">Este mes</SelectItem>
                                                <SelectItem value="trimestre">Este trimestre</SelectItem>
                                                <SelectItem value="año">Este año</SelectItem>
                                                <SelectItem value="personalizado">Personalizado</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {periodo === 'personalizado' && (
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Rango de Fechas</label>
                                            <DatePickerWithRange />
                                        </div>
                                    )}

                                    <Button 
                                        onClick={generarReporte} 
                                        disabled={!tipoReporte || !periodo || generandoReporte}
                                        className="w-full"
                                    >
                                        {generandoReporte ? (
                                            <>
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                                Generando...
                                            </>
                                        ) : (
                                            <>
                                                <FileText className="w-4 h-4 mr-2" />
                                                Generar Reporte
                                            </>
                                        )}
                                    </Button>
                                </CardContent>
                            </Card>

                            {/* Tipos de reporte disponibles */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Tipos de Reporte Disponibles</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {tiposReporte.map((tipo) => {
                                        const IconComponent = tipo.icono
                                        return (
                                            <div key={tipo.id} className="flex items-start gap-3 p-3 border rounded-lg">
                                                <IconComponent className="w-5 h-5 text-primary mt-0.5" />
                                                <div className="flex-1">
                                                    <h4 className="font-medium">{tipo.nombre}</h4>
                                                    <p className="text-sm text-muted-foreground">{tipo.descripcion}</p>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    <TabsContent value="historial" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Reportes Generados</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {reportesGenerados.map((reporte) => (
                                        <div key={reporte.id} className="flex items-center justify-between p-4 border rounded-lg">
                                            <div className="flex items-center gap-3">
                                                <FileText className="w-5 h-5 text-primary" />
                                                <div>
                                                    <h4 className="font-medium">{reporte.nombre}</h4>
                                                    <p className="text-sm text-muted-foreground">
                                                        {reporte.tipo} • {reporte.fecha} • {reporte.tamaño}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Badge variant={
                                                    reporte.estado === 'completado' ? 'default' :
                                                    reporte.estado === 'procesando' ? 'secondary' : 'destructive'
                                                }>
                                                    {reporte.estado}
                                                </Badge>
                                                {reporte.estado === 'completado' && (
                                                    <Button variant="outline" size="sm">
                                                        <Download className="w-4 h-4 mr-1" />
                                                        Descargar
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="programados" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Reportes Programados</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-center py-8">
                                    <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                                    <h3 className="font-medium mb-2">No hay reportes programados</h3>
                                    <p className="text-sm text-muted-foreground mb-4">
                                        Configura reportes automáticos para recibir información periódica
                                    </p>
                                    <Button variant="outline">
                                        Programar Reporte
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </AppLayoutInertia>
    )
}
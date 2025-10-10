import { useState } from 'react'
import { usePage } from '@inertiajs/react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  Calendar,
  Download,
  FileText,
  AlertTriangle,
  CheckCircle,
  Clock,
  Users,
  Activity,
  DollarSign,
  Target
} from "lucide-react"
import AppLayoutInertia from '@/layouts/app-layout-inertia'
import { type BreadcrumbItem } from '@/types'

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Panel IPS', href: '/ips/dashboard' },
    { title: 'Análisis y Reportes', href: '/ips/seguimiento' },
]

export default function AnalisisReportes() {
  const { user, metricas, registrosRecientes } = usePage<{ 
    user: { name: string, role: string },
    metricas: any,
    registrosRecientes: any[]
  }>().props
  const [periodoSeleccionado, setPeriodoSeleccionado] = useState("mes_actual")
  
  // Mock data para análisis
  const metricas = {
    registros_creados: 45,
    registros_aceptados: 38,
    registros_rechazados: 7,
    tiempo_promedio_respuesta: "2.3 horas",
    tasa_aceptacion: 84.4,
    especialidades_mas_solicitadas: [
      { nombre: "Cardiología", cantidad: 12, porcentaje: 26.7 },
      { nombre: "Endocrinología", cantidad: 8, porcentaje: 17.8 },
      { nombre: "Traumatología", cantidad: 7, porcentaje: 15.6 },
      { nombre: "Neurología", cantidad: 6, porcentaje: 13.3 },
      { nombre: "Otros", cantidad: 12, porcentaje: 26.6 }
    ],
    diagnosticos_frecuentes: [
      { codigo: "I10", descripcion: "Hipertensión arterial", cantidad: 8 },
      { codigo: "E11.9", descripcion: "Diabetes mellitus tipo 2", cantidad: 6 },
      { codigo: "M79.3", descripcion: "Dolor musculoesquelético", cantidad: 5 },
      { codigo: "J44.1", descripcion: "EPOC con exacerbación", cantidad: 4 },
      { codigo: "N18.6", descripcion: "Enfermedad renal crónica", cantidad: 3 }
    ],
    rendimiento_mensual: [
      { mes: "Ene", registros: 32, aceptados: 28, rechazados: 4 },
      { mes: "Feb", registros: 38, aceptados: 31, rechazados: 7 },
      { mes: "Mar", registros: 45, aceptados: 38, rechazados: 7 },
    ],
    alertas_calidad: [
      { tipo: "warning", mensaje: "Tasa de rechazo alta en Neurología (25%)", fecha: "2024-01-20" },
      { tipo: "info", mensaje: "Tiempo de respuesta mejorado en 15%", fecha: "2024-01-19" },
      { tipo: "success", mensaje: "Meta mensual de registros alcanzada", fecha: "2024-01-18" }
    ]
  }

  const getAlertIcon = (tipo: string) => {
    switch(tipo) {
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-600" />
      case 'success': return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'info': return <Activity className="h-4 w-4 text-blue-600" />
      default: return <Clock className="h-4 w-4 text-gray-600" />
    }
  }

  return (
    <AppLayoutInertia 
      title="Análisis y Reportes - Vital Red" 
      breadcrumbs={breadcrumbs}
      user={user}
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Análisis y Reportes</h1>
            <p className="text-muted-foreground">Métricas de rendimiento y análisis de tu IPS</p>
          </div>
          <div className="flex items-center gap-2">
            <select 
              className="px-3 py-2 border rounded-md bg-background"
              value={periodoSeleccionado}
              onChange={(e) => setPeriodoSeleccionado(e.target.value)}
            >
              <option value="mes_actual">Mes actual</option>
              <option value="trimestre">Último trimestre</option>
              <option value="semestre">Último semestre</option>
              <option value="año">Último año</option>
            </select>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  Exportar Reporte
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Exportar Reporte</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label>Tipo de reporte:</Label>
                    <select className="w-full mt-1 px-3 py-2 border rounded-md">
                      <option>Reporte completo (PDF)</option>
                      <option>Datos en Excel</option>
                      <option>Resumen ejecutivo</option>
                      <option>Análisis por especialidad</option>
                    </select>
                  </div>
                  <div>
                    <Label>Período:</Label>
                    <select className="w-full mt-1 px-3 py-2 border rounded-md">
                      <option>Mes actual</option>
                      <option>Último trimestre</option>
                      <option>Último semestre</option>
                      <option>Año completo</option>
                    </select>
                  </div>
                  <div>
                    <Label>Comentarios adicionales:</Label>
                    <Textarea placeholder="Agregar notas al reporte..." className="mt-1" />
                  </div>
                  <div className="flex gap-2">
                    <Button className="flex-1">Generar Reporte</Button>
                    <Button variant="outline">Programar Envío</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Métricas principales */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Registros Creados</p>
                  <p className="text-3xl font-bold text-foreground">{metricas.registros_creados}</p>
                  <p className="text-sm text-green-600 flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    +12% vs mes anterior
                  </p>
                </div>
                <FileText className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Tasa de Aceptación</p>
                  <p className="text-3xl font-bold text-foreground">{metricas.tasa_aceptacion}%</p>
                  <p className="text-sm text-green-600 flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    +3% vs mes anterior
                  </p>
                </div>
                <Target className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Tiempo Promedio</p>
                  <p className="text-3xl font-bold text-foreground">{metricas.tiempo_promedio_respuesta}</p>
                  <p className="text-sm text-green-600 flex items-center gap-1">
                    <TrendingDown className="h-3 w-3" />
                    -15% vs mes anterior
                  </p>
                </div>
                <Clock className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Casos Rechazados</p>
                  <p className="text-3xl font-bold text-foreground">{metricas.registros_rechazados}</p>
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    +2 vs mes anterior
                  </p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Especialidades más solicitadas */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Especialidades Más Solicitadas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {metricas.especialidades_mas_solicitadas.map((especialidad, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium">{especialidad.nombre}</span>
                        <span className="text-sm text-muted-foreground">{especialidad.cantidad} casos</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${especialidad.porcentaje}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Diagnósticos más frecuentes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Diagnósticos Más Frecuentes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Código</TableHead>
                    <TableHead>Descripción</TableHead>
                    <TableHead>Cantidad</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {metricas.diagnosticos_frecuentes.map((diagnostico, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-mono text-sm">{diagnostico.codigo}</TableCell>
                      <TableCell className="text-sm">{diagnostico.descripcion}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{diagnostico.cantidad}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* Rendimiento mensual */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Rendimiento Mensual
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              {metricas.rendimiento_mensual.map((mes, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <h3 className="font-semibold text-center mb-3">{mes.mes} 2024</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Total:</span>
                      <span className="font-medium">{mes.registros}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-green-600">Aceptados:</span>
                      <span className="font-medium text-green-600">{mes.aceptados}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-red-600">Rechazados:</span>
                      <span className="font-medium text-red-600">{mes.rechazados}</span>
                    </div>
                    <div className="pt-2 border-t">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Tasa éxito:</span>
                        <span className="font-bold">{Math.round((mes.aceptados / mes.registros) * 100)}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Alertas de calidad */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Alertas de Calidad
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {metricas.alertas_calidad.map((alerta, index) => (
                <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                  {getAlertIcon(alerta.tipo)}
                  <div className="flex-1">
                    <p className="text-sm font-medium">{alerta.mensaje}</p>
                    <p className="text-xs text-muted-foreground">{alerta.fecha}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Acciones rápidas */}
        <Card>
          <CardHeader>
            <CardTitle>Acciones Rápidas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="flex flex-col items-center gap-2 h-20">
                    <FileText className="h-6 w-6" />
                    <span className="text-sm">Reporte Mensual</span>
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Reporte Mensual</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 border rounded">
                        <h3 className="font-semibold mb-2">Resumen del Mes</h3>
                        <p className="text-sm text-muted-foreground">45 registros creados</p>
                        <p className="text-sm text-muted-foreground">84.4% tasa de aceptación</p>
                        <p className="text-sm text-muted-foreground">2.3h tiempo promedio</p>
                      </div>
                      <div className="p-4 border rounded">
                        <h3 className="font-semibold mb-2">Comparación</h3>
                        <p className="text-sm text-green-600">+12% vs mes anterior</p>
                        <p className="text-sm text-green-600">+3% tasa aceptación</p>
                        <p className="text-sm text-green-600">-15% tiempo respuesta</p>
                      </div>
                    </div>
                    <Button className="w-full">Descargar Reporte Completo</Button>
                  </div>
                </DialogContent>
              </Dialog>
              
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="flex flex-col items-center gap-2 h-20">
                    <BarChart3 className="h-6 w-6" />
                    <span className="text-sm">Análisis Detallado</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl">
                  <DialogHeader>
                    <DialogTitle>Análisis Detallado</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                      <Card>
                        <CardContent className="p-4">
                          <h3 className="font-semibold mb-2">Tendencias</h3>
                          <p className="text-sm">Crecimiento sostenido en solicitudes</p>
                          <p className="text-sm">Mejora en tiempos de respuesta</p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4">
                          <h3 className="font-semibold mb-2">Oportunidades</h3>
                          <p className="text-sm">Reducir rechazos en Neurología</p>
                          <p className="text-sm">Optimizar proceso de documentación</p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4">
                          <h3 className="font-semibold mb-2">Recomendaciones</h3>
                          <p className="text-sm">Capacitación en CIE-10</p>
                          <p className="text-sm">Implementar checklist de calidad</p>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
              
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="flex flex-col items-center gap-2 h-20">
                    <Users className="h-6 w-6" />
                    <span className="text-sm">Reporte Médicos</span>
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Reporte por Médicos</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Médico</TableHead>
                          <TableHead>Especialidad</TableHead>
                          <TableHead>Casos Atendidos</TableHead>
                          <TableHead>Tiempo Promedio</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell>Dr. Carlos Mendoza</TableCell>
                          <TableCell>Cardiología</TableCell>
                          <TableCell>12</TableCell>
                          <TableCell>1.8h</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Dra. María Fernández</TableCell>
                          <TableCell>Endocrinología</TableCell>
                          <TableCell>8</TableCell>
                          <TableCell>2.1h</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </DialogContent>
              </Dialog>
              
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="flex flex-col items-center gap-2 h-20">
                    <DollarSign className="h-6 w-6" />
                    <span className="text-sm">Análisis Costos</span>
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Análisis de Costos</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 border rounded">
                        <h3 className="font-semibold mb-2">Costos por Especialidad</h3>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span>Cardiología:</span>
                            <span>$2,400,000</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Endocrinología:</span>
                            <span>$1,800,000</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Traumatología:</span>
                            <span>$1,600,000</span>
                          </div>
                        </div>
                      </div>
                      <div className="p-4 border rounded">
                        <h3 className="font-semibold mb-2">Ahorro por Eficiencia</h3>
                        <p className="text-lg font-bold text-green-600">$450,000</p>
                        <p className="text-sm text-muted-foreground">Reducción de tiempos de respuesta</p>
                      </div>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayoutInertia>
  )
}
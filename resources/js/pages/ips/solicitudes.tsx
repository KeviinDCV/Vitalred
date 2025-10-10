import { useState } from "react"
import { usePage } from '@inertiajs/react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Search, Eye, FileText, Clock, CheckCircle, AlertCircle, Building, Download } from "lucide-react"
import AppLayoutInertia from '@/layouts/app-layout-inertia'
import { type BreadcrumbItem } from '@/types'

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Panel IPS', href: '/ips/dashboard' },
    { title: 'Solicitudes', href: '/ips/solicitudes' },
]

export default function Solicitudes() {
  const { user, registros } = usePage<{ 
    user: { name: string, role: string }, 
    registros: any[] 
  }>().props
  const [searchTerm, setSearchTerm] = useState("")
  const [filtroEstado, setFiltroEstado] = useState("todos")
  
  // Datos de ejemplo para referencia (se usan datos reales del controlador)
  const registrosEjemplo = [
    {
      id: 'IPS001-REG001',
      tipo_identificacion: 'CC',
      numero_identificacion: '12345678',
      nombre: 'Ana García',
      apellidos: 'Rodríguez',
      fecha_nacimiento: '1979-03-15',
      edad: 45,
      sexo: 'F',
      asegurador: 'EPS SURA',
      departamento: 'Antioquia',
      ciudad: 'Medellín',
      institucion_remitente: 'Hospital San Juan',
      tipo_paciente: 'AMBULATORIO',
      diagnostico_principal: 'I10 - Hipertensión arterial',
      diagnostico_1: 'E78.0 - Hipercolesterolemia',
      diagnostico_2: '',
      fecha_ingreso: '2024-01-15',
      motivo_consulta: 'Paciente refiere cefalea intensa y mareos frecuentes',
      clasificacion_triage: '3',
      enfermedad_actual: 'Paciente con antecedente de HTA no controlada, presenta cefalea occipital de 3 días de evolución',
      antecedentes: 'HTA diagnosticada hace 2 años, dislipidemia',
      frecuencia_cardiaca: '85',
      frecuencia_respiratoria: '18',
      temperatura: '36.5',
      tension_sistolica: '160',
      tension_diastolica: '95',
      saturacion_oxigeno: '98',
      motivo_remision: 'Requiere valoración por cardiología para ajuste de tratamiento antihipertensivo',
      tipo_solicitud: 'INTERCONSULTA',
      especialidad_solicitada: 'CARDIOLOGIA',
      tipo_servicio: 'CONSULTA_EXTERNA',
      estado: 'pendiente',
      prioridad: 'media',
      fechaCreacion: '2024-01-15',
      ipsCreadora: 'Hospital San Juan',
      documentos: ['historia_clinica.pdf', 'examenes_laboratorio.pdf']
    },
    {
      id: 'IPS001-REG002',
      tipo_identificacion: 'CC',
      numero_identificacion: '87654321',
      nombre: 'Luis',
      apellidos: 'Martín López',
      fecha_nacimiento: '1992-08-22',
      edad: 32,
      sexo: 'M',
      asegurador: 'Nueva EPS',
      departamento: 'Antioquia',
      ciudad: 'Medellín',
      institucion_remitente: 'Hospital San Juan',
      tipo_paciente: 'HOSPITALIZADO',
      diagnostico_principal: 'E11.9 - Diabetes mellitus tipo 2',
      diagnostico_1: 'Z87.891 - Antecedente personal de tabaquismo',
      diagnostico_2: '',
      fecha_ingreso: '2024-01-14',
      motivo_consulta: 'Control de diabetes mellitus, poliuria y polidipsia',
      clasificacion_triage: '2',
      enfermedad_actual: 'Paciente diabético tipo 2 con mal control glucémico, glicemias en ayunas >200mg/dl',
      antecedentes: 'DM2 diagnosticada hace 5 años, ex fumador',
      frecuencia_cardiaca: '92',
      frecuencia_respiratoria: '20',
      temperatura: '36.8',
      tension_sistolica: '140',
      tension_diastolica: '85',
      saturacion_oxigeno: '97',
      motivo_remision: 'Requiere ajuste de esquema insulínico y seguimiento especializado',
      tipo_solicitud: 'REMISION',
      especialidad_solicitada: 'ENDOCRINOLOGIA',
      tipo_servicio: 'HOSPITALIZACION',
      estado: 'aceptada',
      prioridad: 'alta',
      fechaCreacion: '2024-01-14',
      ipsCreadora: 'Hospital San Juan',
      documentos: ['historia_clinica.pdf', 'glicemias.pdf', 'hba1c.pdf']
    }
  ]
  
  const getEstadoBadge = (estado: string) => {
    const variants = {
      'pendiente': { variant: 'secondary' as const, icon: Clock },
      'aceptada': { variant: 'default' as const, icon: CheckCircle },
      'completada': { variant: 'default' as const, icon: CheckCircle },
      'urgente': { variant: 'destructive' as const, icon: AlertCircle }
    }
    const config = variants[estado as keyof typeof variants] || variants.pendiente
    const Icon = config.icon
    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {estado.charAt(0).toUpperCase() + estado.slice(1)}
      </Badge>
    )
  }
  
  const getPrioridadBadge = (prioridad: string) => {
    const variants = {
      'baja': 'outline',
      'media': 'secondary', 
      'alta': 'default',
      'urgente': 'destructive'
    }
    return (
      <Badge variant={variants[prioridad as keyof typeof variants] as any}>
        {prioridad.charAt(0).toUpperCase() + prioridad.slice(1)}
      </Badge>
    )
  }

  // Usar datos reales del controlador en lugar de mock data
  const registrosReales = registros || [];
  
  const filteredRegistros = registrosReales.filter((registro: any) => {
    const matchesSearch = searchTerm === "" || 
      registro.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      registro.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      registro.diagnostico_principal.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesEstado = filtroEstado === "todos" || registro.estado === filtroEstado
    
    return matchesSearch && matchesEstado
  })

  return (
    <AppLayoutInertia 
      title="Solicitudes - Vital Red" 
      breadcrumbs={breadcrumbs}
      user={user}
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Mis Registros</h1>
            <p className="text-muted-foreground">Registros médicos creados por tu IPS</p>
          </div>
          <div className="flex items-center gap-2">
            <Building className="h-4 w-4 text-muted-foreground" />
            <Badge variant="outline" className="text-sm">
              {registros?.length || 0} registros propios
            </Badge>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Buscar en mis registros
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por paciente, ID, diagnóstico..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <select 
                className="px-3 py-2 border rounded-md bg-background"
                value={filtroEstado}
                onChange={(e) => setFiltroEstado(e.target.value)}
              >
                <option value="todos">Todos los estados</option>
                <option value="pendiente">Pendiente</option>
                <option value="aceptada">Aceptada</option>
                <option value="completada">Completada</option>
              </select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Registros Médicos ({filteredRegistros.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Paciente</TableHead>
                  <TableHead>Diagnóstico</TableHead>
                  <TableHead>Especialidad</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Prioridad</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRegistros.map((registro) => (
                  <TableRow key={registro.id}>
                    <TableCell className="font-mono text-sm">{registro.id}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{registro.nombre} {registro.apellidos}</div>
                        <div className="text-sm text-muted-foreground">{registro.numero_identificacion}</div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">{registro.diagnostico_principal}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{registro.especialidad_solicitada}</Badge>
                    </TableCell>
                    <TableCell>{getEstadoBadge(registro.estado)}</TableCell>
                    <TableCell>{getPrioridadBadge(registro.prioridad)}</TableCell>
                    <TableCell className="text-sm">{registro.fechaCreacion}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" title="Ver registro completo">
                              <Eye className="h-3 w-3" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>Registro Médico - {registro.id}</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-6">
                              <Card>
                                <CardHeader>
                                  <CardTitle className="text-lg">Información Personal</CardTitle>
                                </CardHeader>
                                <CardContent className="grid grid-cols-2 gap-4">
                                  <div><Label>Tipo ID:</Label> <p>{registro.tipo_identificacion}</p></div>
                                  <div><Label>Número ID:</Label> <p>{registro.numero_identificacion}</p></div>
                                  <div><Label>Nombres:</Label> <p>{registro.nombre}</p></div>
                                  <div><Label>Apellidos:</Label> <p>{registro.apellidos}</p></div>
                                  <div><Label>Fecha Nacimiento:</Label> <p>{registro.fecha_nacimiento}</p></div>
                                  <div><Label>Edad:</Label> <p>{registro.edad} años</p></div>
                                  <div><Label>Sexo:</Label> <p>{registro.sexo}</p></div>
                                </CardContent>
                              </Card>
                              
                              <Card>
                                <CardHeader>
                                  <CardTitle className="text-lg">Datos Sociodemográficos</CardTitle>
                                </CardHeader>
                                <CardContent className="grid grid-cols-2 gap-4">
                                  <div><Label>Asegurador:</Label> <p>{registro.asegurador}</p></div>
                                  <div><Label>Departamento:</Label> <p>{registro.departamento}</p></div>
                                  <div><Label>Ciudad:</Label> <p>{registro.ciudad}</p></div>
                                  <div><Label>Institución:</Label> <p>{registro.institucion_remitente}</p></div>
                                </CardContent>
                              </Card>
                              
                              <Card>
                                <CardHeader>
                                  <CardTitle className="text-lg">Datos Clínicos</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div><Label>Tipo Paciente:</Label> <p>{registro.tipo_paciente}</p></div>
                                    <div><Label>Triage:</Label> <p>Nivel {registro.clasificacion_triage}</p></div>
                                    <div><Label>Fecha Ingreso:</Label> <p>{registro.fecha_ingreso}</p></div>
                                  </div>
                                  <div><Label>Diagnóstico Principal:</Label> <p>{registro.diagnostico_principal}</p></div>
                                  {registro.diagnostico_1 && <div><Label>Diagnóstico 1:</Label> <p>{registro.diagnostico_1}</p></div>}
                                  <div><Label>Motivo Consulta:</Label> <p>{registro.motivo_consulta}</p></div>
                                  <div><Label>Enfermedad Actual:</Label> <p>{registro.enfermedad_actual}</p></div>
                                  <div><Label>Antecedentes:</Label> <p>{registro.antecedentes}</p></div>
                                  
                                  <div className="grid grid-cols-3 gap-4 p-4 bg-muted rounded">
                                    <div><Label>FC:</Label> <p>{registro.frecuencia_cardiaca} lpm</p></div>
                                    <div><Label>FR:</Label> <p>{registro.frecuencia_respiratoria} rpm</p></div>
                                    <div><Label>Temp:</Label> <p>{registro.temperatura}°C</p></div>
                                    <div><Label>TA:</Label> <p>{registro.tension_sistolica}/{registro.tension_diastolica} mmHg</p></div>
                                    <div><Label>SatO2:</Label> <p>{registro.saturacion_oxigeno}%</p></div>
                                  </div>
                                </CardContent>
                              </Card>
                              
                              <Card>
                                <CardHeader>
                                  <CardTitle className="text-lg">Datos de Remisión</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                  <div><Label>Motivo Remisión:</Label> <p>{registro.motivo_remision}</p></div>
                                  <div className="grid grid-cols-2 gap-4">
                                    <div><Label>Tipo Solicitud:</Label> <p>{registro.tipo_solicitud}</p></div>
                                    <div><Label>Especialidad:</Label> <p>{registro.especialidad_solicitada}</p></div>
                                    <div><Label>Tipo Servicio:</Label> <p>{registro.tipo_servicio}</p></div>
                                  </div>
                                </CardContent>
                              </Card>
                            </div>
                          </DialogContent>
                        </Dialog>
                        
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" title="Ver documentos">
                              <FileText className="h-3 w-3" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Documentos Adjuntos - {registro.id}</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              {registro.documentos?.map((doc, index) => (
                                <div key={index} className="flex items-center justify-between p-3 border rounded">
                                  <div className="flex items-center gap-2">
                                    <FileText className="h-4 w-4" />
                                    <span>{doc}</span>
                                  </div>
                                  <Button variant="outline" size="sm">
                                    <Download className="h-3 w-3 mr-1" />
                                    Descargar
                                  </Button>
                                </div>
                              )) || <p className="text-muted-foreground">No hay documentos adjuntos</p>}
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            {filteredRegistros.length === 0 && (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No se encontraron registros</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayoutInertia>
  )
}
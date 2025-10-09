import { usePage } from '@inertiajs/react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MOCK_REFERENCIAS } from "@/lib/mock-data"
import { MessageSquare, FileText, Calendar, Download, CheckCircle } from "lucide-react"
import AppLayoutInertia from '@/layouts/app-layout-inertia'
import { type BreadcrumbItem } from '@/types'

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/ips/dashboard' },
    { title: 'Seguimiento', href: '/ips/seguimiento' },
]

export default function SeguimientoIPS() {
  const { auth } = usePage<{ auth: { user: { nombre: string, role: string } } }>().props
  const pacientesEnSeguimiento = MOCK_REFERENCIAS.filter((r) => r.estado === "aceptada" || r.estado === "en_proceso")

  return (
    <AppLayoutInertia 
      title="Seguimiento IPS - Vital Red" 
      breadcrumbs={breadcrumbs}
      user={auth.user}
    >
      <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Seguimiento de Pacientes</h1>
        <p className="text-muted-foreground">Monitorea el estado de tus pacientes referidos</p>
      </div>

      <div className="grid gap-6">
        {pacientesEnSeguimiento.map((paciente) => (
          <Card key={paciente.id} className="bg-card border-border">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-foreground mb-2">{paciente.paciente.nombre}</CardTitle>
                  <div className="flex gap-2 text-sm">
                    <Badge variant="outline" className="bg-secondary">
                      {paciente.paciente.identificacion}
                    </Badge>
                    <Badge variant="outline" className="bg-secondary">
                      {paciente.especialidad}
                    </Badge>
                    <Badge className="bg-success text-success-foreground">Aceptado</Badge>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">ID: {paciente.id}</p>
                  <p className="text-sm text-muted-foreground">Médico: {paciente.medicoAsignado || "Por asignar"}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="p-4 bg-secondary rounded-lg">
                  <h3 className="text-sm font-semibold text-foreground mb-3">Información del Paciente</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Edad:</span>
                      <span className="text-foreground">{paciente.paciente.edad} años</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Género:</span>
                      <span className="text-foreground">{paciente.paciente.genero}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Fecha de referencia:</span>
                      <span className="text-foreground">{paciente.fechaCreacion.toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-secondary rounded-lg">
                  <h3 className="text-sm font-semibold text-foreground mb-3">Estado del Tratamiento</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-success" />
                      <span className="text-sm text-foreground">Caso aceptado por especialista</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-success" />
                      <span className="text-sm text-foreground">Primera consulta realizada</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-warning" />
                      <span className="text-sm text-foreground">En tratamiento activo</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-secondary rounded-lg">
                <h3 className="text-sm font-semibold text-foreground mb-2">Motivo de Referencia</h3>
                <p className="text-sm text-muted-foreground">{paciente.motivo}</p>
                {paciente.observaciones && (
                  <>
                    <h3 className="text-sm font-semibold text-foreground mt-3 mb-2">Observaciones del Médico</h3>
                    <p className="text-sm text-muted-foreground">{paciente.observaciones}</p>
                  </>
                )}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                <Button variant="outline" className="gap-2 bg-transparent">
                  <FileText className="h-4 w-4" />
                  Ver Evolución
                </Button>
                <Button variant="outline" className="gap-2 bg-transparent">
                  <MessageSquare className="h-4 w-4" />
                  Comunicar Médico
                </Button>
                <Button variant="outline" className="gap-2 bg-transparent">
                  <Calendar className="h-4 w-4" />
                  Solicitar Info
                </Button>
                <Button variant="outline" className="gap-2 bg-transparent">
                  <Download className="h-4 w-4" />
                  Exportar
                </Button>
              </div>

              <div className="flex gap-2 pt-2">
                <Button className="flex-1 bg-success hover:bg-success/90 gap-2">
                  <CheckCircle className="h-4 w-4" />
                  Recibir Paciente (Contrarreferencia)
                </Button>
                <Button variant="outline" className="gap-2 bg-transparent">
                  <Calendar className="h-4 w-4" />
                  Programar Seguimiento
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {pacientesEnSeguimiento.length === 0 && (
        <Card className="bg-card border-border">
          <CardContent className="py-12 text-center">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No hay pacientes en seguimiento</h3>
            <p className="text-muted-foreground">Los pacientes aceptados por especialistas aparecerán aquí</p>
          </CardContent>
        </Card>
      )}
      </div>
    </AppLayoutInertia>
  )
}

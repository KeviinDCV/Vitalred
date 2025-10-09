import { useState } from "react"
import { usePage } from '@inertiajs/react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { MOCK_REFERENCIAS } from "@/lib/mock-data"
import { Calendar, FileText, MessageSquare, Pill, CheckCircle, ArrowLeft } from "lucide-react"
import AppLayoutInertia from '@/layouts/app-layout-inertia'
import { type BreadcrumbItem } from '@/types'

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/medico/dashboard' },
    { title: 'Seguimiento', href: '/medico/seguimiento' },
]

export default function Seguimiento() {
  const { auth } = usePage<{ auth: { user: { nombre: string, role: string } } }>().props
  const [notaEvolucion, setNotaEvolucion] = useState("")

  const pacientesEnSeguimiento = MOCK_REFERENCIAS.filter((r) => r.estado === "aceptada" || r.estado === "en_proceso")

  return (
    <AppLayoutInertia 
      title="Seguimiento - Vital Red" 
      breadcrumbs={breadcrumbs}
      user={auth.user}
    >
      <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Seguimiento de Pacientes</h1>
        <p className="text-muted-foreground">Gestiona la evolución de tus pacientes</p>
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
                      {paciente.paciente.edad} años
                    </Badge>
                    <Badge variant="outline" className="bg-secondary">
                      {paciente.especialidad}
                    </Badge>
                    <Badge className="bg-primary text-primary-foreground">En seguimiento</Badge>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">ID: {paciente.id}</p>
                  <p className="text-sm text-muted-foreground">IPS: {paciente.ipsOrigen}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-secondary rounded-lg">
                <h3 className="text-sm font-semibold text-foreground mb-3">Cronología de Eventos</h3>
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className="w-2 h-2 rounded-full bg-primary" />
                      <div className="w-0.5 h-full bg-border" />
                    </div>
                    <div className="flex-1 pb-3">
                      <p className="text-sm font-medium text-foreground">Caso aceptado</p>
                      <p className="text-xs text-muted-foreground">Hace 2 días</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className="w-2 h-2 rounded-full bg-success" />
                      <div className="w-0.5 h-full bg-border" />
                    </div>
                    <div className="flex-1 pb-3">
                      <p className="text-sm font-medium text-foreground">Primera consulta realizada</p>
                      <p className="text-xs text-muted-foreground">Hace 1 día</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className="w-2 h-2 rounded-full bg-warning" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">Tratamiento iniciado</p>
                      <p className="text-xs text-muted-foreground">Hace 12 horas</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Nota de Evolución</label>
                <Textarea
                  placeholder="Escribe la evolución del paciente..."
                  value={notaEvolucion}
                  onChange={(e) => setNotaEvolucion(e.target.value)}
                  className="bg-secondary border-border text-foreground min-h-[100px]"
                />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                <Button variant="outline" className="gap-2 bg-transparent">
                  <FileText className="h-4 w-4" />
                  Actualizar
                </Button>
                <Button variant="outline" className="gap-2 bg-transparent">
                  <Calendar className="h-4 w-4" />
                  Programar Control
                </Button>
                <Button variant="outline" className="gap-2 bg-transparent">
                  <Pill className="h-4 w-4" />
                  Cambiar Tratamiento
                </Button>
                <Button variant="outline" className="gap-2 bg-transparent">
                  <MessageSquare className="h-4 w-4" />
                  Comunicar IPS
                </Button>
              </div>

              <div className="flex gap-2 pt-2">
                <Button className="flex-1 bg-success hover:bg-success/90 gap-2">
                  <CheckCircle className="h-4 w-4" />
                  Dar Alta
                </Button>
                <Button variant="outline" className="flex-1 gap-2 bg-transparent">
                  <ArrowLeft className="h-4 w-4" />
                  Contrarreferir
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
            <p className="text-muted-foreground">Los pacientes que aceptes aparecerán aquí</p>
          </CardContent>
        </Card>
      )}
      </div>
    </AppLayoutInertia>
  )
}

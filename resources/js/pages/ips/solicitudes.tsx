import type React from "react"
import { useState } from "react"
import { usePage } from '@inertiajs/react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { StatusBadge } from "@/components/status-badge"
import { MOCK_REFERENCIAS } from "@/lib/mock-data"
import { Send, Upload, Search, Filter, Copy, X } from "lucide-react"
import AppLayoutInertia from '@/layouts/app-layout-inertia'
import { type BreadcrumbItem } from '@/types'

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/ips/dashboard' },
    { title: 'Solicitudes', href: '/ips/solicitudes' },
]

export default function Solicitudes() {
  const { auth } = usePage<{ auth: { user: { nombre: string, role: string } } }>().props
  const [nombrePaciente, setNombrePaciente] = useState("")
  const [identificacion, setIdentificacion] = useState("")
  const [edad, setEdad] = useState("")
  const [genero, setGenero] = useState("")
  const [especialidad, setEspecialidad] = useState("")
  const [prioridad, setPrioridad] = useState("")
  const [motivo, setMotivo] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
      }

  return (
    <AppLayoutInertia 
      title="Solicitudes - Vital Red" 
      breadcrumbs={breadcrumbs}
      user={auth.user}
    >
      <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Gestión de Solicitudes</h1>
        <p className="text-muted-foreground">Crea y administra solicitudes de referencia</p>
      </div>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Nueva Solicitud de Referencia</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="nombre" className="text-foreground">
                  Nombre del Paciente
                </Label>
                <Input
                  id="nombre"
                  value={nombrePaciente}
                  onChange={(e) => setNombrePaciente(e.target.value)}
                  className="bg-secondary border-border"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="identificacion" className="text-foreground">
                  Identificación
                </Label>
                <Input
                  id="identificacion"
                  value={identificacion}
                  onChange={(e) => setIdentificacion(e.target.value)}
                  className="bg-secondary border-border"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edad" className="text-foreground">
                  Edad
                </Label>
                <Input
                  id="edad"
                  type="number"
                  value={edad}
                  onChange={(e) => setEdad(e.target.value)}
                  className="bg-secondary border-border"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="genero" className="text-foreground">
                  Género
                </Label>
                <Select value={genero} onValueChange={setGenero}>
                  <SelectTrigger className="bg-secondary border-border">
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border">
                    <SelectItem value="masculino">Masculino</SelectItem>
                    <SelectItem value="femenino">Femenino</SelectItem>
                    <SelectItem value="otro">Otro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="especialidad" className="text-foreground">
                  Especialidad Requerida
                </Label>
                <Select value={especialidad} onValueChange={setEspecialidad}>
                  <SelectTrigger className="bg-secondary border-border">
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border">
                    <SelectItem value="cardiologia">Cardiología</SelectItem>
                    <SelectItem value="neurologia">Neurología</SelectItem>
                    <SelectItem value="pediatria">Pediatría</SelectItem>
                    <SelectItem value="traumatologia">Traumatología</SelectItem>
                    <SelectItem value="ginecologia">Ginecología</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="prioridad" className="text-foreground">
                  Prioridad
                </Label>
                <Select value={prioridad} onValueChange={setPrioridad}>
                  <SelectTrigger className="bg-secondary border-border">
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border">
                    <SelectItem value="critica">Crítica</SelectItem>
                    <SelectItem value="urgente">Urgente</SelectItem>
                    <SelectItem value="normal">Normal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="motivo" className="text-foreground">
                Motivo de Consulta
              </Label>
              <Textarea
                id="motivo"
                value={motivo}
                onChange={(e) => setMotivo(e.target.value)}
                className="bg-secondary border-border text-foreground min-h-[100px]"
                placeholder="Describe el motivo de la referencia..."
                required
              />
            </div>

            <div className="space-y-2">
              <Label className="text-foreground">Documentos Adjuntos</Label>
              <div className="flex gap-2">
                <Button type="button" variant="outline" className="gap-2 bg-transparent">
                  <Upload className="h-4 w-4" />
                  Subir Documentos
                </Button>
                <span className="text-sm text-muted-foreground self-center">0 archivos seleccionados</span>
              </div>
            </div>

            <div className="flex gap-2 justify-end">
              <Button type="button" variant="outline">
                Limpiar Formulario
              </Button>
              <Button type="submit" className="gap-2">
                <Send className="h-4 w-4" />
                Enviar Solicitud
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className="bg-card border-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-foreground">Solicitudes Enviadas</CardTitle>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Buscar..." className="pl-9 bg-secondary border-border w-64" />
              </div>
              <Button variant="outline" size="icon" className="bg-transparent">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-muted/50">
                <TableHead className="text-muted-foreground">ID</TableHead>
                <TableHead className="text-muted-foreground">Paciente</TableHead>
                <TableHead className="text-muted-foreground">Especialidad</TableHead>
                <TableHead className="text-muted-foreground">Prioridad</TableHead>
                <TableHead className="text-muted-foreground">Estado</TableHead>
                <TableHead className="text-muted-foreground">Fecha</TableHead>
                <TableHead className="text-muted-foreground">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {MOCK_REFERENCIAS.map((ref) => (
                <TableRow key={ref.id} className="border-border hover:bg-muted/50">
                  <TableCell className="font-mono text-sm text-foreground">{ref.id}</TableCell>
                  <TableCell className="font-medium text-foreground">{ref.paciente.nombre}</TableCell>
                  <TableCell className="text-muted-foreground">{ref.especialidad}</TableCell>
                  <TableCell>
                    <StatusBadge prioridad={ref.prioridad} />
                  </TableCell>
                  <TableCell>
                    <StatusBadge estado={ref.estado} />
                  </TableCell>
                  <TableCell className="text-muted-foreground">{ref.fechaCreacion.toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="outline" size="sm">
                        Ver
                      </Button>
                      <Button variant="outline" size="sm">
                        <Copy className="h-3 w-3" />
                      </Button>
                      {ref.estado === "pendiente" && (
                        <Button variant="outline" size="sm">
                          <X className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      </div>
    </AppLayoutInertia>
  )
}

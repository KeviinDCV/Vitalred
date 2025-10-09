import { useState, useEffect } from "react"
import { usePage } from '@inertiajs/react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { StatusBadge } from "@/components/status-badge"
import { MOCK_REFERENCIAS } from "@/lib/mock-data"
import { AlertCircle, Clock, Phone, Ambulance, ArrowUp } from "lucide-react"
import { cn } from "@/lib/utils"
import AppLayoutInertia from '@/layouts/app-layout-inertia'
import { type BreadcrumbItem } from '@/types'

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/medico/dashboard' },
    { title: 'Casos Críticos', href: '/medico/casos-criticos' },
]

export default function CasosCriticos() {
  const { auth } = usePage<{ auth: { user: { nombre: string, role: string } } }>().props
  const [tiempos, setTiempos] = useState<Record<string, number>>({})

  useEffect(() => {
    const interval = setInterval(() => {
      setTiempos((prev) => {
        const nuevo: Record<string, number> = {}
        MOCK_REFERENCIAS.forEach((ref) => {
          nuevo[ref.id] = (prev[ref.id] || 0) + 1
        })
        return nuevo
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const formatTiempo = (segundos: number) => {
    const horas = Math.floor(segundos / 3600)
    const minutos = Math.floor((segundos % 3600) / 60)
    const segs = segundos % 60
    return `${horas}h ${minutos}m ${segs}s`
  }

  const casosCriticos = MOCK_REFERENCIAS.filter((r) => r.prioridad === "critica" || r.prioridad === "urgente")

  return (
    <AppLayoutInertia 
      title="Casos Críticos - Vital Red" 
      breadcrumbs={breadcrumbs}
      user={auth.user}
    >
      <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Casos Críticos</h1>
          <p className="text-muted-foreground">Atención inmediata requerida</p>
        </div>
        <div className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-destructive animate-pulse" />
          <span className="text-lg font-bold text-destructive">{casosCriticos.length} casos urgentes</span>
        </div>
      </div>

      <div className="space-y-4">
        {casosCriticos.map((caso, index) => (
          <Card
            key={caso.id}
            className={cn(
              "bg-card border-border transition-all",
              caso.prioridad === "critica" && "border-destructive border-2 animate-pulse",
            )}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <CardTitle className="text-foreground">{caso.paciente.nombre}</CardTitle>
                    <StatusBadge prioridad={caso.prioridad} />
                    {index === 0 && (
                      <Badge className="bg-warning text-warning-foreground">
                        <Clock className="h-3 w-3 mr-1" />
                        Siguiente
                      </Badge>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">ID: </span>
                      <span className="font-mono text-foreground">{caso.id}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Edad: </span>
                      <span className="text-foreground">{caso.paciente.edad} años</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Género: </span>
                      <span className="text-foreground">{caso.paciente.genero}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">IPS: </span>
                      <span className="text-foreground">{caso.ipsOrigen}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-destructive">{formatTiempo(tiempos[caso.id] || 0)}</div>
                  <div className="text-xs text-muted-foreground">Tiempo transcurrido</div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3 bg-secondary rounded-lg">
                <p className="text-sm font-semibold text-foreground mb-1">Motivo de Consulta:</p>
                <p className="text-sm text-muted-foreground">{caso.motivo}</p>
                {caso.observaciones && (
                  <>
                    <p className="text-sm font-semibold text-foreground mt-2 mb-1">Observaciones:</p>
                    <p className="text-sm text-muted-foreground">{caso.observaciones}</p>
                  </>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Button className="bg-success hover:bg-success/90 gap-2">
                  <CheckCircle className="h-4 w-4" />
                  Atender Ahora
                </Button>
                <Button variant="outline" className="gap-2 bg-transparent">
                  <ArrowUp className="h-4 w-4" />
                  Derivar
                </Button>
                <Button variant="outline" className="gap-2 bg-transparent">
                  <Ambulance className="h-4 w-4" />
                  Solicitar Ambulancia
                </Button>
                <Button variant="outline" className="gap-2 bg-transparent">
                  <Phone className="h-4 w-4" />
                  Comunicar IPS
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {casosCriticos.length === 0 && (
        <Card className="bg-card border-border">
          <CardContent className="py-12 text-center">
            <CheckCircle className="h-12 w-12 text-success mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No hay casos críticos</h3>
            <p className="text-muted-foreground">Todos los casos urgentes han sido atendidos</p>
          </CardContent>
        </Card>
      )}
      </div>
    </AppLayoutInertia>
  )
}

function CheckCircle({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  )
}

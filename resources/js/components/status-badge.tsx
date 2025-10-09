import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { EstadoReferencia, PrioridadReferencia } from "@/lib/types"

interface StatusBadgeProps {
  estado?: EstadoReferencia
  prioridad?: PrioridadReferencia
  className?: string
}

export function StatusBadge({ estado, prioridad, className }: StatusBadgeProps) {
  if (estado) {
    const estadoConfig = {
      pendiente: { label: "Pendiente", className: "bg-warning text-warning-foreground" },
      aceptada: { label: "Aceptada", className: "bg-success text-success-foreground" },
      rechazada: { label: "Rechazada", className: "bg-destructive text-destructive-foreground" },
      en_proceso: { label: "En Proceso", className: "bg-primary text-primary-foreground" },
      completada: { label: "Completada", className: "bg-muted text-muted-foreground" },
    }

    const config = estadoConfig[estado]
    return <Badge className={cn(config.className, className)}>{config.label}</Badge>
  }

  if (prioridad) {
    const prioridadConfig = {
      critica: { label: "Crítica", className: "bg-destructive text-destructive-foreground animate-pulse" },
      urgente: { label: "Urgente", className: "bg-warning text-warning-foreground" },
      normal: { label: "Normal", className: "bg-muted text-muted-foreground" },
    }

    const config = prioridadConfig[prioridad]
    return <Badge className={cn(config.className, className)}>{config.label}</Badge>
  }

  return null
}

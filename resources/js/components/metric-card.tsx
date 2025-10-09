import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowUpIcon, ArrowDownIcon, MinusIcon, type LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface MetricCardProps {
  titulo: string
  valor: string | number
  cambio?: number
  tendencia?: "up" | "down" | "neutral"
  icono?: LucideIcon
  descripcion?: string
}

export function MetricCard({ titulo, valor, cambio, tendencia, icono: Icon, descripcion }: MetricCardProps) {
  return (
    <Card className="bg-card border-border">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{titulo}</CardTitle>
        {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-foreground">{valor}</div>
        {cambio !== undefined && (
          <div className="flex items-center gap-1 text-xs mt-1">
            {tendencia === "up" && <ArrowUpIcon className="h-3 w-3 text-success" />}
            {tendencia === "down" && <ArrowDownIcon className="h-3 w-3 text-destructive" />}
            {tendencia === "neutral" && <MinusIcon className="h-3 w-3 text-muted-foreground" />}
            <span
              className={cn(
                "font-medium",
                tendencia === "up" && "text-success",
                tendencia === "down" && "text-destructive",
                tendencia === "neutral" && "text-muted-foreground",
              )}
            >
              {cambio > 0 ? "+" : ""}
              {cambio}%
            </span>
            {descripcion && <span className="text-muted-foreground ml-1">{descripcion}</span>}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

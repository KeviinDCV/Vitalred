import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { MOCK_NOTIFICACIONES } from "@/lib/mock-data"
import { Bell, AlertCircle, Info, CheckCircle, Archive, Settings, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"
import AppLayoutInertia from "@/layouts/app-layout-inertia"
import { usePage } from "@inertiajs/react"
import { type SharedData } from "@/types"

export default function Notificaciones() {
  const { auth } = usePage<SharedData>().props
  const user = auth.user
  const [filtro, setFiltro] = useState<"todas" | "critica" | "importante" | "informativa">("todas")
  const [notificaciones, setNotificaciones] = useState(MOCK_NOTIFICACIONES)

  const notificacionesFiltradas = filtro === "todas" ? notificaciones : notificaciones.filter((n) => n.tipo === filtro)

  const noLeidas = notificaciones.filter((n) => !n.leida).length

  const marcarComoLeida = (id: string) => {
    setNotificaciones((prev) => prev.map((n) => (n.id === id ? { ...n, leida: true } : n)))
  }

  const marcarTodasLeidas = () => {
    setNotificaciones((prev) => prev.map((n) => ({ ...n, leida: true })))
  }

  return (
    <AppLayoutInertia title="Notificaciones" user={{ name: user.name as string, role: user.role as string }}>
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Notificaciones</h1>
          <p className="text-muted-foreground">
            {noLeidas > 0 ? `Tienes ${noLeidas} notificaciones sin leer` : "No tienes notificaciones sin leer"}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={marcarTodasLeidas} className="gap-2 bg-transparent">
            <CheckCircle className="h-4 w-4" />
            Marcar Todas Leídas
          </Button>
          <Button variant="outline" className="gap-2 bg-transparent">
            <Settings className="h-4 w-4" />
            Configurar
          </Button>
        </div>
      </div>

      <div className="flex gap-2">
        <Button
          variant={filtro === "todas" ? "default" : "outline"}
          onClick={() => setFiltro("todas")}
          className={filtro !== "todas" ? "bg-transparent" : ""}
        >
          Todas
        </Button>
        <Button
          variant={filtro === "critica" ? "default" : "outline"}
          onClick={() => setFiltro("critica")}
          className={filtro !== "critica" ? "bg-transparent" : ""}
        >
          Críticas
        </Button>
        <Button
          variant={filtro === "importante" ? "default" : "outline"}
          onClick={() => setFiltro("importante")}
          className={filtro !== "importante" ? "bg-transparent" : ""}
        >
          Importantes
        </Button>
        <Button
          variant={filtro === "informativa" ? "default" : "outline"}
          onClick={() => setFiltro("informativa")}
          className={filtro !== "informativa" ? "bg-transparent" : ""}
        >
          Informativas
        </Button>
      </div>

      <div className="space-y-3">
        {notificacionesFiltradas.map((notif) => (
          <Card
            key={notif.id}
            className={cn(
              "bg-card border-border transition-all",
              !notif.leida && "border-l-4 border-l-primary",
              notif.tipo === "critica" && !notif.leida && "border-l-destructive",
            )}
          >
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <div className="mt-1">
                  {notif.tipo === "critica" && (
                    <div className="p-2 bg-destructive/20 rounded-full">
                      <AlertCircle className="h-5 w-5 text-destructive" />
                    </div>
                  )}
                  {notif.tipo === "importante" && (
                    <div className="p-2 bg-warning/20 rounded-full">
                      <Bell className="h-5 w-5 text-warning" />
                    </div>
                  )}
                  {notif.tipo === "informativa" && (
                    <div className="p-2 bg-primary/20 rounded-full">
                      <Info className="h-5 w-5 text-primary" />
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-foreground">{notif.titulo}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{notif.mensaje}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        className={
                          notif.tipo === "critica"
                            ? "bg-destructive text-destructive-foreground"
                            : notif.tipo === "importante"
                              ? "bg-warning text-warning-foreground"
                              : "bg-primary text-primary-foreground"
                        }
                      >
                        {notif.tipo}
                      </Badge>
                      {!notif.leida && (
                        <div className="w-2 h-2 rounded-full bg-primary animate-pulse" title="No leída" />
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    <span className="text-xs text-muted-foreground">
                      {notif.fecha.toLocaleString("es-ES", {
                        day: "numeric",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                    <div className="flex gap-2">
                      {notif.accion && (
                        <Button variant="outline" size="sm">
                          {notif.accion.texto}
                        </Button>
                      )}
                      {!notif.leida && (
                        <Button variant="outline" size="sm" onClick={() => marcarComoLeida(notif.id)}>
                          Marcar Leída
                        </Button>
                      )}
                      <Button variant="outline" size="sm">
                        <Archive className="h-3 w-3" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {notificacionesFiltradas.length === 0 && (
        <Card className="bg-card border-border">
          <CardContent className="py-12 text-center">
            <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No hay notificaciones</h3>
            <p className="text-muted-foreground">No tienes notificaciones en esta categoría</p>
          </CardContent>
        </Card>
      )}

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Preferencias de Notificaciones</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="notif-email" className="text-foreground">
              Recibir notificaciones por email
            </Label>
            <Switch id="notif-email" defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="notif-push" className="text-foreground">
              Notificaciones push en el navegador
            </Label>
            <Switch id="notif-push" defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="notif-criticas" className="text-foreground">
              Alertas sonoras para notificaciones críticas
            </Label>
            <Switch id="notif-criticas" defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="notif-resumen" className="text-foreground">
              Resumen diario por email
            </Label>
            <Switch id="notif-resumen" />
          </div>
        </CardContent>
      </Card>
    </div>
    </AppLayoutInertia>
  )
}

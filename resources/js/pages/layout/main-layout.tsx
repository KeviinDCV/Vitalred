import type React from "react"
import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { Sidebar } from "./sidebar"
import { canAccessView, type ViewName } from "@/lib/permissions"
import { Badge } from "@/components/ui/badge"

// Admin views
import AdminDashboard from "@/pages/admin/admin-dashboard"
import { Referencias } from "@/pages/admin/referencias"
import { Reportes } from "@/pages/admin/reportes"
import { IA } from "@/pages/admin/ia"
import { Monitoreo } from "@/pages/admin/monitoreo"
import { Configuracion } from "@/pages/admin/configuracion"

// Médico views
import MedicoDashboard from "@/pages/medico/medico-dashboard"
import { CasosCriticos } from "@/pages/medico/casos-criticos"
import { Seguimiento } from "@/pages/medico/seguimiento"

// IPS views
import IPSDashboard from "@/pages/ips/ips-dashboard"
import { Solicitudes } from "@/pages/ips/solicitudes"
import { SeguimientoIPS } from "@/pages/ips/seguimiento-ips"

// Shared views
import { Notificaciones } from "@/pages/shared/notificaciones"
import { Perfil } from "@/pages/shared/perfil"

const VIEW_COMPONENTS: Record<ViewName, React.ComponentType> = {
  AdminDashboard,
  Referencias,
  Reportes,
  IA,
  Monitoreo,
  Configuracion,
  MedicoDashboard,
  CasosCriticos,
  Seguimiento,
  IPSDashboard,
  Solicitudes,
  SeguimientoIPS,
  Notificaciones,
  Perfil,
}

const DEFAULT_VIEWS: Record<string, ViewName> = {
  admin: "AdminDashboard",
  medico: "MedicoDashboard",
  ips: "IPSDashboard",
}

export function MainLayout() {
  const { user } = useAuth()
  const [currentView, setCurrentView] = useState<ViewName>(user ? DEFAULT_VIEWS[user.rol] || "Perfil" : "Perfil")

  if (!user) return null

  const handleViewChange = (view: ViewName) => {
    if (canAccessView(user.rol, view)) {
      setCurrentView(view)
    }
  }

  const ViewComponent = VIEW_COMPONENTS[currentView]

  return (
    <div className="flex h-screen bg-background">
      <Sidebar currentView={currentView} onViewChange={handleViewChange} />

      <main className="flex-1 md:ml-64 overflow-y-auto">
        <div className="container mx-auto p-6 md:p-8">
          {canAccessView(user.rol, currentView) ? (
            <ViewComponent />
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-foreground mb-2">Acceso Denegado</h2>
                <p className="text-muted-foreground">No tienes permisos para acceder a esta vista</p>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Notification badge (floating) */}
      <div className="fixed bottom-6 right-6 z-30">
        <button
          onClick={() => handleViewChange("Notificaciones")}
          className="relative p-3 bg-primary rounded-full shadow-lg hover:bg-primary/90 transition-colors"
        >
          <Bell className="h-6 w-6 text-primary-foreground" />
          <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-destructive text-destructive-foreground">
            3
          </Badge>
        </button>
      </div>
    </div>
  )
}

function Bell({ className }: { className?: string }) {
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
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
    </svg>
  )
}

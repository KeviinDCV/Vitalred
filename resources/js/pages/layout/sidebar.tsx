import type React from "react"
import { useState, useMemo } from "react"
import { useAuth } from "@/lib/auth-context"
import { getAvailableViews, type ViewName } from "@/lib/permissions"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  FileText,
  BarChart3,
  Brain,
  Activity,
  Settings,
  Stethoscope,
  AlertCircle,
  ClipboardList,
  Building,
  Send,
  Users,
  Bell,
  User,
  LogOut,
  Menu,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"

interface MenuItem {
  view: ViewName
  label: string
  icon: React.ComponentType<{ className?: string }>
  group: "Administrador" | "Médico" | "IPS" | "Compartidas"
}

const MENU_ITEMS: MenuItem[] = [
  // Admin
  { view: "AdminDashboard", label: "Panel Admin", icon: LayoutDashboard, group: "Administrador" },
  { view: "Referencias", label: "Referencias", icon: FileText, group: "Administrador" },
  { view: "Reportes", label: "Reportes", icon: BarChart3, group: "Administrador" },
  { view: "IA", label: "Inteligencia Artificial", icon: Brain, group: "Administrador" },
  { view: "Monitoreo", label: "Monitoreo", icon: Activity, group: "Administrador" },
  { view: "Configuracion", label: "Configuración", icon: Settings, group: "Administrador" },

  // Médico
  { view: "MedicoDashboard", label: "Panel Médico", icon: Stethoscope, group: "Médico" },
  { view: "CasosCriticos", label: "Casos Críticos", icon: AlertCircle, group: "Médico" },
  { view: "Seguimiento", label: "Seguimiento", icon: ClipboardList, group: "Médico" },

  // IPS
  { view: "IPSDashboard", label: "Panel IPS", icon: Building, group: "IPS" },
  { view: "Solicitudes", label: "Solicitudes", icon: Send, group: "IPS" },
  { view: "SeguimientoIPS", label: "Seguimiento IPS", icon: Users, group: "IPS" },

  // Compartidas
  { view: "Notificaciones", label: "Notificaciones", icon: Bell, group: "Compartidas" },
  { view: "Perfil", label: "Mi Perfil", icon: User, group: "Compartidas" },
]

interface SidebarProps {
  currentView: ViewName
  onViewChange: (view: ViewName) => void
}

export function Sidebar({ currentView, onViewChange }: SidebarProps) {
  const { user, logout } = useAuth()
  const [isOpen, setIsOpen] = useState(false)

  if (!user) return null

  const availableViews = getAvailableViews(user.rol)

  const groupedItems = useMemo(() => {
    const filtered = MENU_ITEMS.filter((item) => availableViews.includes(item.view))
    return filtered.reduce<Record<string, MenuItem[]>>((acc, item) => {
      if (!acc[item.group]) acc[item.group] = []
      acc[item.group].push(item)
      return acc
    }, {})
  }, [availableViews])

  const toggleSidebar = () => setIsOpen((prev) => !prev)

  const handleViewChange = (view: ViewName) => {
    onViewChange(view)
    setTimeout(() => setIsOpen(false), 150) // animación suave en móvil
  }

  return (
    <>
      {/* Mobile menu button */}
      <Button
        variant="outline"
        size="icon"
        className="fixed top-4 left-4 z-50 md:hidden bg-card border-border"
        onClick={toggleSidebar}
        aria-label="Abrir menú lateral"
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 md:hidden animate-fadeIn"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-50 h-screen w-64 bg-sidebar border-r border-sidebar-border shadow-lg transition-transform duration-300 ease-in-out",
          "md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-sidebar-border">
            <h2 className="text-xl font-bold text-sidebar-foreground">Sistema Médico</h2>
            <p className="text-sm text-sidebar-foreground/70 mt-1">{user.nombre}</p>
            <p className="text-xs text-sidebar-foreground/50 capitalize">{user.rol}</p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-6">
            {Object.entries(groupedItems).map(([group, items]) => (
              <div key={group}>
                <p className="text-xs uppercase font-semibold text-sidebar-foreground/50 mb-2 tracking-wide">
                  {group}
                </p>
                <ul className="space-y-1">
                  {items.map((item) => {
                    const Icon = item.icon
                    const isActive = currentView === item.view
                    return (
                      <li key={item.view}>
                        <button
                          onClick={() => handleViewChange(item.view)}
                          className={cn(
                            "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-150",
                            isActive
                              ? "bg-sidebar-primary text-sidebar-primary-foreground"
                              : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                          )}
                          aria-label={`Ir a ${item.label}`}
                        >
                          <Icon className="h-4 w-4" />
                          {item.label}
                        </button>
                      </li>
                    )
                  })}
                </ul>
              </div>
            ))}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-sidebar-border">
            <Button
              variant="outline"
              className="w-full justify-start gap-2 bg-transparent border-sidebar-border text-sidebar-foreground hover:bg-sidebar-accent"
              onClick={logout}
              aria-label="Cerrar sesión"
            >
              <LogOut className="h-4 w-4" />
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </aside>
    </>
  )
}

export default Sidebar

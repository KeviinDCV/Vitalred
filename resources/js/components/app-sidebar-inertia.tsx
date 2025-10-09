import { Link, usePage } from '@inertiajs/react'
import { cn } from '@/lib/utils'
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
} from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'

interface MenuItem {
  label: string
  icon: React.ComponentType<{ className?: string }>
  route: string
  group: string
}

interface MenuSection {
  title: string
  items: MenuItem[]
}

const ADMIN_MENU_SECTIONS: MenuSection[] = [
  {
    title: "Administración",
    items: [
      { label: "Panel Admin", icon: LayoutDashboard, route: "dashboard", group: "admin" },
      { label: "Usuarios", icon: Users, route: "admin.usuarios", group: "admin" },
      { label: "Referencias", icon: FileText, route: "admin.referencias", group: "admin" },
      { label: "Reportes", icon: BarChart3, route: "admin.reportes", group: "admin" },
      { label: "IA", icon: Brain, route: "admin.ia", group: "admin" },
      { label: "Monitoreo", icon: Activity, route: "admin.monitoreo", group: "admin" },
      { label: "Configuración", icon: Settings, route: "admin.configuracion", group: "admin" },
    ]
  },
  {
    title: "Área Médica",
    items: [
      { label: "Panel Médico", icon: Stethoscope, route: "admin.medico.dashboard", group: "medico" },
      { label: "Ingresar Registro", icon: FileText, route: "admin.medico.ingresar-registro", group: "medico" },
      { label: "Consulta Pacientes", icon: ClipboardList, route: "admin.medico.consulta-pacientes", group: "medico" },
      { label: "Casos Críticos", icon: AlertCircle, route: "admin.medico.casos-criticos", group: "medico" },
      { label: "Seguimiento", icon: ClipboardList, route: "admin.medico.seguimiento", group: "medico" },
    ]
  },
  {
    title: "IPS",
    items: [
      { label: "Panel IPS", icon: Building, route: "admin.ips.dashboard", group: "ips" },
      { label: "Solicitudes", icon: Send, route: "admin.ips.solicitudes", group: "ips" },
      { label: "Seguimiento IPS", icon: Users, route: "admin.ips.seguimiento", group: "ips" },
    ]
  },
  {
    title: "General",
    items: [
      { label: "Notificaciones", icon: Bell, route: "notificaciones", group: "shared" },
      { label: "Mi Perfil", icon: User, route: "perfil", group: "shared" },
    ]
  }
]

const MEDICO_MENU_SECTIONS: MenuSection[] = [
  {
    title: "Área Médica",
    items: [
      { label: "Panel Médico", icon: Stethoscope, route: "medico.dashboard", group: "medico" },
      { label: "Ingresar Registro", icon: FileText, route: "medico.ingresar-registro", group: "medico" },
      { label: "Consulta Pacientes", icon: ClipboardList, route: "medico.consulta-pacientes", group: "medico" },
      { label: "Casos Críticos", icon: AlertCircle, route: "medico.casos-criticos", group: "medico" },
      { label: "Seguimiento", icon: ClipboardList, route: "medico.seguimiento", group: "medico" },
    ]
  },
  {
    title: "General",
    items: [
      { label: "Notificaciones", icon: Bell, route: "notificaciones", group: "shared" },
      { label: "Mi Perfil", icon: User, route: "perfil", group: "shared" },
    ]
  }
]

const IPS_MENU_SECTIONS: MenuSection[] = [
  {
    title: "IPS",
    items: [
      { label: "Panel IPS", icon: Building, route: "ips.dashboard", group: "ips" },
      { label: "Solicitudes", icon: Send, route: "ips.solicitudes", group: "ips" },
      { label: "Seguimiento IPS", icon: Users, route: "ips.seguimiento", group: "ips" },
    ]
  },
  {
    title: "General",
    items: [
      { label: "Notificaciones", icon: Bell, route: "notificaciones", group: "shared" },
      { label: "Mi Perfil", icon: User, route: "perfil", group: "shared" },
    ]
  }
]

interface AppSidebarProps {
  user: {
    nombre: string
    role: string
  }
}

export function AppSidebarInertia({ user }: AppSidebarProps) {
  const [isOpen, setIsOpen] = useState(false)
  const { url } = usePage()

  const getMenuSections = () => {
    switch (user.role) {
      case 'administrador':
        return ADMIN_MENU_SECTIONS
      case 'medico':
        return MEDICO_MENU_SECTIONS
      case 'ips':
        return IPS_MENU_SECTIONS
      default:
        return []
    }
  }

  const menuSections = getMenuSections()
  const toggleSidebar = () => setIsOpen(!isOpen)

  const isActiveRoute = (routeName: string) => {
    try {
      return url === route(routeName)
    } catch {
      return false
    }
  }

  return (
    <>
      {/* Mobile menu button */}
      <Button
        variant="outline"
        size="icon"
        className="fixed top-4 left-4 z-50 md:hidden bg-card border-border"
        onClick={toggleSidebar}
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 md:hidden" 
          onClick={toggleSidebar} 
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 h-screen w-64 bg-sidebar border-r border-sidebar-border transition-transform duration-300",
          "md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-sidebar-border">
            <h2 className="text-xl font-bold text-sidebar-foreground">Vital Red</h2>
            <p className="text-sm text-sidebar-foreground/70 mt-1">{user.nombre}</p>
            <p className="text-xs text-sidebar-foreground/50 capitalize">{user.role}</p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-6">
            {menuSections.map((section) => (
              <div key={section.title}>
                <h3 className="text-xs font-semibold text-sidebar-foreground/60 uppercase tracking-wider mb-2 px-3">
                  {section.title}
                </h3>
                <ul className="space-y-1">
                  {section.items.map((item) => {
                    const Icon = item.icon
                    const isActive = isActiveRoute(item.route)
                    return (
                      <li key={item.route}>
                        <Link
                          href={route(item.route)}
                          onClick={() => setIsOpen(false)}
                          className={cn(
                            "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                            isActive
                              ? "bg-sidebar-primary text-sidebar-primary-foreground"
                              : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                          )}
                        >
                          <Icon className="h-4 w-4" />
                          {item.label}
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              </div>
            ))}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-sidebar-border">
            <Link
              href={route('logout')}
              method="post"
              as="button"
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium bg-transparent border border-sidebar-border text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Cerrar Sesión
            </Link>
          </div>
        </div>
      </aside>
    </>
  )
}
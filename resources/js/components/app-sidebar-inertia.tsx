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
import React, { useState } from 'react'
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

const MENU_CONFIG = {
  administrador: [
    {
      title: "Admin",
      items: [
        { label: "Dashboard", icon: LayoutDashboard, route: "dashboard" },
        { label: "Usuarios", icon: Users, route: "admin.usuarios" },
        { label: "Referencias", icon: FileText, route: "admin.referencias" },
        { label: "Reportes", icon: BarChart3, route: "admin.reportes" },
        { label: "IA", icon: Brain, route: "admin.ia" },
        { label: "Monitoreo", icon: Activity, route: "admin.monitoreo" },
        { label: "Config", icon: Settings, route: "admin.configuracion" },
      ]
    },
    {
      title: "Médico",
      items: [
        { label: "Panel", icon: Stethoscope, route: "admin.medico.dashboard" },
        { label: "Registro", icon: FileText, route: "admin.medico.ingresar-registro" },
        { label: "Pacientes", icon: ClipboardList, route: "admin.medico.consulta-pacientes" },
        { label: "Críticos", icon: AlertCircle, route: "admin.medico.casos-criticos" },
        { label: "Seguimiento", icon: Activity, route: "admin.medico.seguimiento" },
      ]
    },
    {
      title: "IPS",
      items: [
        { label: "Panel", icon: Building, route: "admin.ips.dashboard" },
        { label: "Registro", icon: FileText, route: "admin.ips.ingresar-registro" },
        { label: "Solicitudes", icon: Send, route: "admin.ips.solicitudes" },
        { label: "Análisis", icon: Activity, route: "admin.ips.seguimiento" },
      ]
    }
  ],
  medico: [
    {
      title: "Médico",
      items: [
        { label: "Dashboard", icon: Stethoscope, route: "medico.dashboard" },
        { label: "Registro", icon: FileText, route: "medico.ingresar-registro" },
        { label: "Pacientes", icon: ClipboardList, route: "medico.consulta-pacientes" },
        { label: "Críticos", icon: AlertCircle, route: "medico.casos-criticos" },
        { label: "Seguimiento", icon: Activity, route: "medico.seguimiento" },
      ]
    }
  ],
  ips: [
    {
      title: "IPS",
      items: [
        { label: "Dashboard", icon: Building, route: "ips.dashboard" },
        { label: "Registro", icon: FileText, route: "ips.ingresar-registro" },
        { label: "Solicitudes", icon: Send, route: "ips.solicitudes" },
        { label: "Análisis", icon: Activity, route: "ips.seguimiento" },
      ]
    }
  ]
} as const

interface AppSidebarProps {
  user: {
    name: string
    role: string
  }
}

export const AppSidebarInertia = React.memo(({ user }: AppSidebarProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const { url } = usePage()

  const menuSections = MENU_CONFIG[user.role as keyof typeof MENU_CONFIG] || []

  const isActiveRoute = (routeName: string) => {
    try {
      return url === route(routeName)
    } catch {
      return false
    }
  }

  const toggleSidebar = () => setIsOpen(!isOpen)

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
          "fixed left-0 top-0 z-40 h-screen w-[276px] bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 border-r border-slate-700/50 backdrop-blur-xl transition-all duration-300 ease-out",
          "md:translate-x-0 shadow-2xl shadow-slate-900/20",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full relative">
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-transparent to-purple-600/5 pointer-events-none" />
          
          <div className="relative p-3 border-b border-slate-700/50">
            <div className="flex items-center gap-2 mb-1.5">
              <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <Activity className="h-3 w-3 text-white" />
              </div>
              <h2 className="text-base font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                Vital Red
              </h2>
            </div>
            <div className="flex items-center gap-2 px-2 py-1 rounded-lg bg-slate-800/50 border border-slate-700/30">
              <div className="w-5 h-5 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center">
                <span className="text-xs font-bold text-white">{user.name?.charAt(0) || 'U'}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-white truncate">{user.name}</p>
                <p className="text-xs text-slate-400 capitalize">{user.role}</p>
              </div>
            </div>
          </div>

          <nav className="flex-1 overflow-y-auto p-2 space-y-2 relative">
            {menuSections.map((section, sectionIndex) => (
              <div key={section.title} className="relative">
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1 px-2 flex items-center gap-2">
                  <div className="w-1 h-1 rounded-full bg-gradient-to-r from-blue-400 to-purple-400" />
                  {section.title}
                </h3>
                <ul className="space-y-0.5">
                  {section.items.map((item, itemIndex) => {
                    const Icon = item.icon
                    const isActive = isActiveRoute(item.route)
                    return (
                      <li key={item.route} className="relative">
                        <Link
                          href={route(item.route)}
                          onClick={() => setIsOpen(false)}
                          className={cn(
                            "group relative w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-base font-medium transition-all duration-200 ease-out",
                            "hover:scale-[1.01] hover:shadow-md",
                            isActive
                              ? "bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-white border border-blue-400/30 shadow-lg shadow-blue-500/10"
                              : "text-slate-300 hover:bg-slate-800/50 hover:text-white hover:border-slate-600/30 border border-transparent"
                          )}
                        >
                          {isActive && (
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl animate-pulse" />
                          )}
                          <div className={cn(
                            "relative p-1 rounded-md transition-all duration-200",
                            isActive 
                              ? "bg-gradient-to-br from-blue-500 to-purple-600 shadow-md shadow-blue-500/20" 
                              : "bg-slate-700/50 group-hover:bg-slate-600/50"
                          )}>
                            <Icon className="h-3.5 w-3.5 text-white" />
                          </div>
                          <span className="relative truncate">{item.label}</span>
                          {isActive && (
                            <div className="absolute right-2 w-1.5 h-1.5 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 animate-pulse" />
                          )}
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              </div>
            ))}
          </nav>

          <div className="relative p-2 border-t border-slate-700/50">
            <div className="flex gap-1">
              <Link
                href={route('perfil')}
                className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 rounded-md text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800/50 transition-all duration-200 border border-transparent hover:border-slate-600/30"
              >
                <User className="h-3 w-3" />
                Perfil
              </Link>
              <Link
                href={route('logout')}
                method="post"
                as="button"
                className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 rounded-md text-xs font-medium text-slate-300 hover:text-red-300 hover:bg-red-900/20 transition-all duration-200 border border-transparent hover:border-red-500/30"
              >
                <LogOut className="h-3 w-3" />
                Salir
              </Link>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
})
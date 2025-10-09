import type { UserRole } from "./types"

export type ViewName =
  | "AdminDashboard"
  | "Referencias"
  | "Reportes"
  | "IA"
  | "Monitoreo"
  | "Configuracion"
  | "MedicoDashboard"
  | "CasosCriticos"
  | "Seguimiento"
  | "IPSDashboard"
  | "Solicitudes"
  | "SeguimientoIPS"
  | "Notificaciones"
  | "Perfil"

export const PERMISSIONS: Record<UserRole, ViewName[]> = {
  administrador: [
    // Vistas de administrador
    "AdminDashboard", "Referencias", "Reportes", "IA", "Monitoreo", "Configuracion",
    // Vistas de médico (admin tiene acceso completo)
    "MedicoDashboard", "CasosCriticos", "Seguimiento",
    // Vistas de IPS (admin tiene acceso completo)
    "IPSDashboard", "Solicitudes", "SeguimientoIPS",
    // Vistas compartidas
    "Notificaciones", "Perfil"
  ],
  medico: ["MedicoDashboard", "CasosCriticos", "Seguimiento", "Notificaciones", "Perfil"],
  ips: ["IPSDashboard", "Solicitudes", "SeguimientoIPS", "Notificaciones", "Perfil"],
}

export function canAccessView(role: UserRole, view: ViewName): boolean {
  return PERMISSIONS[role].includes(view)
}

export function getAvailableViews(role: UserRole): ViewName[] {
  return PERMISSIONS[role]
}

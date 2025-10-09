export type UserRole = "administrador" | "medico" | "ips"

export interface User {
  id: string
  nombre: string
  email: string
  rol: UserRole
  telefono?: string
  especialidad?: string
  institucion?: string
  avatar?: string
  activo: boolean
  ultimaConexion?: Date
}

export type EstadoReferencia = "pendiente" | "aceptada" | "rechazada" | "en_proceso" | "completada"
export type PrioridadReferencia = "critica" | "urgente" | "normal"

export interface Referencia {
  id: string
  paciente: {
    nombre: string
    identificacion: string
    edad: number
    genero: string
  }
  ipsOrigen: string
  medicoAsignado?: string
  especialidad: string
  motivo: string
  estado: EstadoReferencia
  prioridad: PrioridadReferencia
  fechaCreacion: Date
  fechaRespuesta?: Date
  observaciones?: string
  documentos?: string[]
}

export interface Notificacion {
  id: string
  tipo: "critica" | "importante" | "informativa"
  titulo: string
  mensaje: string
  fecha: Date
  leida: boolean
  usuarioId: string
  accion?: {
    texto: string
    url: string
  }
}

export interface Metrica {
  label: string
  valor: number | string
  cambio?: number
  tendencia?: "up" | "down" | "neutral"
}

export interface ChartData {
  fecha: string
  [key: string]: string | number
}

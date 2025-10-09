import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { User } from "./types"

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Usuario de prueba para desarrollo
const MOCK_USERS: Record<string, User> = {
  "admin@hospital.com": {
    id: "1",
    nombre: "Dr. Admin Sistema",
    email: "admin@hospital.com",
    rol: "administrador",
    activo: true,
  },
  "medico@hospital.com": {
    id: "2",
    nombre: "Dr. Juan Pérez",
    email: "medico@hospital.com",
    rol: "medico",
    especialidad: "Cardiología",
    activo: true,
  },
  "ips@hospital.com": {
    id: "3",
    nombre: "IPS Central",
    email: "ips@hospital.com",
    rol: "ips",
    institucion: "IPS Central",
    activo: true,
  },
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Verificar si hay usuario guardado
    const savedUser = localStorage.getItem("user")
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    // Simulación de login
    const user = MOCK_USERS[email]
    if (user) {
      setUser(user)
      localStorage.setItem("user", JSON.stringify(user))
    } else {
      throw new Error("Credenciales inválidas")
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
  }

  return <AuthContext.Provider value={{ user, login, logout, isLoading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth debe usarse dentro de AuthProvider")
  }
  return context
}

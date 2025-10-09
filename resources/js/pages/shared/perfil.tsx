import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "@/lib/auth-context"
import { User, Mail, Phone, Building, Shield, Eye, Download, Save } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export function Perfil() {
  const { user } = useAuth()
  const [nombre, setNombre] = useState(user?.nombre || "")
  const [email, setEmail] = useState(user?.email || "")
  const [telefono, setTelefono] = useState(user?.telefono || "")
  const [tema, setTema] = useState("dark")

  if (!user) return null

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Mi Perfil</h1>
        <p className="text-muted-foreground">Administra tu información personal y preferencias</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="bg-card border-border md:col-span-2">
          <CardHeader>
            <CardTitle className="text-foreground">Información Personal</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center">
                <User className="h-10 w-10 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">{user.nombre}</h3>
                <Badge className="bg-primary text-primary-foreground capitalize">{user.rol}</Badge>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="nombre" className="text-foreground">
                Nombre completo
              </Label>
              <Input
                id="nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="bg-secondary border-border"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground">
                Correo electrónico
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-9 bg-secondary border-border"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="telefono" className="text-foreground">
                Teléfono
              </Label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="telefono"
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                  className="pl-9 bg-secondary border-border"
                />
              </div>
            </div>

            {user.especialidad && (
              <div className="space-y-2">
                <Label className="text-foreground">Especialidad</Label>
                <Input value={user.especialidad} disabled className="bg-secondary border-border" />
              </div>
            )}

            {user.institucion && (
              <div className="space-y-2">
                <Label className="text-foreground">Institución</Label>
                <div className="relative">
                  <Building className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input value={user.institucion} disabled className="pl-9 bg-secondary border-border" />
                </div>
              </div>
            )}

            <div className="flex gap-2 pt-4">
              <Button className="gap-2">
                <Save className="h-4 w-4" />
                Guardar Cambios
              </Button>
              <Button variant="outline">Cancelar</Button>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Estadísticas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between p-3 bg-secondary rounded-lg">
                <span className="text-sm text-muted-foreground">Sesiones activas</span>
                <span className="text-sm font-bold text-foreground">1</span>
              </div>
              <div className="flex justify-between p-3 bg-secondary rounded-lg">
                <span className="text-sm text-muted-foreground">Última conexión</span>
                <span className="text-sm font-bold text-foreground">Ahora</span>
              </div>
              <div className="flex justify-between p-3 bg-secondary rounded-lg">
                <span className="text-sm text-muted-foreground">Cuenta creada</span>
                <span className="text-sm font-bold text-foreground">Ene 2024</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Acciones Rápidas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start gap-2 bg-transparent">
                <Shield className="h-4 w-4" />
                Cambiar Contraseña
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2 bg-transparent">
                <Eye className="h-4 w-4" />
                Ver Sesiones Activas
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2 bg-transparent">
                <Download className="h-4 w-4" />
                Exportar Mis Datos
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Preferencias de Interfaz</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="tema" className="text-foreground">
                Tema de la aplicación
              </Label>
              <Select value={tema} onValueChange={setTema}>
                <SelectTrigger className="bg-secondary border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  <SelectItem value="light">Claro</SelectItem>
                  <SelectItem value="dark">Oscuro</SelectItem>
                  <SelectItem value="auto">Automático</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="idioma" className="text-foreground">
                Idioma
              </Label>
              <Select defaultValue="es">
                <SelectTrigger className="bg-secondary border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  <SelectItem value="es">Español</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="animaciones" className="text-foreground">
              Habilitar animaciones
            </Label>
            <Switch id="animaciones" defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="densidad" className="text-foreground">
              Modo compacto
            </Label>
            <Switch id="densidad" />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="sonidos" className="text-foreground">
              Sonidos de notificación
            </Label>
            <Switch id="sonidos" defaultChecked />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Seguridad</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-foreground">Autenticación de dos factores</Label>
              <p className="text-sm text-muted-foreground">Agrega una capa extra de seguridad</p>
            </div>
            <Switch id="2fa" />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-foreground">Cerrar sesión automáticamente</Label>
              <p className="text-sm text-muted-foreground">Después de 30 minutos de inactividad</p>
            </div>
            <Switch id="auto-logout" defaultChecked />
          </div>

          <Button variant="outline" className="w-full bg-transparent">
            Ver Historial de Actividad
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

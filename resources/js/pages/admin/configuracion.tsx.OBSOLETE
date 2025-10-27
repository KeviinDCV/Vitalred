import { useState } from 'react'
import { usePage } from '@inertiajs/react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import AppLayoutInertia from '@/layouts/app-layout-inertia'
import { type BreadcrumbItem } from '@/types'
import { 
    Settings, 
    Save, 
    RefreshCw, 
    Shield, 
    Mail, 
    Database, 
    Server, 
    Bell,
    Key,
    Globe,
    Clock,
    HardDrive,
    CheckCircle,
    AlertTriangle
} from 'lucide-react'

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Configuración', href: '/admin/configuracion' },
]

const systemStatus = {
    database: { status: 'connected', lastBackup: '2024-10-31 02:00:00' },
    email: { status: 'configured', lastTest: '2024-10-30 14:30:00' },
    storage: { status: 'healthy', usage: '2.4 GB / 10 GB' },
    security: { status: 'active', lastUpdate: '2024-10-29 10:15:00' }
}

export default function Configuracion() {
    const { auth } = usePage<{ auth: { user: { nombre: string, role: string } } }>().props
    const [isSaving, setIsSaving] = useState(false)
    const [showSuccess, setShowSuccess] = useState(false)

    const handleSave = () => {
        setIsSaving(true)
        setTimeout(() => {
            setIsSaving(false)
            setShowSuccess(true)
            setTimeout(() => setShowSuccess(false), 3000)
        }, 1500)
    }

    return (
        <AppLayoutInertia 
            title="Configuración - HERMES" 
            breadcrumbs={breadcrumbs}
            user={{ name: auth.user.nombre, role: auth.user.role }}
        >
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">Configuración del Sistema</h1>
                        <p className="text-muted-foreground">Administra la configuración general del sistema</p>
                    </div>
                    <Button onClick={handleSave} disabled={isSaving}>
                        {isSaving ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                Guardando...
                            </>
                        ) : (
                            <>
                                <Save className="w-4 h-4 mr-2" />
                                Guardar Cambios
                            </>
                        )}
                    </Button>
                </div>

                {showSuccess && (
                    <Alert className="border-green-200 bg-green-50">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <AlertDescription className="text-green-800">
                            Configuración guardada exitosamente
                        </AlertDescription>
                    </Alert>
                )}

                {/* Estado del sistema */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Base de Datos</p>
                                    <p className="text-sm">Último backup: {systemStatus.database.lastBackup}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Database className="h-5 w-5 text-blue-600" />
                                    <Badge variant="default">Conectada</Badge>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Email</p>
                                    <p className="text-sm">Última prueba: {systemStatus.email.lastTest}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Mail className="h-5 w-5 text-green-600" />
                                    <Badge variant="default">Configurado</Badge>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Almacenamiento</p>
                                    <p className="text-sm">Uso: {systemStatus.storage.usage}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <HardDrive className="h-5 w-5 text-purple-600" />
                                    <Badge variant="default">Saludable</Badge>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Seguridad</p>
                                    <p className="text-sm">Última actualización: {systemStatus.security.lastUpdate}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Shield className="h-5 w-5 text-red-600" />
                                    <Badge variant="default">Activa</Badge>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Tabs defaultValue="general" className="space-y-4">
                    <TabsList>
                        <TabsTrigger value="general">General</TabsTrigger>
                        <TabsTrigger value="security">Seguridad</TabsTrigger>
                        <TabsTrigger value="notifications">Notificaciones</TabsTrigger>
                        <TabsTrigger value="integrations">Integraciones</TabsTrigger>
                        <TabsTrigger value="maintenance">Mantenimiento</TabsTrigger>
                    </TabsList>

                    <TabsContent value="general" className="space-y-4">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Configuración General</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="app-name">Nombre de la Aplicación</Label>
                                        <Input id="app-name" defaultValue="HERMES" />
                                    </div>
                                    
                                    <div className="space-y-2">
                                        <Label htmlFor="app-url">URL de la Aplicación</Label>
                                        <Input id="app-url" defaultValue="https://hermes.com" />
                                    </div>
                                    
                                    <div className="space-y-2">
                                        <Label htmlFor="timezone">Zona Horaria</Label>
                                        <Select defaultValue="america/bogota">
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="america/bogota">América/Bogotá</SelectItem>
                                                <SelectItem value="america/lima">América/Lima</SelectItem>
                                                <SelectItem value="america/caracas">América/Caracas</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    
                                    <div className="space-y-2">
                                        <Label htmlFor="language">Idioma por Defecto</Label>
                                        <Select defaultValue="es">
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="es">Español</SelectItem>
                                                <SelectItem value="en">English</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Configuración de Sesión</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="session-timeout">Tiempo de Sesión (minutos)</Label>
                                        <Input id="session-timeout" type="number" defaultValue="120" />
                                    </div>
                                    
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-medium">Recordar Sesión</p>
                                            <p className="text-sm text-muted-foreground">Permitir sesiones persistentes</p>
                                        </div>
                                        <Switch defaultChecked />
                                    </div>
                                    
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-medium">Sesión Única</p>
                                            <p className="text-sm text-muted-foreground">Un usuario, una sesión activa</p>
                                        </div>
                                        <Switch />
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    <TabsContent value="security" className="space-y-4">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Políticas de Seguridad</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-medium">Autenticación de Dos Factores</p>
                                            <p className="text-sm text-muted-foreground">Requerir 2FA para todos los usuarios</p>
                                        </div>
                                        <Switch />
                                    </div>
                                    
                                    <div className="space-y-2">
                                        <Label htmlFor="password-policy">Política de Contraseñas</Label>
                                        <Select defaultValue="medium">
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="low">Básica (6 caracteres)</SelectItem>
                                                <SelectItem value="medium">Media (8 caracteres, mayúsculas)</SelectItem>
                                                <SelectItem value="high">Alta (12 caracteres, símbolos)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    
                                    <div className="space-y-2">
                                        <Label htmlFor="max-attempts">Máximos Intentos de Login</Label>
                                        <Input id="max-attempts" type="number" defaultValue="5" />
                                    </div>
                                    
                                    <div className="space-y-2">
                                        <Label htmlFor="lockout-time">Tiempo de Bloqueo (minutos)</Label>
                                        <Input id="lockout-time" type="number" defaultValue="15" />
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Configuración de Logs</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-medium">Logs de Auditoría</p>
                                            <p className="text-sm text-muted-foreground">Registrar todas las acciones</p>
                                        </div>
                                        <Switch defaultChecked />
                                    </div>
                                    
                                    <div className="space-y-2">
                                        <Label htmlFor="log-retention">Retención de Logs (días)</Label>
                                        <Input id="log-retention" type="number" defaultValue="90" />
                                    </div>
                                    
                                    <div className="space-y-2">
                                        <Label htmlFor="log-level">Nivel de Log</Label>
                                        <Select defaultValue="info">
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="debug">Debug</SelectItem>
                                                <SelectItem value="info">Info</SelectItem>
                                                <SelectItem value="warning">Warning</SelectItem>
                                                <SelectItem value="error">Error</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    <TabsContent value="notifications" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Configuración de Notificaciones</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <h4 className="font-medium">Notificaciones del Sistema</h4>
                                        
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="font-medium">Casos Críticos</p>
                                                <p className="text-sm text-muted-foreground">Alertas de casos urgentes</p>
                                            </div>
                                            <Switch defaultChecked />
                                        </div>
                                        
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="font-medium">Errores del Sistema</p>
                                                <p className="text-sm text-muted-foreground">Notificar fallos críticos</p>
                                            </div>
                                            <Switch defaultChecked />
                                        </div>
                                        
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="font-medium">Reportes Programados</p>
                                                <p className="text-sm text-muted-foreground">Envío automático de reportes</p>
                                            </div>
                                            <Switch />
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-4">
                                        <h4 className="font-medium">Configuración de Email</h4>
                                        
                                        <div className="space-y-2">
                                            <Label htmlFor="smtp-host">Servidor SMTP</Label>
                                            <Input id="smtp-host" defaultValue="smtp.gmail.com" />
                                        </div>
                                        
                                        <div className="space-y-2">
                                            <Label htmlFor="smtp-port">Puerto SMTP</Label>
                                            <Input id="smtp-port" type="number" defaultValue="587" />
                                        </div>
                                        
                                        <div className="space-y-2">
                                            <Label htmlFor="from-email">Email Remitente</Label>
                                            <Input id="from-email" type="email" defaultValue="noreply@hermes.com" />
                                        </div>
                                        
                                        <Button variant="outline" className="w-full">
                                            <Mail className="w-4 h-4 mr-2" />
                                            Probar Configuración
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="integrations" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Integraciones Externas</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <h4 className="font-medium">APIs de Terceros</h4>
                                        
                                        <div className="space-y-2">
                                            <Label htmlFor="gemini-key">Google Gemini API Key</Label>
                                            <Input id="gemini-key" type="password" placeholder="Ingrese API Key" />
                                        </div>
                                        
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="font-medium">Habilitar Gemini IA</p>
                                                <p className="text-sm text-muted-foreground">Procesamiento de documentos</p>
                                            </div>
                                            <Switch defaultChecked />
                                        </div>
                                        
                                        <Button variant="outline" className="w-full">
                                            <Key className="w-4 h-4 mr-2" />
                                            Probar Conexión
                                        </Button>
                                    </div>
                                    
                                    <div className="space-y-4">
                                        <h4 className="font-medium">Servicios Web</h4>
                                        
                                        <div className="space-y-2">
                                            <Label htmlFor="webhook-url">Webhook URL</Label>
                                            <Input id="webhook-url" placeholder="https://api.ejemplo.com/webhook" />
                                        </div>
                                        
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="font-medium">Webhooks Activos</p>
                                                <p className="text-sm text-muted-foreground">Notificaciones externas</p>
                                            </div>
                                            <Switch />
                                        </div>
                                        
                                        <Button variant="outline" className="w-full">
                                            <Globe className="w-4 h-4 mr-2" />
                                            Probar Webhook
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="maintenance" className="space-y-4">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Mantenimiento del Sistema</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="backup-frequency">Frecuencia de Backup</Label>
                                        <Select defaultValue="daily">
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="hourly">Cada hora</SelectItem>
                                                <SelectItem value="daily">Diario</SelectItem>
                                                <SelectItem value="weekly">Semanal</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    
                                    <div className="space-y-2">
                                        <Label htmlFor="backup-retention">Retención de Backups (días)</Label>
                                        <Input id="backup-retention" type="number" defaultValue="30" />
                                    </div>
                                    
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-medium">Modo Mantenimiento</p>
                                            <p className="text-sm text-muted-foreground">Deshabilitar acceso temporal</p>
                                        </div>
                                        <Switch />
                                    </div>
                                    
                                    <Button variant="outline" className="w-full">
                                        <RefreshCw className="w-4 h-4 mr-2" />
                                        Ejecutar Backup Manual
                                    </Button>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Limpieza de Datos</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="temp-files">Archivos Temporales (días)</Label>
                                        <Input id="temp-files" type="number" defaultValue="7" />
                                    </div>
                                    
                                    <div className="space-y-2">
                                        <Label htmlFor="old-logs">Logs Antiguos (días)</Label>
                                        <Input id="old-logs" type="number" defaultValue="90" />
                                    </div>
                                    
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-medium">Limpieza Automática</p>
                                            <p className="text-sm text-muted-foreground">Ejecutar limpieza programada</p>
                                        </div>
                                        <Switch defaultChecked />
                                    </div>
                                    
                                    <Alert>
                                        <AlertTriangle className="h-4 w-4" />
                                        <AlertDescription>
                                            La limpieza manual eliminará datos permanentemente
                                        </AlertDescription>
                                    </Alert>
                                    
                                    <Button variant="destructive" className="w-full">
                                        <RefreshCw className="w-4 h-4 mr-2" />
                                        Ejecutar Limpieza
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </AppLayoutInertia>
    )
}
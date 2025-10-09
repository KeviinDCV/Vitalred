import { useState } from 'react'
import { usePage } from '@inertiajs/react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription } from '@/components/ui/alert'
import AppLayoutInertia from '@/layouts/app-layout-inertia'
import { type BreadcrumbItem } from '@/types'
import { 
    Brain, 
    Zap, 
    Settings, 
    Activity, 
    FileText, 
    TrendingUp, 
    AlertCircle,
    CheckCircle,
    Play,
    Pause,
    RotateCcw,
    Database,
    Cpu,
    Clock
} from 'lucide-react'

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Inteligencia Artificial', href: '/admin/ia' },
]

const aiServices = [
    {
        id: 'gemini',
        name: 'Google Gemini',
        description: 'Extracción de datos de documentos médicos',
        status: 'active',
        usage: 85,
        requests: 1247,
        accuracy: 94.2,
        lastUsed: '2 min ago'
    },
    {
        id: 'prioritization',
        name: 'Algoritmo de Priorización',
        description: 'Clasificación automática de casos médicos',
        status: 'active',
        usage: 67,
        requests: 892,
        accuracy: 91.8,
        lastUsed: '5 min ago'
    },
    {
        id: 'nlp',
        name: 'Procesamiento de Lenguaje Natural',
        description: 'Análisis de texto en historias clínicas',
        status: 'maintenance',
        usage: 0,
        requests: 0,
        accuracy: 88.5,
        lastUsed: '2 hours ago'
    },
    {
        id: 'prediction',
        name: 'Predicción de Riesgos',
        description: 'Predicción de complicaciones médicas',
        status: 'inactive',
        usage: 0,
        requests: 0,
        accuracy: 86.3,
        lastUsed: '1 day ago'
    }
]

const modelMetrics = [
    { name: 'Precisión General', value: 92.4, trend: '+2.1%' },
    { name: 'Tiempo de Respuesta', value: 1.2, unit: 's', trend: '-0.3s' },
    { name: 'Solicitudes/Hora', value: 156, trend: '+12%' },
    { name: 'Disponibilidad', value: 99.8, unit: '%', trend: '+0.1%' }
]

const recentAnalysis = [
    { id: 1, type: 'Extracción', document: 'Historia_Clinica_001.pdf', confidence: 96, time: '2 min ago', status: 'completed' },
    { id: 2, type: 'Priorización', document: 'Caso_Urgente_045.pdf', confidence: 89, time: '5 min ago', status: 'completed' },
    { id: 3, type: 'Análisis NLP', document: 'Consulta_Medica_123.txt', confidence: 92, time: '8 min ago', status: 'processing' },
    { id: 4, type: 'Predicción', document: 'Paciente_Cronico_067.pdf', confidence: 87, time: '12 min ago', status: 'completed' }
]

export default function IA() {
    const { auth } = usePage<{ auth: { user: { nombre: string, role: string } } }>().props
    const [testInput, setTestInput] = useState('')
    const [testResult, setTestResult] = useState('')
    const [isProcessing, setIsProcessing] = useState(false)

    const runTest = () => {
        setIsProcessing(true)
        setTimeout(() => {
            setTestResult(`Análisis completado:\n\nTexto procesado: "${testInput}"\n\nResultados:\n- Entidades médicas detectadas: 3\n- Nivel de urgencia: Medio\n- Confianza: 89.2%\n- Tiempo de procesamiento: 1.4s`)
            setIsProcessing(false)
        }, 2000)
    }

    return (
        <AppLayoutInertia 
            title="Inteligencia Artificial - Vital Red" 
            breadcrumbs={breadcrumbs}
            user={auth.user}
        >
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Inteligencia Artificial</h1>
                    <p className="text-muted-foreground">Gestión y monitoreo de servicios de IA del sistema</p>
                </div>

                {/* Métricas principales */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {modelMetrics.map((metric, index) => (
                        <Card key={index}>
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">{metric.name}</p>
                                        <p className="text-2xl font-bold">
                                            {metric.value}{metric.unit || ''}
                                        </p>
                                        <p className="text-xs text-muted-foreground">{metric.trend}</p>
                                    </div>
                                    <Brain className="h-8 w-8 text-purple-600" />
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <Tabs defaultValue="services" className="space-y-4">
                    <TabsList>
                        <TabsTrigger value="services">Servicios de IA</TabsTrigger>
                        <TabsTrigger value="analysis">Análisis Recientes</TabsTrigger>
                        <TabsTrigger value="testing">Pruebas</TabsTrigger>
                        <TabsTrigger value="config">Configuración</TabsTrigger>
                    </TabsList>

                    <TabsContent value="services" className="space-y-4">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {aiServices.map((service) => (
                                <Card key={service.id}>
                                    <CardHeader>
                                        <div className="flex items-center justify-between">
                                            <CardTitle className="flex items-center gap-2">
                                                <Brain className="w-5 h-5" />
                                                {service.name}
                                            </CardTitle>
                                            <Badge variant={
                                                service.status === 'active' ? 'default' :
                                                service.status === 'maintenance' ? 'secondary' : 'destructive'
                                            }>
                                                {service.status === 'active' && <CheckCircle className="w-3 h-3 mr-1" />}
                                                {service.status === 'maintenance' && <Settings className="w-3 h-3 mr-1" />}
                                                {service.status === 'inactive' && <AlertCircle className="w-3 h-3 mr-1" />}
                                                {service.status}
                                            </Badge>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <p className="text-sm text-muted-foreground">{service.description}</p>
                                        
                                        <div className="space-y-3">
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm">Uso actual</span>
                                                <span className="text-sm font-medium">{service.usage}%</span>
                                            </div>
                                            <Progress value={service.usage} />
                                            
                                            <div className="grid grid-cols-2 gap-4 text-sm">
                                                <div>
                                                    <p className="text-muted-foreground">Solicitudes</p>
                                                    <p className="font-medium">{service.requests.toLocaleString()}</p>
                                                </div>
                                                <div>
                                                    <p className="text-muted-foreground">Precisión</p>
                                                    <p className="font-medium">{service.accuracy}%</p>
                                                </div>
                                            </div>
                                            
                                            <div className="flex items-center justify-between pt-2">
                                                <span className="text-xs text-muted-foreground flex items-center gap-1">
                                                    <Clock className="w-3 h-3" />
                                                    {service.lastUsed}
                                                </span>
                                                <div className="flex gap-2">
                                                    {service.status === 'active' ? (
                                                        <Button variant="outline" size="sm">
                                                            <Pause className="w-3 h-3 mr-1" />
                                                            Pausar
                                                        </Button>
                                                    ) : (
                                                        <Button variant="outline" size="sm">
                                                            <Play className="w-3 h-3 mr-1" />
                                                            Activar
                                                        </Button>
                                                    )}
                                                    <Button variant="outline" size="sm">
                                                        <Settings className="w-3 h-3" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </TabsContent>

                    <TabsContent value="analysis" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Análisis Recientes</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {recentAnalysis.map((analysis) => (
                                        <div key={analysis.id} className="flex items-center justify-between p-4 border rounded-lg">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-purple-100 rounded-lg">
                                                    <FileText className="w-4 h-4 text-purple-600" />
                                                </div>
                                                <div>
                                                    <p className="font-medium">{analysis.type}</p>
                                                    <p className="text-sm text-muted-foreground">{analysis.document}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <Badge variant={
                                                        analysis.status === 'completed' ? 'default' :
                                                        analysis.status === 'processing' ? 'secondary' : 'destructive'
                                                    }>
                                                        {analysis.status}
                                                    </Badge>
                                                    <span className="text-sm font-medium">{analysis.confidence}%</span>
                                                </div>
                                                <p className="text-xs text-muted-foreground">{analysis.time}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="testing" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Pruebas de IA</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Texto de prueba</label>
                                    <Textarea
                                        placeholder="Ingrese texto médico para analizar..."
                                        value={testInput}
                                        onChange={(e) => setTestInput(e.target.value)}
                                        rows={4}
                                    />
                                </div>
                                
                                <Button 
                                    onClick={runTest} 
                                    disabled={!testInput || isProcessing}
                                    className="w-full"
                                >
                                    {isProcessing ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                            Procesando...
                                        </>
                                    ) : (
                                        <>
                                            <Play className="w-4 h-4 mr-2" />
                                            Ejecutar Prueba
                                        </>
                                    )}
                                </Button>
                                
                                {testResult && (
                                    <Alert>
                                        <CheckCircle className="h-4 w-4" />
                                        <AlertDescription>
                                            <pre className="whitespace-pre-wrap text-sm">{testResult}</pre>
                                        </AlertDescription>
                                    </Alert>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="config" className="space-y-4">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Configuración General</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-medium">Auto-procesamiento</p>
                                            <p className="text-sm text-muted-foreground">Procesar documentos automáticamente</p>
                                        </div>
                                        <Switch defaultChecked />
                                    </div>
                                    
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-medium">Notificaciones IA</p>
                                            <p className="text-sm text-muted-foreground">Alertas de análisis completados</p>
                                        </div>
                                        <Switch defaultChecked />
                                    </div>
                                    
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-medium">Modo debug</p>
                                            <p className="text-sm text-muted-foreground">Logs detallados de IA</p>
                                        </div>
                                        <Switch />
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Recursos del Sistema</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <div className="flex justify-between">
                                            <span>CPU dedicada a IA</span>
                                            <span className="font-medium">4 cores</span>
                                        </div>
                                        <Progress value={60} />
                                    </div>
                                    
                                    <div className="space-y-2">
                                        <div className="flex justify-between">
                                            <span>Memoria asignada</span>
                                            <span className="font-medium">8 GB</span>
                                        </div>
                                        <Progress value={75} />
                                    </div>
                                    
                                    <div className="space-y-2">
                                        <div className="flex justify-between">
                                            <span>Almacenamiento modelos</span>
                                            <span className="font-medium">2.4 GB</span>
                                        </div>
                                        <Progress value={40} />
                                    </div>
                                    
                                    <Button variant="outline" className="w-full">
                                        <RotateCcw className="w-4 h-4 mr-2" />
                                        Reiniciar Servicios IA
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
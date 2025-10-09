import { usePage } from '@inertiajs/react';
import { MetricCard } from "@/components/metric-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/status-badge";
import { MOCK_REFERENCIAS } from "@/lib/mock-data";
import { FileText, AlertCircle, CheckCircle, Clock, Timer, Activity, Users, TrendingUp, Calendar, Stethoscope, Heart, Brain, UserCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import AppLayoutInertia from '@/layouts/app-layout-inertia';
import { type BreadcrumbItem } from '@/types';
import { Progress } from "@/components/ui/progress";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Panel Médico',
        href: '/medico/dashboard',
    },
];

export default function MedicoDashboard() {
  const { auth } = usePage<{ auth: { user: { nombre: string, role: string } } }>().props;
  const casosPendientes = MOCK_REFERENCIAS.filter((r) => r.estado === "pendiente")
  const casosCriticos = MOCK_REFERENCIAS.filter((r) => r.prioridad === "critica")
  const casosAceptados = MOCK_REFERENCIAS.filter((r) => r.estado === "aceptada")
  const pacientesHoy = 12
  const tiempoPromedioAtencion = "2.4 horas"
  const eficienciaAtencion = 94

  return (
    <AppLayoutInertia 
      title="Panel Médico - Vital Red" 
      breadcrumbs={breadcrumbs}
      user={auth.user}
    >
      <div className="flex h-full flex-1 flex-col gap-6 p-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Panel Médico</h1>
        <p className="text-muted-foreground">Gestiona tus casos y referencias asignadas</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          titulo="Casos Pendientes"
          valor={casosPendientes.length}
          icono={Clock}
          cambio={-2}
          tendencia="down"
        />
        <MetricCard
          titulo="Casos Críticos"
          valor={casosCriticos.length}
          icono={AlertCircle}
          cambio={1}
          tendencia="up"
        />
        <MetricCard titulo="Pacientes Hoy" valor={pacientesHoy} icono={Users} cambio={3} tendencia="up" />
        <MetricCard titulo="Casos Aceptados" valor={casosAceptados.length} icono={CheckCircle} cambio={5} tendencia="up" />
      </div>

      {/* Métricas adicionales específicas para médicos */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Tiempo Promedio Atención</p>
                <p className="text-2xl font-bold text-foreground">{tiempoPromedioAtencion}</p>
              </div>
              <Activity className="h-8 w-8 text-primary" />
            </div>
            <div className="mt-4">
              <Progress value={75} className="h-2" />
              <p className="text-xs text-muted-foreground mt-2">Meta: 2 horas</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Eficiencia Atención</p>
                <p className="text-2xl font-bold text-foreground">{eficienciaAtencion}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-success" />
            </div>
            <div className="mt-4">
              <Progress value={eficienciaAtencion} className="h-2" />
              <p className="text-xs text-muted-foreground mt-2">Excelente rendimiento</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Especialidad</p>
                <p className="text-lg font-bold text-foreground">Medicina Interna</p>
              </div>
              <Stethoscope className="h-8 w-8 text-primary" />
            </div>
            <div className="mt-4">
              <p className="text-xs text-muted-foreground">Certificación vigente</p>
              <p className="text-xs text-success">✓ Activo hasta 2025</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Casos Urgentes - Requieren Atención</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-muted/50">
                <TableHead className="text-muted-foreground">ID</TableHead>
                <TableHead className="text-muted-foreground">Paciente</TableHead>
                <TableHead className="text-muted-foreground">Edad</TableHead>
                <TableHead className="text-muted-foreground">Motivo</TableHead>
                <TableHead className="text-muted-foreground">Prioridad</TableHead>
                <TableHead className="text-muted-foreground">Tiempo</TableHead>
                <TableHead className="text-muted-foreground">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {MOCK_REFERENCIAS.slice(0, 3).map((ref) => (
                <TableRow key={ref.id} className="border-border hover:bg-muted/50">
                  <TableCell className="font-mono text-sm text-foreground">{ref.id}</TableCell>
                  <TableCell className="font-medium text-foreground">{ref.paciente.nombre}</TableCell>
                  <TableCell className="text-muted-foreground">{ref.paciente.edad} años</TableCell>
                  <TableCell className="text-muted-foreground">{ref.motivo}</TableCell>
                  <TableCell>
                    <StatusBadge prioridad={ref.prioridad} />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm">
                      <Timer className="h-3 w-3 text-warning" />
                      <span className="text-warning font-medium">2h 15m</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="sm">Evaluar</Button>
                      <Button variant="outline" size="sm">
                        Ver Historial
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Workspace Integrado</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-secondary rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-foreground">Caso Actual: REF001</h3>
                <Badge className="bg-destructive text-destructive-foreground animate-pulse">Crítico</Badge>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Paciente:</span>
                  <span className="text-foreground font-medium">Carlos Rodríguez</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Edad:</span>
                  <span className="text-foreground">45 años</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Motivo:</span>
                  <span className="text-foreground">Dolor torácico agudo</span>
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <Button className="flex-1 bg-success hover:bg-success/90">Aceptar</Button>
                <Button variant="outline" className="flex-1 bg-transparent">
                  Rechazar
                </Button>
              </div>
            </div>
            <Button variant="outline" className="w-full bg-transparent">
              Agregar Notas Médicas
            </Button>
            <Button variant="outline" className="w-full bg-transparent">
              Consultar Colega
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Notificaciones Médicas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-secondary rounded-lg">
              <AlertCircle className="h-5 w-5 text-destructive mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">Nuevo caso crítico asignado</p>
                <p className="text-xs text-muted-foreground">Hace 5 minutos</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-secondary rounded-lg">
              <CheckCircle className="h-5 w-5 text-success mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">Paciente dado de alta</p>
                <p className="text-xs text-muted-foreground">Hace 1 hora</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-secondary rounded-lg">
              <FileText className="h-5 w-5 text-primary mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">Resultados de laboratorio disponibles</p>
                <p className="text-xs text-muted-foreground">Hace 2 horas</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      </div>
    </AppLayoutInertia>
  );
}

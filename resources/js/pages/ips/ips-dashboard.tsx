import { usePage } from '@inertiajs/react';
import { MetricCard } from "@/components/metric-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/status-badge";
import { MOCK_REFERENCIAS } from "@/lib/mock-data";
import { Send, CheckCircle, Clock, TrendingUp, Plus, BarChart3, Download } from "lucide-react";
import AppLayoutInertia from '@/layouts/app-layout-inertia';
import { type BreadcrumbItem } from '@/types';

const estadisticasData = [
  { mes: "Ene", enviadas: 12, aceptadas: 10 },
  { mes: "Feb", enviadas: 15, aceptadas: 13 },
  { mes: "Mar", enviadas: 18, aceptadas: 15 },
  { mes: "Abr", enviadas: 14, aceptadas: 12 },
  { mes: "May", enviadas: 20, aceptadas: 17 },
  { mes: "Jun", enviadas: 22, aceptadas: 19 },
]

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Panel IPS',
        href: '/ips/dashboard',
    },
];

export default function IPSDashboard() {
  const { auth } = usePage<{ auth: { user: { nombre: string, role: string } } }>().props;
  const totalEnviadas = MOCK_REFERENCIAS.length
  const aceptadas = MOCK_REFERENCIAS.filter((r) => r.estado === "aceptada").length
  const pendientes = MOCK_REFERENCIAS.filter((r) => r.estado === "pendiente").length
  const tasaAceptacion = ((aceptadas / totalEnviadas) * 100).toFixed(1)

  return (
    <AppLayoutInertia 
      title="Panel IPS - Vital Red" 
      breadcrumbs={breadcrumbs}
      user={auth.user}
    >
      <div className="flex h-full flex-1 flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Panel IPS</h1>
          <p className="text-muted-foreground">Gestiona las solicitudes de tu institución</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Nueva Solicitud
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard titulo="Solicitudes Enviadas" valor={totalEnviadas} icono={Send} cambio={8} tendencia="up" />
        <MetricCard titulo="Aceptadas" valor={aceptadas} icono={CheckCircle} cambio={5} tendencia="up" />
        <MetricCard titulo="Pendientes" valor={pendientes} icono={Clock} cambio={-2} tendencia="down" />
        <MetricCard
          titulo="Tasa de Aceptación"
          valor={`${tasaAceptacion}%`}
          icono={TrendingUp}
          cambio={3.2}
          tendencia="up"
        />
      </div>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Tendencia de Solicitudes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center bg-muted rounded-lg">
            <p className="text-muted-foreground">Gráfico de solicitudes no disponible</p>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card border-border">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-foreground">Solicitudes Recientes</CardTitle>
          <Button variant="outline" size="sm" className="gap-2 bg-transparent">
            <Download className="h-4 w-4" />
            Exportar
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-muted/50">
                <TableHead className="text-muted-foreground">ID</TableHead>
                <TableHead className="text-muted-foreground">Paciente</TableHead>
                <TableHead className="text-muted-foreground">Especialidad</TableHead>
                <TableHead className="text-muted-foreground">Prioridad</TableHead>
                <TableHead className="text-muted-foreground">Estado</TableHead>
                <TableHead className="text-muted-foreground">Fecha</TableHead>
                <TableHead className="text-muted-foreground">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {MOCK_REFERENCIAS.slice(0, 5).map((ref) => (
                <TableRow key={ref.id} className="border-border hover:bg-muted/50">
                  <TableCell className="font-mono text-sm text-foreground">{ref.id}</TableCell>
                  <TableCell className="font-medium text-foreground">{ref.paciente.nombre}</TableCell>
                  <TableCell className="text-muted-foreground">{ref.especialidad}</TableCell>
                  <TableCell>
                    <StatusBadge prioridad={ref.prioridad} />
                  </TableCell>
                  <TableCell>
                    <StatusBadge estado={ref.estado} />
                  </TableCell>
                  <TableCell className="text-muted-foreground">{ref.fechaCreacion.toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm">
                      Ver Detalle
                    </Button>
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
            <CardTitle className="text-foreground">Accesos Rápidos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="outline" className="w-full justify-start gap-2 bg-transparent">
              <Plus className="h-4 w-4" />
              Nueva Solicitud de Referencia
            </Button>
            <Button variant="outline" className="w-full justify-start gap-2 bg-transparent">
              <BarChart3 className="h-4 w-4" />
              Ver Estadísticas Completas
            </Button>
            <Button variant="outline" className="w-full justify-start gap-2 bg-transparent">
              <Download className="h-4 w-4" />
              Descargar Reporte Mensual
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Información de la IPS</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between p-3 bg-secondary rounded-lg">
              <span className="text-sm text-muted-foreground">Nombre:</span>
              <span className="text-sm font-medium text-foreground">IPS Central</span>
            </div>
            <div className="flex justify-between p-3 bg-secondary rounded-lg">
              <span className="text-sm text-muted-foreground">Código:</span>
              <span className="text-sm font-medium text-foreground">IPS-001</span>
            </div>
            <div className="flex justify-between p-3 bg-secondary rounded-lg">
              <span className="text-sm text-muted-foreground">Tiempo promedio:</span>
              <span className="text-sm font-medium text-foreground">2.4 horas</span>
            </div>
          </CardContent>
        </Card>
      </div>
      </div>
    </AppLayoutInertia>
  );
}

import { usePage } from '@inertiajs/react';
import { MetricCard } from "@/components/metric-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Users, FileText, AlertCircle, Activity, RefreshCw, TrendingUp, Clock } from "lucide-react";
import AppLayoutInertia from '@/layouts/app-layout-inertia';
import { type BreadcrumbItem } from '@/types';

interface Usuario {
  id: number;
  name: string;
  email: string;
  role: 'administrador' | 'medico' | 'ips';
  is_active: boolean;
  created_at: string;
}

interface Stats {
  total_usuarios: number;
  referencias_pendientes: number;
  casos_criticos: number;
  sistema_activo: string;
}

interface Props {
  usuariosRecientes: Usuario[];
  stats: Stats;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Panel de Administración',
        href: '/admin/dashboard',
    },
];

export default function AdminDashboard({ usuariosRecientes, stats }: Props) {
  const { auth } = usePage<{ auth: { user: { name: string, role: string } } }>().props;

  const formatearFecha = (fecha: string) => {
    const date = new Date(fecha);
    const ahora = new Date();
    const diffMs = ahora.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `Hace ${diffMins} minuto${diffMins !== 1 ? 's' : ''}`;
    if (diffHours < 24) return `Hace ${diffHours} hora${diffHours !== 1 ? 's' : ''}`;
    if (diffDays < 7) return `Hace ${diffDays} día${diffDays !== 1 ? 's' : ''}`;
    return date.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' });
  }

  return (
    <AppLayoutInertia 
      title="Panel de Administración" 
      breadcrumbs={breadcrumbs}
      user={auth.user}
    >
      <div className="flex h-full flex-1 flex-col gap-4 p-6">
        {/* Header Compacto */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Panel de Administración</h1>
          <p className="text-sm text-muted-foreground">Gestión completa del sistema</p>
        </div>

        {/* Bento Grid - Métricas */}
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground">Total Usuarios</p>
                <h3 className="text-2xl font-bold mt-1">{stats.total_usuarios}</h3>
              </div>
              <Users className="h-8 w-8 text-muted-foreground opacity-50" />
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground">Referencias</p>
                <h3 className="text-2xl font-bold mt-1">{stats.referencias_pendientes}</h3>
              </div>
              <FileText className="h-8 w-8 text-muted-foreground opacity-50" />
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground">Casos Críticos</p>
                <h3 className="text-2xl font-bold mt-1">{stats.casos_criticos}</h3>
              </div>
              <AlertCircle className="h-8 w-8 text-red-500 opacity-60" />
            </div>
          </Card>

          <Card className="p-4 bg-green-50 dark:bg-green-950/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-green-700 dark:text-green-400">Sistema</p>
                <h3 className="text-2xl font-bold mt-1 text-green-700 dark:text-green-400">{stats.sistema_activo}</h3>
              </div>
              <Activity className="h-8 w-8 text-green-600 dark:text-green-500 opacity-70" />
            </div>
          </Card>
        </div>

        {/* Grid de Contenido - 2 Columnas */}
        <div className="grid gap-3 lg:grid-cols-3">
          {/* Usuarios Recientes - 2 columnas */}
          <Card className="lg:col-span-2">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Usuarios Recientes</CardTitle>
                  <p className="text-xs text-muted-foreground mt-1">Últimos usuarios registrados</p>
                </div>
                <Button variant="outline" size="sm" className="gap-2 h-8">
                  <RefreshCw className="h-3 w-3" />
                  Actualizar
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <Table>
                <TableHeader>
                  <TableRow className="border-border">
                    <TableHead>Nombre</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Rol</TableHead>
                    <TableHead>Estado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {usuariosRecientes.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                        No hay usuarios registrados aún
                      </TableCell>
                    </TableRow>
                  ) : (
                    usuariosRecientes.map((usuario) => (
                      <TableRow key={usuario.id} className="border-border">
                        <TableCell className="font-medium">{usuario.name}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{usuario.email}</TableCell>
                        <TableCell className="text-sm">
                          <Badge variant={usuario.role === 'administrador' ? 'default' : 'secondary'}>
                            {usuario.role === 'administrador' ? 'Admin' : usuario.role === 'medico' ? 'Médico' : 'IPS'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                              usuario.is_active 
                                ? 'bg-green-100 dark:bg-green-950/30 text-green-700 dark:text-green-400'
                                : 'bg-red-100 dark:bg-red-950/30 text-red-700 dark:text-red-400'
                            }`}>
                              {usuario.is_active ? 'Activo' : 'Inactivo'}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {formatearFecha(usuario.created_at)}
                            </span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Actividad del Sistema - 1 columna */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Actividad del Sistema</CardTitle>
              <p className="text-xs text-muted-foreground mt-1">Resumen de actividad reciente</p>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 dark:bg-green-950/30">
                    <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">Nuevos Usuarios</p>
                    <p className="text-xs text-muted-foreground">+{usuariosRecientes.length} registros hoy</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-950/30">
                    <FileText className="h-5 w-5 text-blue-600 dark:text-blue-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">Referencias Activas</p>
                    <p className="text-xs text-muted-foreground">{stats.referencias_pendientes} pendientes de revisión</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100 dark:bg-red-950/30">
                    <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">Casos Prioritarios</p>
                    <p className="text-xs text-muted-foreground">{stats.casos_criticos} requieren atención</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-950/30">
                    <Clock className="h-5 w-5 text-purple-600 dark:text-purple-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">Uptime del Sistema</p>
                    <p className="text-xs text-muted-foreground">{stats.sistema_activo} últimas 24h</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayoutInertia>
  );
}

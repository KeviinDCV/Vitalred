import { usePage, router } from '@inertiajs/react';
import { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Users, FileText, Activity, TrendingUp } from "lucide-react";
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

interface ActividadSistema {
  nuevos_usuarios_hoy: number;
  nuevos_usuarios_semana: number;
  total_usuarios: number;
  registros_medicos_total: number;
  registros_medicos_semana: number;
  usuarios_por_rol: {
    administradores: number;
    medicos: number;
    ips: number;
  };
}

interface Props {
  usuariosRecientes: Usuario[];
  actividadSistema: ActividadSistema;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Panel de Administración',
        href: '/admin/dashboard',
    },
];

export default function AdminDashboard({ usuariosRecientes, actividadSistema }: Props) {
  const { auth } = usePage<{ auth: { user: { name: string, role: string } } }>().props;

  // Auto-refresh cada 30 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      router.reload({
        only: ['usuariosRecientes', 'actividadSistema'],
        preserveScroll: true,
      });
    }, 30000); // 30 segundos

    return () => clearInterval(interval);
  }, []);

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

        {/* Grid de Contenido - 2 Columnas */}
        <div className="grid gap-3 lg:grid-cols-3">
          {/* Usuarios Recientes - 2 columnas */}
          <Card className="lg:col-span-2">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Usuarios Recientes</CardTitle>
              <p className="text-xs text-muted-foreground mt-1">Últimos usuarios registrados • Actualización automática</p>
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
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-950/30">
                    <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">Nuevos Usuarios Hoy</p>
                    <p className="text-xs text-muted-foreground">+{actividadSistema.nuevos_usuarios_hoy} registrados</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-950/30">
                    <Users className="h-5 w-5 text-blue-600 dark:text-blue-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">Usuarios Esta Semana</p>
                    <p className="text-xs text-muted-foreground">+{actividadSistema.nuevos_usuarios_semana} de {actividadSistema.total_usuarios} totales</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-950/30">
                    <FileText className="h-5 w-5 text-blue-600 dark:text-blue-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">Registros Médicos</p>
                    <p className="text-xs text-muted-foreground">{actividadSistema.registros_medicos_semana} esta semana / {actividadSistema.registros_medicos_total} totales</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-950/30">
                    <Activity className="h-5 w-5 text-blue-600 dark:text-blue-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">Distribución de Roles</p>
                    <p className="text-xs text-muted-foreground">
                      {actividadSistema.usuarios_por_rol.administradores} admins, {actividadSistema.usuarios_por_rol.medicos} médicos, {actividadSistema.usuarios_por_rol.ips} IPS
                    </p>
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

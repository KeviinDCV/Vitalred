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
      {/* 
        RESPONSIVE DESIGN PRINCIPLES:
        Principle 1 - Box System: Header, Stats, Table as distinct boxes with clear relationships
        Principle 2 - Rearrange with Purpose: Stack on mobile, grid on desktop - NO horizontal scroll
      */}
      <div className="flex flex-col gap-4 sm:gap-5 md:gap-6">
        {/* Header BOX */}
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">Panel de Administración</h1>
          <p className="text-xs sm:text-sm text-muted-foreground">Gestión completa del sistema</p>
        </div>

        {/* Content Grid - Stack on mobile, side-by-side on lg+ */}
        <div className="grid gap-4 lg:grid-cols-3">
          
          {/* Usuarios Recientes BOX - 2 cols on desktop */}
          <Card className="lg:col-span-2 overflow-hidden">
            <CardHeader className="p-4 sm:p-5 md:p-6 pb-3">
              <CardTitle className="text-base sm:text-lg">Usuarios Recientes</CardTitle>
              <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">Últimos registrados • Auto-refresh</p>
            </CardHeader>
            <CardContent className="p-0">
              {/* Mobile: Card list, Desktop: Table */}
              <div className="divide-y divide-border">
                {usuariosRecientes.length === 0 ? (
                  <div className="text-center text-muted-foreground py-8 text-xs sm:text-sm px-4">
                    No hay usuarios registrados aún
                  </div>
                ) : (
                  usuariosRecientes.map((usuario) => (
                    <div key={usuario.id} className="p-3 sm:p-4 flex items-center justify-between gap-3">
                      {/* User info */}
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-xs sm:text-sm truncate">{usuario.name}</div>
                        <div className="text-[10px] sm:text-xs text-muted-foreground truncate">{usuario.email}</div>
                      </div>
                      {/* Role badge */}
                      <Badge variant={usuario.role === 'administrador' ? 'default' : 'secondary'} className="text-[10px] sm:text-xs flex-shrink-0">
                        {usuario.role === 'administrador' ? 'Admin' : usuario.role === 'medico' ? 'Médico' : 'IPS'}
                      </Badge>
                      {/* Status */}
                      <div className="flex flex-col items-end flex-shrink-0">
                        <span className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-medium ${
                          usuario.is_active 
                            ? 'bg-green-100 dark:bg-green-950/30 text-green-700 dark:text-green-400'
                            : 'bg-red-100 dark:bg-red-950/30 text-red-700 dark:text-red-400'
                        }`}>
                          {usuario.is_active ? 'Activo' : 'Inactivo'}
                        </span>
                        <span className="text-[10px] text-muted-foreground mt-0.5">
                          {formatearFecha(usuario.created_at)}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Actividad BOX */}
          <Card className="overflow-hidden">
            <CardHeader className="p-4 sm:p-5 md:p-6 pb-3">
              <CardTitle className="text-base sm:text-lg">Actividad</CardTitle>
              <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">Resumen reciente</p>
            </CardHeader>
            <CardContent className="p-4 sm:p-5 md:p-6 pt-0">
              <div className="space-y-2 sm:space-y-3">
                <div className="flex items-center gap-3 p-2.5 sm:p-3 rounded-lg bg-muted/50">
                  <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-950/30 flex-shrink-0">
                    <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 dark:text-blue-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm font-medium">Nuevos Hoy</p>
                    <p className="text-[10px] sm:text-xs text-muted-foreground">+{actividadSistema.nuevos_usuarios_hoy} registrados</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-2.5 sm:p-3 rounded-lg bg-muted/50">
                  <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-950/30 flex-shrink-0">
                    <Users className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 dark:text-blue-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm font-medium">Esta Semana</p>
                    <p className="text-[10px] sm:text-xs text-muted-foreground">+{actividadSistema.nuevos_usuarios_semana} de {actividadSistema.total_usuarios}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-2.5 sm:p-3 rounded-lg bg-muted/50">
                  <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-950/30 flex-shrink-0">
                    <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 dark:text-blue-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm font-medium">Registros</p>
                    <p className="text-[10px] sm:text-xs text-muted-foreground">{actividadSistema.registros_medicos_semana} esta semana / {actividadSistema.registros_medicos_total} total</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-2.5 sm:p-3 rounded-lg bg-muted/50">
                  <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-950/30 flex-shrink-0">
                    <Activity className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 dark:text-blue-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm font-medium">Distribución</p>
                    <p className="text-[10px] sm:text-xs text-muted-foreground">
                      {actividadSistema.usuarios_por_rol.administradores} Admin · {actividadSistema.usuarios_por_rol.medicos} Médico · {actividadSistema.usuarios_por_rol.ips} IPS
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

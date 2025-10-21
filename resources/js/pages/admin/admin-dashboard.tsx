import { usePage } from '@inertiajs/react';
import { useState } from "react";
import { MetricCard } from "@/components/metric-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ModalCrearUsuario } from "./modal-crear-usuario";
import { Users, FileText, AlertCircle, Activity, Plus, RefreshCw } from "lucide-react";
import { MOCK_USUARIOS, MOCK_CHART_DATA } from "@/lib/mock-data";
import AppLayoutInertia from '@/layouts/app-layout-inertia';
import { type BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Panel de Administración',
        href: '/admin/dashboard',
    },
];

export default function AdminDashboard() {
  const { auth } = usePage<{ auth: { user: { name: string, role: string } } }>().props;
  const [modalCrearOpen, setModalCrearOpen] = useState(false)

  return (
    <AppLayoutInertia 
      title="Panel de Administración" 
      breadcrumbs={breadcrumbs}
      user={auth.user}
    >
      <div className="flex h-full flex-1 flex-col gap-4 p-6">
        {/* Header Compacto */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Panel de Administración</h1>
            <p className="text-sm text-muted-foreground">Gestión completa del sistema</p>
          </div>
          <Button onClick={() => setModalCrearOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Crear Usuario
          </Button>
        </div>

        {/* Bento Grid - Métricas */}
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground">Total Usuarios</p>
                <h3 className="text-2xl font-bold mt-1">{MOCK_USUARIOS.length}</h3>
                <p className="text-xs text-green-600 mt-1">↑ 12%</p>
              </div>
              <Users className="h-8 w-8 text-muted-foreground opacity-50" />
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground">Referencias</p>
                <h3 className="text-2xl font-bold mt-1">15</h3>
                <p className="text-xs text-red-600 mt-1">↓ 5%</p>
              </div>
              <FileText className="h-8 w-8 text-muted-foreground opacity-50" />
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground">Casos Críticos</p>
                <h3 className="text-2xl font-bold mt-1">3</h3>
                <p className="text-xs text-muted-foreground mt-1">Sin cambios</p>
              </div>
              <AlertCircle className="h-8 w-8 text-red-500 opacity-60" />
            </div>
          </Card>

          <Card className="p-4 bg-green-50 dark:bg-green-950/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-green-700 dark:text-green-400">Sistema</p>
                <h3 className="text-2xl font-bold mt-1 text-green-700 dark:text-green-400">99.9%</h3>
                <p className="text-xs text-green-600 dark:text-green-500 mt-1">↑ 0.1%</p>
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
                  {MOCK_USUARIOS.slice(0, 5).map((usuario) => (
                    <TableRow key={usuario.id} className="border-border">
                      <TableCell className="font-medium">{usuario.nombre}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{usuario.email}</TableCell>
                      <TableCell className="text-sm capitalize">{usuario.rol}</TableCell>
                      <TableCell>
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-950/30 text-green-700 dark:text-green-400">
                          Activo
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Actividad Rápida - 1 columna */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Accesos Rápidos</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start gap-2 h-10" asChild>
                  <a href="/admin/usuarios">
                    <Users className="h-4 w-4" />
                    Gestión de Usuarios
                  </a>
                </Button>
                <Button variant="outline" className="w-full justify-start gap-2 h-10" asChild>
                  <a href="/admin/referencias">
                    <FileText className="h-4 w-4" />
                    Referencias
                  </a>
                </Button>
                <Button variant="outline" className="w-full justify-start gap-2 h-10" asChild>
                  <a href="/admin/supervision">
                    <Activity className="h-4 w-4" />
                    Supervisión
                  </a>
                </Button>
                <Button variant="outline" className="w-full justify-start gap-2 h-10" asChild>
                  <a href="/admin/reportes">
                    <AlertCircle className="h-4 w-4" />
                    Reportes
                  </a>
                </Button>
                <Button variant="outline" className="w-full justify-start gap-2 h-10" asChild>
                  <a href="/admin/configuracion">
                    <Activity className="h-4 w-4" />
                    Configuración
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <ModalCrearUsuario open={modalCrearOpen} onOpenChange={setModalCrearOpen} />
      </div>
    </AppLayoutInertia>
  );
}

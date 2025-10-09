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
  const { auth } = usePage<{ auth: { user: { nombre: string, role: string } } }>().props;
  const [modalCrearOpen, setModalCrearOpen] = useState(false)

  return (
    <AppLayoutInertia 
      title="Panel de Administración" 
      breadcrumbs={breadcrumbs}
      user={auth.user}
    >
      <div className="flex h-full flex-1 flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Panel de Administración</h1>
          <p className="text-muted-foreground">Gestión completa del sistema</p>
        </div>
        <Button onClick={() => setModalCrearOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Crear Usuario
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard titulo="Total Usuarios" valor={MOCK_USUARIOS.length} icono={Users} cambio={12} tendencia="up" />
        <MetricCard titulo="Referencias Pendientes" valor={15} icono={FileText} cambio={-5} tendencia="down" />
        <MetricCard titulo="Casos Críticos" valor={3} icono={AlertCircle} cambio={0} tendencia="neutral" />
        <MetricCard titulo="Sistema Activo" valor="99.9%" icono={Activity} cambio={0.1} tendencia="up" />
      </div>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Tendencias de Actividad</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center bg-muted rounded-lg">
            <p className="text-muted-foreground">Gráfico de tendencias no disponible</p>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card border-border">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-foreground">Usuarios Activos</CardTitle>
          <Button variant="outline" size="sm" className="gap-2 bg-transparent">
            <RefreshCw className="h-4 w-4" />
            Actualizar
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-muted/50">
                <TableHead className="text-muted-foreground">Nombre</TableHead>
                <TableHead className="text-muted-foreground">Email</TableHead>
                <TableHead className="text-muted-foreground">Rol</TableHead>
                <TableHead className="text-muted-foreground">Estado</TableHead>
                <TableHead className="text-muted-foreground">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {MOCK_USUARIOS.map((usuario) => (
                <TableRow key={usuario.id} className="border-border hover:bg-muted/50">
                  <TableCell className="font-medium text-foreground">{usuario.nombre}</TableCell>
                  <TableCell className="text-muted-foreground">{usuario.email}</TableCell>
                  <TableCell className="text-muted-foreground capitalize">{usuario.rol}</TableCell>
                  <TableCell>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-success/20 text-success">
                      Activo
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        Editar
                      </Button>
                      <Button variant="outline" size="sm">
                        Ver Perfil
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <ModalCrearUsuario open={modalCrearOpen} onOpenChange={setModalCrearOpen} />
      </div>
    </AppLayoutInertia>
  );
}

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import InputError from '@/components/input-error';
import AppLayoutInertia from '@/layouts/app-layout-inertia';
import { type BreadcrumbItem } from '@/types';
import { useForm, router, usePage } from '@inertiajs/react';
import { Plus, Edit, Trash2, UserCheck, UserX, Search, FileText, CheckCircle, XCircle } from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';
import { toast } from 'sonner';
import { Textarea } from '@/components/ui/textarea';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Gestión de Usuarios',
        href: '/admin/usuarios',
    },
];

interface Usuario {
    id: number;
    name: string;
    email: string;
    role: 'administrador' | 'medico' | 'ips';
    is_active: boolean;
    created_at: string;
}

interface Stats {
    total: number;
    administradores: number;
    medicos: number;
    eps: number;
    activos: number;
}

interface SolicitudRegistro {
    id: number;
    ips_id: number | null;
    ips_nombre: string | null;
    nit: string;
    nombre_responsable: string;
    cargo_responsable: string;
    telefono: string;
    email: string;
    estado: 'pendiente' | 'aprobada' | 'rechazada';
    observaciones: string | null;
    aprobado_por: number | null;
    fecha_aprobacion: string | null;
    created_at: string;
    institucion?: {
        id: number;
        nombre: string;
    } | null;
    aprobador?: {
        id: number;
        name: string;
    } | null;
}

interface EPS {
    id: number;
    nombre: string;
    nit: string | null;
}

interface Props {
    usuarios: Usuario[];
    stats: Stats;
    eps?: EPS[];
    nits?: string[];
    solicitudes?: SolicitudRegistro[];
    filtroEstado?: string;
}

export default function GestionUsuarios({ usuarios, stats, eps = [], nits = [], solicitudes = [], filtroEstado = '' }: Props) {
    const { auth, flash } = usePage<{ auth: { user: { name: string, role: string } }, flash: any }>().props;
    // Si hay filtroEstado, significa que venimos de la ruta de solicitudes
    const [activeTab, setActiveTab] = useState<'usuarios' | 'solicitudes'>(filtroEstado !== '' ? 'solicitudes' : 'usuarios');
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isRechazarDialogOpen, setIsRechazarDialogOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<Usuario | null>(null);
    const [solicitudRechazar, setSolicitudRechazar] = useState<SolicitudRegistro | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filtroEstadoSolicitudes, setFiltroEstadoSolicitudes] = useState(filtroEstado);
    const [observacionesRechazo, setObservacionesRechazo] = useState('');

    // Formulario para crear usuario
    const { data: createData, setData: setCreateData, post, processing: createProcessing, errors: createErrors, reset: resetCreate } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        role: 'medico' as 'administrador' | 'medico' | 'ips',
        is_active: true,
        eps_id: null as number | null,
        eps_nombre: '',
        nit: '',
        nombre_responsable: '',
        cargo_responsable: '',
        telefono: '',
    });

    const [epsSeleccionadaCreate, setEpsSeleccionadaCreate] = useState<string>('');
    const [epsManualCreate, setEpsManualCreate] = useState('');
    const [nitSeleccionadoCreate, setNitSeleccionadoCreate] = useState<string>('');
    const [nitManualCreate, setNitManualCreate] = useState<string>('');
    const [searchEpsCreate, setSearchEpsCreate] = useState('');
    const [searchNitCreate, setSearchNitCreate] = useState('');

    // Formulario para editar usuario
    const { data: editData, setData: setEditData, put, processing: editProcessing, errors: editErrors, reset: resetEdit } = useForm({
        name: '',
        email: '',
        role: 'medico' as 'administrador' | 'medico' | 'ips',
        is_active: true,
    });

    // Filtrar usuarios basado en el término de búsqueda
    const filteredUsuarios = useMemo(() => {
        if (!searchTerm) return usuarios;

        return usuarios.filter(usuario =>
            usuario.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            usuario.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            usuario.role.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [usuarios, searchTerm]);

    // Mostrar notificaciones flash
    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        }
        if (flash?.error) {
            toast.error(flash.error);
        }
    }, [flash]);

    const handleCreateSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('admin.usuarios.store'), {
            onSuccess: () => {
                resetCreate();
                setIsCreateDialogOpen(false);
            },
        });
    };

    const handleEditSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingUser) return;

        put(route('admin.usuarios.update', editingUser.id), {
            onSuccess: () => {
                resetEdit();
                setIsEditDialogOpen(false);
                setEditingUser(null);
            },
        });
    };

    const handleEdit = (usuario: Usuario) => {
        setEditingUser(usuario);
        setEditData({
            name: usuario.name,
            email: usuario.email,
            role: usuario.role,
            is_active: usuario.is_active,
        });
        setIsEditDialogOpen(true);
    };

    const handleToggleStatus = (usuario: Usuario) => {
        router.patch(route('admin.usuarios.toggle-status', usuario.id));
    };

    const handleDelete = (usuario: Usuario) => {
        router.delete(route('admin.usuarios.destroy', usuario.id));
    };

    // Filtrar solicitudes por estado
    const solicitudesFiltradas = useMemo(() => {
        let filtered = solicitudes;
        if (filtroEstadoSolicitudes) {
            filtered = filtered.filter(s => s.estado === filtroEstadoSolicitudes);
        }
        return filtered;
    }, [solicitudes, filtroEstadoSolicitudes]);

    // Aprobar solicitud
    const handleAprobarSolicitud = (solicitud: SolicitudRegistro) => {
        router.post(route('admin.usuarios.solicitudes.aprobar', solicitud.id), {}, {
            onSuccess: () => {
                router.reload();
            },
        });
    };

    // Abrir modal de rechazo
    const handleAbrirRechazo = (solicitud: SolicitudRegistro) => {
        setSolicitudRechazar(solicitud);
        setObservacionesRechazo('');
        setIsRechazarDialogOpen(true);
    };

    // Rechazar solicitud
    const handleRechazarSolicitud = () => {
        if (!solicitudRechazar) return;
        router.post(route('admin.usuarios.solicitudes.rechazar', solicitudRechazar.id), {
            observaciones: observacionesRechazo,
        }, {
            onSuccess: () => {
                setIsRechazarDialogOpen(false);
                setSolicitudRechazar(null);
                setObservacionesRechazo('');
                router.reload();
            },
        });
    };

    // Cambiar filtro de estado de solicitudes
    const handleCambiarFiltroEstado = (estado: string) => {
        const estadoFiltro = estado === 'todas' ? '' : estado;
        setFiltroEstadoSolicitudes(estadoFiltro);
        router.get(route('admin.usuarios.solicitudes'), { estado: estadoFiltro }, { preserveState: true });
    };

    return (
        <AppLayoutInertia 
            title="Gestión de Usuarios - HERMES" 
            breadcrumbs={breadcrumbs}
            user={auth.user}
        >
            
            <div className="flex h-full flex-1 flex-col gap-4 p-6">
                {/* Header Compacto con Pestañas */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">Gestión de Usuarios</h1>
                        <p className="text-sm text-muted-foreground">
                            Administra los usuarios del sistema
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        {/* Pestañas */}
                        <div className="flex items-center gap-1 bg-muted p-1 rounded-lg">
                            <button
                                onClick={() => setActiveTab('usuarios')}
                                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                                    activeTab === 'usuarios'
                                        ? 'bg-background text-foreground shadow-sm'
                                        : 'text-muted-foreground hover:text-foreground'
                                }`}
                            >
                                Usuarios
                            </button>
                            <button
                                onClick={() => {
                                    setActiveTab('solicitudes');
                                    router.get(route('admin.usuarios.solicitudes'), {}, { preserveState: true });
                                }}
                                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors relative ${
                                    activeTab === 'solicitudes'
                                        ? 'bg-background text-foreground shadow-sm'
                                        : 'text-muted-foreground hover:text-foreground'
                                }`}
                            >
                                Solicitudes
                                {solicitudes.filter(s => s.estado === 'pendiente').length > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                        {solicitudes.filter(s => s.estado === 'pendiente').length}
                                    </span>
                                )}
                            </button>
                        </div>
                        {activeTab === 'usuarios' && (
                            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                                <DialogTrigger asChild>
                                    <Button className="bg-primary hover:bg-primary/90">
                                        <Plus className="h-4 w-4 mr-2" />
                                        Nuevo Usuario
                                    </Button>
                                </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>Crear Nuevo Usuario</DialogTitle>
                                <DialogDescription>
                                    Completa la información para crear un nuevo usuario en el sistema.
                                </DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleCreateSubmit}>
                                <div className="grid gap-4 py-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="create-name">Nombre Completo</Label>
                                        <Input
                                            id="create-name"
                                            value={createData.name}
                                            onChange={(e) => setCreateData('name', e.target.value)}
                                            placeholder="Ej: Dr. Juan Pérez"
                                            required
                                        />
                                        <InputError message={createErrors.name} />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="create-email">Correo Electrónico</Label>
                                        <Input
                                            id="create-email"
                                            type="email"
                                            value={createData.email}
                                            onChange={(e) => setCreateData('email', e.target.value)}
                                            placeholder="correo@ejemplo.com"
                                            required
                                        />
                                        <InputError message={createErrors.email} />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="create-role">Rol</Label>
                                        <Select value={createData.role} onValueChange={(value: 'administrador' | 'medico' | 'ips') => setCreateData('role', value)}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Selecciona un rol" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="medico">Médico</SelectItem>
                                                <SelectItem value="administrador">Administrador</SelectItem>
                                                <SelectItem value="ips">EPS</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <InputError message={createErrors.role} />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="create-password">Contraseña</Label>
                                        <Input
                                            id="create-password"
                                            type="password"
                                            value={createData.password}
                                            onChange={(e) => setCreateData('password', e.target.value)}
                                            placeholder="Mínimo 8 caracteres"
                                            required
                                        />
                                        <InputError message={createErrors.password} />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="create-password-confirmation">Confirmar Contraseña</Label>
                                        <Input
                                            id="create-password-confirmation"
                                            type="password"
                                            value={createData.password_confirmation}
                                            onChange={(e) => setCreateData('password_confirmation', e.target.value)}
                                            placeholder="Repite la contraseña"
                                            required
                                        />
                                        <InputError message={createErrors.password_confirmation} />
                                    </div>

                                    {/* Campos EPS - Siempre visibles */}
                                    <div className="grid gap-2">
                                        <Label htmlFor="create-eps">EPS <span className="text-red-500">*</span></Label>
                                        <Select value={epsSeleccionadaCreate} onValueChange={(value) => {
                                            setEpsSeleccionadaCreate(value);
                                            if (value === 'manual') {
                                                setCreateData('eps_id', null);
                                                setCreateData('eps_nombre', '');
                                                setNitManualCreate('');
                                                setCreateData('nit', '');
                                            } else {
                                                const epsItem = eps.find(e => e.id === parseInt(value));
                                                if (epsItem) {
                                                    // Siempre enviamos el nombre, no el ID (porque los IDs del JSON no son reales)
                                                    setCreateData('eps_id', null);
                                                    setCreateData('eps_nombre', epsItem.nombre);
                                                    setEpsManualCreate(epsItem.nombre);
                                                    if (epsItem.nit) {
                                                        setNitManualCreate(epsItem.nit);
                                                        setCreateData('nit', epsItem.nit);
                                                    }
                                                }
                                            }
                                        }}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Seleccione una EPS o escriba manualmente" />
                                            </SelectTrigger>
                                            <SelectContent className="max-h-60">
                                                <div className="px-2 pb-2 sticky top-0 bg-white border-b z-10">
                                                    <Input
                                                        type="text"
                                                        placeholder="Buscar EPS..."
                                                        value={searchEpsCreate}
                                                        onChange={(e) => setSearchEpsCreate(e.target.value)}
                                                        className="h-9 text-sm"
                                                        onClick={(e) => e.stopPropagation()}
                                                    />
                                                </div>
                                                <SelectItem value="manual" className="font-medium text-primary">
                                                    + Escribir EPS manualmente
                                                </SelectItem>
                                                {eps.filter(epsItem => 
                                                    epsItem.nombre.toLowerCase().includes(searchEpsCreate.toLowerCase())
                                                ).map((epsItem) => (
                                                    <SelectItem key={epsItem.id} value={epsItem.id.toString()}>
                                                        {epsItem.nombre}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {epsSeleccionadaCreate === 'manual' && (
                                            <Input
                                                id="create-eps-nombre"
                                                value={epsManualCreate}
                                                onChange={(e) => {
                                                    setEpsManualCreate(e.target.value);
                                                    setCreateData('eps_nombre', e.target.value);
                                                }}
                                                placeholder="Nombre de la EPS"
                                                required={epsSeleccionadaCreate === 'manual'}
                                            />
                                        )}
                                        <InputError message={createErrors.eps_id || createErrors.eps_nombre} />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="create-nit">NIT <span className="text-red-500">*</span></Label>
                                        <Select value={nitSeleccionadoCreate} onValueChange={(value) => {
                                            setNitSeleccionadoCreate(value);
                                            if (value === 'manual') {
                                                setCreateData('nit', '');
                                            } else {
                                                setCreateData('nit', value);
                                                setNitManualCreate(value);
                                            }
                                        }}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Seleccione un NIT o escriba manualmente" />
                                            </SelectTrigger>
                                            <SelectContent className="max-h-60">
                                                <div className="px-2 pb-2 sticky top-0 bg-white border-b z-10">
                                                    <Input
                                                        type="text"
                                                        placeholder="Buscar NIT..."
                                                        value={searchNitCreate}
                                                        onChange={(e) => setSearchNitCreate(e.target.value)}
                                                        className="h-9 text-sm"
                                                        onClick={(e) => e.stopPropagation()}
                                                    />
                                                </div>
                                                <SelectItem value="manual" className="font-medium text-primary">
                                                    + Escribir NIT manualmente
                                                </SelectItem>
                                                {nits.filter(nit =>
                                                    nit.toLowerCase().includes(searchNitCreate.toLowerCase())
                                                ).map((nit) => (
                                                    <SelectItem key={nit} value={nit}>
                                                        {nit}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {(nitSeleccionadoCreate === 'manual' || (!nitSeleccionadoCreate && nitManualCreate)) && (
                                            <Input
                                                id="create-nit"
                                                value={nitManualCreate}
                                                onChange={(e) => {
                                                    setNitManualCreate(e.target.value);
                                                    setCreateData('nit', e.target.value);
                                                }}
                                                placeholder="Número de Identificación Tributaria"
                                                required
                                            />
                                        )}
                                        <InputError message={createErrors.nit} />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="create-nombre-responsable">Nombre del Responsable <span className="text-red-500">*</span></Label>
                                        <Input
                                            id="create-nombre-responsable"
                                            value={createData.nombre_responsable}
                                            onChange={(e) => setCreateData('nombre_responsable', e.target.value)}
                                            placeholder="Ej: Dr. Juan Pérez"
                                            required
                                        />
                                        <InputError message={createErrors.nombre_responsable} />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="create-cargo-responsable">Cargo del Responsable <span className="text-red-500">*</span></Label>
                                        <Input
                                            id="create-cargo-responsable"
                                            value={createData.cargo_responsable}
                                            onChange={(e) => setCreateData('cargo_responsable', e.target.value)}
                                            placeholder="Ej: Director Médico"
                                            required
                                        />
                                        <InputError message={createErrors.cargo_responsable} />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="create-telefono">Teléfono/Contacto <span className="text-red-500">*</span></Label>
                                        <Input
                                            id="create-telefono"
                                            type="tel"
                                            value={createData.telefono}
                                            onChange={(e) => setCreateData('telefono', e.target.value)}
                                            placeholder="Ej: 3001234567"
                                            required
                                        />
                                        <InputError message={createErrors.telefono} />
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                                        Cancelar
                                    </Button>
                                    <Button type="submit" disabled={createProcessing}>
                                        {createProcessing ? 'Creando...' : 'Crear Usuario'}
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                        )}
                    </div>
                </div>

                {/* Contenido según pestaña activa */}
                {activeTab === 'usuarios' ? (
                    <>
                        {/* Grid Layout: Estadísticas a la izquierda, Tabla a la derecha */}
                        <div className="grid gap-4 lg:grid-cols-[280px_1fr] flex-1">
                    {/* Columna de Estadísticas */}
                    <div className="flex flex-col gap-3">
                        <Card className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-medium text-muted-foreground">Total Usuarios</p>
                                    <h3 className="text-2xl font-bold mt-1">{stats.total}</h3>
                                </div>
                                <UserCheck className="h-8 w-8 text-blue-600 dark:text-blue-500 opacity-60" />
                            </div>
                        </Card>

                        <Card className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-medium text-muted-foreground">Administradores</p>
                                    <h3 className="text-2xl font-bold mt-1">{stats.administradores}</h3>
                                </div>
                                <UserCheck className="h-8 w-8 text-blue-600 dark:text-blue-500 opacity-60" />
                            </div>
                        </Card>

                        <Card className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-medium text-muted-foreground">Médicos</p>
                                    <h3 className="text-2xl font-bold mt-1">{stats.medicos}</h3>
                                </div>
                                <UserCheck className="h-8 w-8 text-blue-600 dark:text-blue-500 opacity-60" />
                            </div>
                        </Card>

                        <Card className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-medium text-muted-foreground">EPS</p>
                                    <h3 className="text-2xl font-bold mt-1">{stats.eps}</h3>
                                </div>
                                <UserCheck className="h-8 w-8 text-blue-600 dark:text-blue-500 opacity-60" />
                            </div>
                        </Card>

                        <Card className="p-4 bg-blue-50 dark:bg-blue-950/20">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-medium text-blue-700 dark:text-blue-400">Usuarios Activos</p>
                                    <h3 className="text-2xl font-bold mt-1 text-blue-700 dark:text-blue-400">{stats.activos}</h3>
                                </div>
                                <UserCheck className="h-8 w-8 text-blue-600 dark:text-blue-500 opacity-70" />
                            </div>
                        </Card>
                    </div>

                    {/* Tabla de Usuarios con Buscador Integrado */}
                    <Card className="flex flex-col overflow-hidden">
                        <CardHeader className="pb-3">
                            <div className="flex items-center justify-between gap-4">
                                <div>
                                    <CardTitle className="text-lg">Lista de Usuarios</CardTitle>
                                    <CardDescription>
                                        {filteredUsuarios.length} usuario{filteredUsuarios.length !== 1 ? 's' : ''} {searchTerm ? 'encontrado' + (filteredUsuarios.length !== 1 ? 's' : '') : ''}
                                    </CardDescription>
                                </div>
                                <div className="relative w-80">
                                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        placeholder="Buscar por nombre, email o rol..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-0 flex-1 overflow-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Nombre</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Rol</TableHead>
                                    <TableHead>Estado</TableHead>
                                    <TableHead>Fecha Registro</TableHead>
                                    <TableHead className="text-right">Acciones</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredUsuarios.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                            {searchTerm ? 'No se encontraron usuarios que coincidan con la búsqueda.' : 'No hay usuarios registrados.'}
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredUsuarios.map((usuario) => (
                                    <TableRow key={usuario.id}>
                                        <TableCell className="font-medium">{usuario.name}</TableCell>
                                        <TableCell>{usuario.email}</TableCell>
                                        <TableCell>
                                            <Badge variant={usuario.role === 'administrador' ? 'default' : 'secondary'}>
                                                {usuario.role === 'administrador' ? 'Administrador' : usuario.role === 'medico' ? 'Médico' : 'EPS'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={usuario.is_active ? 'default' : 'destructive'}>
                                                {usuario.is_active ? 'Activo' : 'Inactivo'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>{new Date(usuario.created_at).toLocaleDateString()}</TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end space-x-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleEdit(usuario)}
                                                    title="Editar usuario"
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleToggleStatus(usuario)}
                                                    className={usuario.is_active ? 'text-destructive hover:text-destructive' : 'text-success hover:text-success'}
                                                    title={usuario.is_active ? 'Desactivar usuario' : 'Activar usuario'}
                                                >
                                                    {usuario.is_active ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
                                                </Button>
                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="text-destructive hover:text-destructive"
                                                            title="Eliminar usuario"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>¿Eliminar usuario?</AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                Esta acción no se puede deshacer. Se eliminará permanentemente el usuario <strong>{usuario.name}</strong> y todos sus datos asociados.
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                                            <AlertDialogAction
                                                                onClick={() => handleDelete(usuario)}
                                                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                                            >
                                                                Eliminar
                                                            </AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                        </CardContent>
                    </Card>
                </div>
                    </>
                ) : (
                    /* Vista de Solicitudes */
                    <Card className="flex flex-col overflow-hidden">
                        <CardHeader className="pb-3">
                            <div className="flex items-center justify-between gap-4">
                                <div>
                                    <CardTitle className="text-lg">Solicitudes de Registro</CardTitle>
                                    <CardDescription>
                                        {solicitudesFiltradas.length} solicitud{solicitudesFiltradas.length !== 1 ? 'es' : ''} {filtroEstadoSolicitudes ? `(${filtroEstadoSolicitudes})` : ''}
                                    </CardDescription>
                                </div>
                                <Select value={filtroEstadoSolicitudes || 'todas'} onValueChange={handleCambiarFiltroEstado}>
                                    <SelectTrigger className="w-48">
                                        <SelectValue placeholder="Filtrar por estado" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="todas">Todas</SelectItem>
                                        <SelectItem value="pendiente">Pendientes</SelectItem>
                                        <SelectItem value="aprobada">Aprobadas</SelectItem>
                                        <SelectItem value="rechazada">Rechazadas</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-0 flex-1 overflow-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>EPS/Nombre</TableHead>
                                        <TableHead>NIT</TableHead>
                                        <TableHead>Responsable</TableHead>
                                        <TableHead>Cargo</TableHead>
                                        <TableHead>Teléfono</TableHead>
                                        <TableHead>Email</TableHead>
                                        <TableHead>Estado</TableHead>
                                        <TableHead>Fecha</TableHead>
                                        <TableHead className="text-right">Acciones</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {solicitudesFiltradas.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                                                {filtroEstadoSolicitudes ? 'No se encontraron solicitudes con este estado.' : 'No hay solicitudes registradas.'}
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        solicitudesFiltradas.map((solicitud) => (
                                            <TableRow key={solicitud.id}>
                                                <TableCell className="font-medium">
                                                    {solicitud.institucion?.nombre || solicitud.ips_nombre || 'N/A'}
                                                </TableCell>
                                                <TableCell>{solicitud.nit}</TableCell>
                                                <TableCell>{solicitud.nombre_responsable}</TableCell>
                                                <TableCell>{solicitud.cargo_responsable}</TableCell>
                                                <TableCell>{solicitud.telefono}</TableCell>
                                                <TableCell>{solicitud.email}</TableCell>
                                                <TableCell>
                                                    <Badge 
                                                        variant={
                                                            solicitud.estado === 'aprobada' ? 'default' :
                                                            solicitud.estado === 'rechazada' ? 'destructive' : 'secondary'
                                                        }
                                                    >
                                                        {solicitud.estado === 'pendiente' ? 'Pendiente' :
                                                         solicitud.estado === 'aprobada' ? 'Aprobada' : 'Rechazada'}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>{new Date(solicitud.created_at).toLocaleDateString()}</TableCell>
                                                <TableCell className="text-right">
                                                    {solicitud.estado === 'pendiente' && (
                                                        <div className="flex justify-end space-x-2">
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => handleAprobarSolicitud(solicitud)}
                                                                className="text-green-600 hover:text-green-700"
                                                                title="Aprobar solicitud"
                                                            >
                                                                <CheckCircle className="h-4 w-4" />
                                                            </Button>
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => handleAbrirRechazo(solicitud)}
                                                                className="text-red-600 hover:text-red-700"
                                                                title="Rechazar solicitud"
                                                            >
                                                                <XCircle className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    )}
                                                    {solicitud.estado !== 'pendiente' && solicitud.aprobador && (
                                                        <span className="text-xs text-muted-foreground">
                                                            Por {solicitud.aprobador.name}
                                                        </span>
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                )}

                {/* Modal de Rechazo */}
                <Dialog open={isRechazarDialogOpen} onOpenChange={setIsRechazarDialogOpen}>
                    <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                            <DialogTitle>Rechazar Solicitud</DialogTitle>
                            <DialogDescription>
                                ¿Estás seguro de que deseas rechazar esta solicitud? Puedes agregar observaciones opcionales.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            {solicitudRechazar && (
                                <div className="space-y-2 text-sm">
                                    <p><strong>EPS:</strong> {solicitudRechazar.institucion?.nombre || solicitudRechazar.ips_nombre}</p>
                                    <p><strong>Responsable:</strong> {solicitudRechazar.nombre_responsable}</p>
                                    <p><strong>Email:</strong> {solicitudRechazar.email}</p>
                                </div>
                            )}
                            <div className="grid gap-2">
                                <Label htmlFor="observaciones">Observaciones (opcional)</Label>
                                <Textarea
                                    id="observaciones"
                                    value={observacionesRechazo}
                                    onChange={(e) => setObservacionesRechazo(e.target.value)}
                                    placeholder="Motivo del rechazo..."
                                    rows={4}
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsRechazarDialogOpen(false)}>
                                Cancelar
                            </Button>
                            <Button 
                                type="button" 
                                variant="destructive"
                                onClick={handleRechazarSolicitud}
                            >
                                Rechazar Solicitud
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Modal de Edición */}
                <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Editar Usuario</DialogTitle>
                            <DialogDescription>
                                Modifica la información del usuario {editingUser?.name}.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleEditSubmit}>
                            <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="edit-name">Nombre Completo</Label>
                                    <Input
                                        id="edit-name"
                                        value={editData.name}
                                        onChange={(e) => setEditData('name', e.target.value)}
                                        placeholder="Ej: Dr. Juan Pérez"
                                        required
                                    />
                                    <InputError message={editErrors.name} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="edit-email">Correo Electrónico</Label>
                                    <Input
                                        id="edit-email"
                                        type="email"
                                        value={editData.email}
                                        onChange={(e) => setEditData('email', e.target.value)}
                                        placeholder="correo@ejemplo.com"
                                        required
                                    />
                                    <InputError message={editErrors.email} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="edit-role">Rol</Label>
                                    <Select value={editData.role} onValueChange={(value: 'administrador' | 'medico' | 'ips') => setEditData('role', value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecciona un rol" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="medico">Médico</SelectItem>
                                            <SelectItem value="administrador">Administrador</SelectItem>
                                            <SelectItem value="ips">IPS</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <InputError message={editErrors.role} />
                                </div>

                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="edit-is-active"
                                        checked={editData.is_active}
                                        onCheckedChange={(checked) => setEditData('is_active', !!checked)}
                                    />
                                    <Label htmlFor="edit-is-active">Usuario activo</Label>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                                    Cancelar
                                </Button>
                                <Button type="submit" disabled={editProcessing}>
                                    {editProcessing ? 'Guardando...' : 'Guardar Cambios'}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayoutInertia>
    );
}

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
import { Plus, Edit, Trash2, UserCheck, UserX, Search } from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';
import { toast } from 'sonner';

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
    ips: number;
    activos: number;
}

interface Props {
    usuarios: Usuario[];
    stats: Stats;
}

export default function GestionUsuarios({ usuarios, stats }: Props) {
    const { auth, flash } = usePage<{ auth: { user: { name: string, role: string } }, flash: any }>().props;
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<Usuario | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    // Formulario para crear usuario
    const { data: createData, setData: setCreateData, post, processing: createProcessing, errors: createErrors, reset: resetCreate } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        role: 'medico' as 'administrador' | 'medico' | 'ips',
        is_active: true,
    });

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
    return (
        <AppLayoutInertia 
            title="Gestión de Usuarios - HERMES" 
            breadcrumbs={breadcrumbs}
            user={auth.user}
        >
            
            <div className="flex h-full flex-1 flex-col gap-4 p-6">
                {/* Header Compacto */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">Gestión de Usuarios</h1>
                        <p className="text-sm text-muted-foreground">
                            Administra los usuarios del sistema
                        </p>
                    </div>
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
                                                <SelectItem value="ips">IPS</SelectItem>
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
                </div>

                {/* Estadísticas Compactas - Bento Grid */}
                <div className="grid gap-3 grid-cols-5">
                    <Card className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-medium text-muted-foreground">Total</p>
                                <h3 className="text-2xl font-bold mt-1">{stats.total}</h3>
                            </div>
                            <UserCheck className="h-8 w-8 text-muted-foreground opacity-50" />
                        </div>
                    </Card>

                    <Card className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-medium text-muted-foreground">Admins</p>
                                <h3 className="text-2xl font-bold mt-1">{stats.administradores}</h3>
                            </div>
                            <UserCheck className="h-8 w-8 opacity-60" style={{ color: '#042077' }} />
                        </div>
                    </Card>

                    <Card className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-medium text-muted-foreground">Médicos</p>
                                <h3 className="text-2xl font-bold mt-1">{stats.medicos}</h3>
                            </div>
                            <UserCheck className="h-8 w-8 text-muted-foreground opacity-50" />
                        </div>
                    </Card>

                    <Card className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-medium text-muted-foreground">IPS</p>
                                <h3 className="text-2xl font-bold mt-1">{stats.ips}</h3>
                            </div>
                            <UserCheck className="h-8 w-8 text-muted-foreground opacity-50" />
                        </div>
                    </Card>

                    <Card className="p-4 bg-green-50 dark:bg-green-950/20">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-medium text-green-700 dark:text-green-400">Activos</p>
                                <h3 className="text-2xl font-bold mt-1 text-green-700 dark:text-green-400">{stats.activos}</h3>
                            </div>
                            <UserCheck className="h-8 w-8 text-green-600 dark:text-green-500 opacity-70" />
                        </div>
                    </Card>
                </div>

                {/* Tabla de Usuarios con Buscador Integrado */}
                <Card className="flex-1">
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
                    <CardContent className="pt-0">
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
                                                {usuario.role === 'administrador' ? 'Administrador' : usuario.role === 'medico' ? 'Médico' : 'IPS'}
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

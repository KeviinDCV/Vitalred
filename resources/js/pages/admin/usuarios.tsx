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
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm, router, usePage } from '@inertiajs/react';
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
    role: 'administrador' | 'medico';
    is_active: boolean;
    created_at: string;
}

interface Stats {
    total: number;
    administradores: number;
    medicos: number;
    activos: number;
}

interface Props {
    usuarios: Usuario[];
    stats: Stats;
}

export default function GestionUsuarios({ usuarios, stats }: Props) {
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<Usuario | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const { flash } = usePage().props as any;

    // Formulario para crear usuario
    const { data: createData, setData: setCreateData, post, processing: createProcessing, errors: createErrors, reset: resetCreate } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        role: 'medico' as 'administrador' | 'medico',
        is_active: true,
    });

    // Formulario para editar usuario
    const { data: editData, setData: setEditData, put, processing: editProcessing, errors: editErrors, reset: resetEdit } = useForm({
        name: '',
        email: '',
        role: 'medico' as 'administrador' | 'medico',
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
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Gestión de Usuarios - Vital Red" />
            
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">Gestión de Usuarios</h1>
                        <p className="text-muted-foreground mt-2">
                            Administra los usuarios del sistema de referencia y contrareferencia
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
                                        <Select value={createData.role} onValueChange={(value: 'administrador' | 'medico') => setCreateData('role', value)}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Selecciona un rol" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="medico">Médico</SelectItem>
                                                <SelectItem value="administrador">Administrador</SelectItem>
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

                {/* Estadísticas */}
                <div className="grid gap-4 md:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Usuarios</CardTitle>
                            <UserCheck className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total}</div>
                            <p className="text-xs text-muted-foreground">Usuarios registrados</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Administradores</CardTitle>
                            <UserCheck className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.administradores}</div>
                            <p className="text-xs text-muted-foreground">Usuarios admin</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Médicos</CardTitle>
                            <UserCheck className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.medicos}</div>
                            <p className="text-xs text-muted-foreground">Usuarios médicos</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Activos</CardTitle>
                            <UserCheck className="h-4 w-4 text-success" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-success">{stats.activos}</div>
                            <p className="text-xs text-muted-foreground">Usuarios activos</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Buscador */}
                <Card>
                    <CardHeader>
                        <CardTitle>Buscar Usuarios</CardTitle>
                        <CardDescription>
                            Filtra usuarios por nombre, email o rol
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder="Buscar por nombre, email o rol..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Tabla de usuarios */}
                <Card>
                    <CardHeader>
                        <CardTitle>Lista de Usuarios</CardTitle>
                        <CardDescription>
                            Gestiona todos los usuarios del sistema
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
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
                                                {usuario.role === 'administrador' ? 'Administrador' : 'Médico'}
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
                                    <Select value={editData.role} onValueChange={(value: 'administrador' | 'medico') => setEditData('role', value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecciona un rol" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="medico">Médico</SelectItem>
                                            <SelectItem value="administrador">Administrador</SelectItem>
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
        </AppLayout>
    );
}

import AppLayout from '@/layouts/app-layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Link, router, usePage } from '@inertiajs/react';
import { ArrowLeft, Plus, Search, CheckCircle2, XCircle, Edit2, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface TipoApoyo {
    id: number;
    codigo: string;
    nombre: string;
    activo: boolean;
    created_at: string;
    updated_at: string;
}

interface Props {
    apoyos: {
        data: TipoApoyo[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
    filters: {
        search?: string;
        activo?: string;
    };
    [key: string]: any;
}

export default function Apoyos() {
    const { apoyos, filters } = usePage<Props>().props;
    const [search, setSearch] = useState(filters.search || '');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingApoyo, setEditingApoyo] = useState<TipoApoyo | null>(null);
    const [formData, setFormData] = useState({
        codigo: '',
        nombre: '',
    });

    // Búsqueda en tiempo real
    const handleSearch = (value: string) => {
        setSearch(value);
        router.get('/admin/configuracion/apoyos', { search: value }, { preserveState: true });
    };

    // Crear tipo de apoyo
    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        router.post('/admin/configuracion/apoyos', formData, {
            onSuccess: () => {
                setIsCreateModalOpen(false);
                setFormData({ codigo: '', nombre: '' });
                toast.success('Tipo de apoyo creado exitosamente');
            },
            onError: (errors) => {
                Object.values(errors).forEach((error) => toast.error(error as string));
            },
        });
    };

    // Editar tipo de apoyo
    const handleEdit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingApoyo) return;

        router.put(`/admin/configuracion/apoyos/${editingApoyo.id}`, formData, {
            onSuccess: () => {
                setIsEditModalOpen(false);
                setEditingApoyo(null);
                setFormData({ codigo: '', nombre: '' });
                toast.success('Tipo de apoyo actualizado exitosamente');
            },
            onError: (errors) => {
                Object.values(errors).forEach((error) => toast.error(error as string));
            },
        });
    };

    // Cambiar estado
    const toggleStatus = (id: number) => {
        router.patch(`/admin/configuracion/apoyos/${id}/toggle`, {}, {
            onSuccess: () => toast.success('Estado actualizado'),
        });
    };

    // Eliminar
    const handleDelete = (id: number, nombre: string) => {
        if (confirm(`¿Está seguro de eliminar el tipo de apoyo ${nombre}?`)) {
            router.delete(`/admin/configuracion/apoyos/${id}`, {
                onSuccess: () => toast.success('Tipo de apoyo eliminado'),
            });
        }
    };

    // Abrir modal de edición
    const openEditModal = (apoyo: TipoApoyo) => {
        setEditingApoyo(apoyo);
        setFormData({
            codigo: apoyo.codigo,
            nombre: apoyo.nombre,
        });
        setIsEditModalOpen(true);
    };

    return (
        <AppLayout>
            <div className="space-y-4 sm:space-y-5">
                {/* Header */}
                <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <Link href="/admin/configuracion" className="text-slate-600">
                            <ArrowLeft className="h-5 w-5" />
                        </Link>
                        <div>
                            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Tipos de Apoyo</h1>
                            <p className="text-xs sm:text-sm text-slate-600 mt-1">
                                {apoyos.total} tipos de apoyo diagnóstico
                            </p>
                        </div>
                    </div>

                    {/* Botón crear */}
                    <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
                        <DialogTrigger asChild>
                            <Button className="bg-gradient-to-b from-[#042077] to-[#031852]">
                                <Plus className="h-4 w-4 mr-2" />
                                Agregar
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-md">
                            <form onSubmit={handleCreate}>
                                <DialogHeader>
                                    <DialogTitle>Nuevo Tipo de Apoyo</DialogTitle>
                                    <DialogDescription>
                                        Agregue un nuevo tipo de apoyo diagnóstico
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4 py-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="codigo">Código *</Label>
                                        <Input
                                            id="codigo"
                                            value={formData.codigo}
                                            onChange={(e) => setFormData({ ...formData, codigo: e.target.value.toUpperCase() })}
                                            placeholder="Ej: LAB"
                                            maxLength={20}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="nombre">Nombre *</Label>
                                        <Input
                                            id="nombre"
                                            value={formData.nombre}
                                            onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                                            placeholder="Ej: Laboratorio Clínico"
                                            required
                                        />
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button type="button" variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                                        Cancelar
                                    </Button>
                                    <Button type="submit" className="bg-gradient-to-b from-[#042077] to-[#031852]">
                                        Guardar
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                {/* Tabla con buscador integrado */}
                <Card className="bg-gradient-to-b from-white to-slate-50/20 border-0 shadow-[0_2px_4px_rgba(0,0,0,0.06),0_8px_20px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,1)]">
                    <CardContent className="space-y-4 p-4 sm:p-6">
                        {/* Buscador integrado */}
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    type="text"
                                    placeholder="Buscar por código o nombre..."
                                    className="pl-10"
                                    value={search}
                                    onChange={(e) => handleSearch(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Tabla */}
                        {apoyos.data.length > 0 ? (
                            <div className="space-y-4">
                                <div className="rounded-lg bg-gradient-to-b from-slate-50 to-slate-100/50 border-0 overflow-x-auto shadow-[inset_0_1px_2px_rgba(0,0,0,0.04)]">
                                    <Table>
                                        <TableHeader className="bg-slate-100 border-0">
                                            <TableRow className="border-0 hover:bg-slate-100">
                                                <TableHead>Código</TableHead>
                                                <TableHead>Nombre</TableHead>
                                                <TableHead className="text-center">Estado</TableHead>
                                                <TableHead className="text-center">Acciones</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {apoyos.data.map((apoyo) => (
                                                <TableRow 
                                                    key={apoyo.id} 
                                                    className="bg-gradient-to-b from-white to-white border-0 border-b border-slate-100 last:border-b-0 hover:from-slate-50 hover:to-white hover:shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-all duration-200"
                                                >
                                                    <TableCell>
                                                        <span className="font-mono text-sm font-semibold text-slate-900">
                                                            {apoyo.codigo}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell>
                                                        <span className="text-sm text-slate-700">{apoyo.nombre}</span>
                                                    </TableCell>
                                                    <TableCell className="text-center">
                                                        <button
                                                            onClick={() => toggleStatus(apoyo.id)}
                                                            className="inline-flex items-center"
                                                        >
                                                            {apoyo.activo ? (
                                                                <Badge className="bg-green-100 text-green-700 border-green-200">
                                                                    <CheckCircle2 className="h-3 w-3 mr-1" />
                                                                    Activo
                                                                </Badge>
                                                            ) : (
                                                                <Badge variant="outline" className="bg-gray-50">
                                                                    <XCircle className="h-3 w-3 mr-1" />
                                                                    Inactivo
                                                                </Badge>
                                                            )}
                                                        </button>
                                                    </TableCell>
                                                    <TableCell className="text-center">
                                                        <div className="flex items-center justify-center gap-2">
                                                            <Button
                                                                size="sm"
                                                                variant="ghost"
                                                                onClick={() => openEditModal(apoyo)}
                                                                className="h-8 w-8 p-0"
                                                            >
                                                                <Edit2 className="h-4 w-4" />
                                                            </Button>
                                                            <Button
                                                                size="sm"
                                                                variant="ghost"
                                                                onClick={() => handleDelete(apoyo.id, apoyo.nombre)}
                                                                className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>

                                {/* Paginación */}
                                {apoyos.last_page > 1 && (
                                    <div className="flex items-center justify-between pt-2">
                                        <div className="text-sm text-slate-600">
                                            Página {apoyos.current_page} de {apoyos.last_page}
                                        </div>
                                        <div className="flex gap-2">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                disabled={apoyos.current_page === 1}
                                                onClick={() => router.get(`/admin/configuracion/apoyos?page=${apoyos.current_page - 1}&search=${search}`)}
                                            >
                                                Anterior
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                disabled={apoyos.current_page === apoyos.last_page}
                                                onClick={() => router.get(`/admin/configuracion/apoyos?page=${apoyos.current_page + 1}&search=${search}`)}
                                            >
                                                Siguiente
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="text-center p-8 text-slate-500">
                                No se encontraron resultados
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Modal de edición */}
                <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                    <DialogContent className="max-w-md">
                        <form onSubmit={handleEdit}>
                            <DialogHeader>
                                <DialogTitle>Editar Tipo de Apoyo</DialogTitle>
                                <DialogDescription>
                                    Modifique los datos del tipo de apoyo
                                </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                    <Label htmlFor="edit_codigo">Código *</Label>
                                    <Input
                                        id="edit_codigo"
                                        value={formData.codigo}
                                        onChange={(e) => setFormData({ ...formData, codigo: e.target.value.toUpperCase() })}
                                        maxLength={20}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="edit_nombre">Nombre *</Label>
                                    <Input
                                        id="edit_nombre"
                                        value={formData.nombre}
                                        onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={() => setIsEditModalOpen(false)}>
                                    Cancelar
                                </Button>
                                <Button type="submit" className="bg-gradient-to-b from-[#042077] to-[#031852]">
                                    Actualizar
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}

import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link, usePage } from '@inertiajs/react';
import { 
    FileText, 
    Building2, 
    Shield, 
    Stethoscope, 
    BedDouble, 
    HeartPulse,
    ArrowRight,
    CheckCircle2,
    XCircle
} from 'lucide-react';

interface Estadisticas {
    cie10: {
        total: number;
        activos: number;
        inactivos: number;
    };
    instituciones: {
        total: number;
        activos: number;
        inactivos: number;
        nacional: number;
        policia: number;
    };
    aseguradores: {
        total: number;
        activos: number;
        inactivos: number;
    };
    especialidades: {
        total: number;
        activos: number;
        inactivos: number;
    };
    servicios: {
        total: number;
        activos: number;
        inactivos: number;
    };
    apoyos: {
        total: number;
        activos: number;
        inactivos: number;
    };
}

export default function ConfiguracionIndex() {
    const { estadisticas } = usePage<{ estadisticas: Estadisticas }>().props;

    const catalogos = [
        {
            titulo: 'Códigos CIE-10',
            descripcion: 'Diagnósticos médicos según la Clasificación Internacional de Enfermedades',
            icon: FileText,
            href: '/admin/configuracion/cie10',
            stats: estadisticas.cie10,
            color: 'blue',
        },
        {
            titulo: 'Instituciones',
            descripcion: 'IPS Nacional y Policía Nacional - Instituciones prestadoras de salud',
            icon: Building2,
            href: '/admin/configuracion/instituciones',
            stats: estadisticas.instituciones,
            color: 'green',
            extra: `${estadisticas.instituciones.nacional} Nacional, ${estadisticas.instituciones.policia} Policía`,
        },
        {
            titulo: 'Aseguradores',
            descripcion: 'EPS, ARL, SOAT y demás aseguradores del sistema de salud',
            icon: Shield,
            href: '/admin/configuracion/aseguradores',
            stats: estadisticas.aseguradores,
            color: 'purple',
        },
        {
            titulo: 'Especialidades Médicas',
            descripcion: 'Especialidades y subespecialidades disponibles para remisión',
            icon: Stethoscope,
            href: '/admin/configuracion/especialidades',
            stats: estadisticas.especialidades,
            color: 'orange',
        },
        {
            titulo: 'Tipos de Servicio',
            descripcion: 'Servicios hospitalarios disponibles (UCI, Hospitalización, etc.)',
            icon: BedDouble,
            href: '/admin/configuracion/servicios',
            stats: estadisticas.servicios,
            color: 'red',
        },
        {
            titulo: 'Tipos de Apoyo',
            descripcion: 'Apoyos diagnósticos y terapéuticos disponibles',
            icon: HeartPulse,
            href: '/admin/configuracion/apoyos',
            stats: estadisticas.apoyos,
            color: 'cyan',
        },
    ];

    const getColorClasses = (color: string) => {
        const colors = {
            blue: 'from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700',
            green: 'from-green-500 to-green-600 hover:from-green-600 hover:to-green-700',
            purple: 'from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700',
            orange: 'from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700',
            red: 'from-red-500 to-red-600 hover:from-red-600 hover:to-red-700',
            cyan: 'from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700',
        };
        return colors[color as keyof typeof colors] || colors.blue;
    };

    return (
        <AppLayout>
            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Configuración del Sistema</h1>
                    <p className="text-gray-600 mt-2">
                        Gestiona los catálogos y campos seleccionables del sistema
                    </p>
                </div>

                {/* Información */}
                <Card className="border-blue-200 bg-blue-50/50">
                    <CardContent className="pt-6">
                        <div className="flex items-start gap-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <FileText className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-blue-900">Gestión de Catálogos</h3>
                                <p className="text-sm text-blue-700 mt-1">
                                    Los catálogos son campos seleccionables que aparecen en los formularios del sistema.
                                    Puedes agregar, editar o desactivar registros según las necesidades de tu institución.
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Grid de Catálogos */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {catalogos.map((catalogo, index) => {
                        const Icon = catalogo.icon;
                        
                        return (
                            <Link key={index} href={catalogo.href}>
                                <Card className="group hover:shadow-lg transition-all duration-200 border-2 hover:border-gray-300 cursor-pointer h-full">
                                    <CardHeader>
                                        <div className="flex items-start justify-between">
                                            <div className={`p-3 rounded-xl bg-gradient-to-br ${getColorClasses(catalogo.color)} text-white group-hover:scale-110 transition-transform`}>
                                                <Icon className="h-6 w-6" />
                                            </div>
                                            <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1 transition-all" />
                                        </div>
                                        <CardTitle className="mt-4">{catalogo.titulo}</CardTitle>
                                        <CardDescription className="text-sm">
                                            {catalogo.descripcion}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                        {/* Estadísticas */}
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-gray-600">Total de registros</span>
                                            <Badge variant="secondary" className="font-bold">
                                                {catalogo.stats.total.toLocaleString()}
                                            </Badge>
                                        </div>
                                        
                                        <div className="flex gap-2">
                                            <div className="flex items-center gap-1 text-xs text-green-600">
                                                <CheckCircle2 className="h-3.5 w-3.5" />
                                                <span>{catalogo.stats.activos} activos</span>
                                            </div>
                                            <div className="flex items-center gap-1 text-xs text-gray-500">
                                                <XCircle className="h-3.5 w-3.5" />
                                                <span>{catalogo.stats.inactivos} inactivos</span>
                                            </div>
                                        </div>

                                        {catalogo.extra && (
                                            <div className="pt-2 border-t text-xs text-gray-600">
                                                {catalogo.extra}
                                            </div>
                                        )}

                                        <Button 
                                            variant="outline" 
                                            className="w-full group-hover:bg-gray-50"
                                            asChild
                                        >
                                            <span>
                                                Gestionar Catálogo
                                                <ArrowRight className="ml-2 h-4 w-4" />
                                            </span>
                                        </Button>
                                    </CardContent>
                                </Card>
                            </Link>
                        );
                    })}
                </div>

                {/* Footer Info */}
                <Card className="border-gray-200">
                    <CardContent className="pt-6">
                        <div className="flex items-start gap-3">
                            <div className="p-2 bg-gray-100 rounded-lg">
                                <CheckCircle2 className="h-5 w-5 text-gray-600" />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-semibold text-gray-900">Estado del Sistema</h3>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-3 text-sm">
                                    <div>
                                        <span className="text-gray-600">Total de registros:</span>
                                        <p className="font-bold text-lg">
                                            {(
                                                estadisticas.cie10.total +
                                                estadisticas.instituciones.total +
                                                estadisticas.aseguradores.total +
                                                estadisticas.especialidades.total +
                                                estadisticas.servicios.total +
                                                estadisticas.apoyos.total
                                            ).toLocaleString()}
                                        </p>
                                    </div>
                                    <div>
                                        <span className="text-gray-600">Registros activos:</span>
                                        <p className="font-bold text-lg text-green-600">
                                            {(
                                                estadisticas.cie10.activos +
                                                estadisticas.instituciones.activos +
                                                estadisticas.aseguradores.activos +
                                                estadisticas.especialidades.activos +
                                                estadisticas.servicios.activos +
                                                estadisticas.apoyos.activos
                                            ).toLocaleString()}
                                        </p>
                                    </div>
                                    <div>
                                        <span className="text-gray-600">Registros inactivos:</span>
                                        <p className="font-bold text-lg text-gray-500">
                                            {(
                                                estadisticas.cie10.inactivos +
                                                estadisticas.instituciones.inactivos +
                                                estadisticas.aseguradores.inactivos +
                                                estadisticas.especialidades.inactivos +
                                                estadisticas.servicios.inactivos +
                                                estadisticas.apoyos.inactivos
                                            ).toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}

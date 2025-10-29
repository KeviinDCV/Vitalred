import AppLayout from '@/layouts/app-layout';
import { Card, CardContent } from '@/components/ui/card';
import { Link, usePage } from '@inertiajs/react';
import { 
    Building2, 
    Shield, 
    Stethoscope, 
    BedDouble, 
    HeartPulse,
    ArrowRight,
    CheckCircle2,
    XCircle,
    FileText
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
        },
        {
            titulo: 'Instituciones',
            descripcion: 'IPS Nacional y Policía Nacional - Instituciones prestadoras de salud',
            icon: Building2,
            href: '/admin/configuracion/instituciones',
            stats: estadisticas.instituciones,
            extra: `${estadisticas.instituciones.nacional} Nacional, ${estadisticas.instituciones.policia} Policía`,
        },
        {
            titulo: 'Aseguradores',
            descripcion: 'EPS, ARL, SOAT y demás aseguradores del sistema de salud',
            icon: Shield,
            href: '/admin/configuracion/aseguradores',
            stats: estadisticas.aseguradores,
        },
        {
            titulo: 'Especialidades Médicas',
            descripcion: 'Especialidades y subespecialidades disponibles para remisión',
            icon: Stethoscope,
            href: '/admin/configuracion/especialidades',
            stats: estadisticas.especialidades,
        },
        {
            titulo: 'Tipos de Servicio',
            descripcion: 'Servicios hospitalarios disponibles (UCI, Hospitalización, etc.)',
            icon: BedDouble,
            href: '/admin/configuracion/servicios',
            stats: estadisticas.servicios,
        },
        {
            titulo: 'Tipos de Apoyo',
            descripcion: 'Apoyos diagnósticos y terapéuticos disponibles',
            icon: HeartPulse,
            href: '/admin/configuracion/apoyos',
            stats: estadisticas.apoyos,
        },
    ];

    return (
        <AppLayout>
            <div className="space-y-4 sm:space-y-5">
                {/* Header simplificado */}
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Configuración del Sistema</h1>
                    <p className="text-xs sm:text-sm text-slate-600 mt-1">
                        Gestiona los catálogos y campos seleccionables
                    </p>
                </div>

                {/* Grid de Catálogos compacto */}
                <div className="grid gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {catalogos.map((catalogo, index) => {
                        const Icon = catalogo.icon;
                        
                        return (
                            <Link key={index} href={catalogo.href}>
                                <Card className="bg-gradient-to-b from-white to-slate-50/20 border-0 shadow-[0_2px_4px_rgba(0,0,0,0.06),0_8px_20px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,1)] rounded-lg cursor-pointer">
                                    <CardContent className="p-3 sm:p-4">
                                        {/* Header compacto */}
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center gap-2.5">
                                                <div className="p-2 rounded-lg bg-gradient-to-br from-[#042077] to-[#031852] text-white shadow-[0_2px_4px_rgba(4,32,119,0.3),inset_0_1px_0_rgba(255,255,255,0.3)]">
                                                    <Icon className="h-4 w-4" />
                                                </div>
                                                <div>
                                                    <h3 className="text-sm font-semibold text-slate-900">{catalogo.titulo}</h3>
                                                    <p className="text-xs text-slate-500">{catalogo.stats.total.toLocaleString()} registros</p>
                                                </div>
                                            </div>
                                            <ArrowRight className="h-4 w-4 text-slate-400" />
                                        </div>

                                        {/* Stats inline compactas */}
                                        <div className="flex items-center gap-3 text-xs mb-2">
                                            <div className="flex items-center gap-1 text-green-600">
                                                <CheckCircle2 className="h-3 w-3" />
                                                <span>{catalogo.stats.activos}</span>
                                            </div>
                                            <div className="flex items-center gap-1 text-slate-400">
                                                <XCircle className="h-3 w-3" />
                                                <span>{catalogo.stats.inactivos}</span>
                                            </div>
                                            {catalogo.extra && (
                                                <span className="text-slate-500 text-[10px] ml-auto">{catalogo.extra}</span>
                                            )}
                                        </div>

                                        {/* Descripción más corta */}
                                        <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-2">
                                            {catalogo.descripcion}
                                        </p>
                                    </CardContent>
                                </Card>
                            </Link>
                        );
                    })}
                </div>

                {/* Footer de estadísticas compacto */}
                <Card className="bg-gradient-to-b from-white to-slate-50/20 border-0 shadow-[0_2px_4px_rgba(0,0,0,0.06),0_8px_20px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,1)] rounded-lg">
                    <CardContent className="p-3 sm:p-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="h-4 w-4 text-slate-600" />
                                <span className="text-sm font-medium text-slate-900">Estado del Sistema</span>
                            </div>
                            <div className="flex items-center gap-4 sm:gap-6 text-xs">
                                <div>
                                    <span className="text-slate-500">Total:</span>
                                    <span className="font-semibold text-slate-900 ml-1.5">
                                        {(
                                            estadisticas.cie10.total +
                                            estadisticas.instituciones.total +
                                            estadisticas.aseguradores.total +
                                            estadisticas.especialidades.total +
                                            estadisticas.servicios.total +
                                            estadisticas.apoyos.total
                                        ).toLocaleString()}
                                    </span>
                                </div>
                                <div>
                                    <span className="text-green-600">Activos:</span>
                                    <span className="font-semibold text-green-600 ml-1.5">
                                        {(
                                            estadisticas.cie10.activos +
                                            estadisticas.instituciones.activos +
                                            estadisticas.aseguradores.activos +
                                            estadisticas.especialidades.activos +
                                            estadisticas.servicios.activos +
                                            estadisticas.apoyos.activos
                                        ).toLocaleString()}
                                    </span>
                                </div>
                                <div className="hidden sm:flex items-center gap-1.5">
                                    <span className="text-slate-400">Inactivos:</span>
                                    <span className="font-semibold text-slate-500">
                                        {(
                                            estadisticas.cie10.inactivos +
                                            estadisticas.instituciones.inactivos +
                                            estadisticas.aseguradores.inactivos +
                                            estadisticas.especialidades.inactivos +
                                            estadisticas.servicios.inactivos +
                                            estadisticas.apoyos.inactivos
                                        ).toLocaleString()}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}

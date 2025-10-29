<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\CodigoCIE10;
use App\Models\Institucion;
use App\Models\Asegurador;
use App\Models\Especialidad;
use App\Models\TipoServicio;
use App\Models\TipoApoyo;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ConfiguracionController extends Controller
{
    /**
     * Mostrar página principal de configuración con estadísticas de catálogos
     */
    public function index()
    {
        $estadisticas = [
            'cie10' => [
                'total' => CodigoCIE10::count(),
                'activos' => CodigoCIE10::activos()->count(),
                'inactivos' => CodigoCIE10::where('activo', false)->count(),
            ],
            'instituciones' => [
                'total' => Institucion::count(),
                'activos' => Institucion::activas()->count(),
                'inactivos' => Institucion::where('activo', false)->count(),
                'nacional' => Institucion::tipo('nacional')->count(),
                'policia' => Institucion::tipo('policia')->count(),
            ],
            'aseguradores' => [
                'total' => Asegurador::count(),
                'activos' => Asegurador::activos()->count(),
                'inactivos' => Asegurador::where('activo', false)->count(),
            ],
            'especialidades' => [
                'total' => Especialidad::count(),
                'activos' => Especialidad::activas()->count(),
                'inactivos' => Especialidad::where('activo', false)->count(),
            ],
            'servicios' => [
                'total' => TipoServicio::count(),
                'activos' => TipoServicio::activos()->count(),
                'inactivos' => TipoServicio::where('activo', false)->count(),
            ],
            'apoyos' => [
                'total' => TipoApoyo::count(),
                'activos' => TipoApoyo::activos()->count(),
                'inactivos' => TipoApoyo::where('activo', false)->count(),
            ],
        ];

        return Inertia::render('admin/configuracion/index', [
            'estadisticas' => $estadisticas,
        ]);
    }

    /**
     * Gestión de Códigos CIE-10
     */
    public function cie10(Request $request)
    {
        $query = CodigoCIE10::query();

        // Búsqueda
        if ($request->has('search') && !empty($request->search)) {
            $query->buscar($request->search);
        }

        // Filtro por estado
        if ($request->has('activo')) {
            $query->where('activo', $request->activo === 'true' || $request->activo === '1');
        }

        $codigos = $query->orderBy('codigo')->paginate(50);

        return Inertia::render('admin/configuracion/cie10', [
            'codigos' => $codigos,
            'filters' => $request->only(['search', 'activo']),
        ]);
    }

    /**
     * Gestión de Instituciones
     */
    public function instituciones(Request $request)
    {
        $query = Institucion::query();

        // Búsqueda
        if ($request->has('search') && !empty($request->search)) {
            $query->buscar($request->search);
        }

        // Filtro por tipo
        if ($request->has('tipo') && !empty($request->tipo)) {
            $query->tipo($request->tipo);
        }

        // Filtro por estado
        if ($request->has('activo')) {
            $query->where('activo', $request->activo === 'true' || $request->activo === '1');
        }

        $instituciones = $query->orderBy('nombre')->paginate(50);

        return Inertia::render('admin/configuracion/instituciones', [
            'instituciones' => $instituciones,
            'filters' => $request->only(['search', 'tipo', 'activo']),
        ]);
    }

    /**
     * Gestión de Aseguradores
     */
    public function aseguradores(Request $request)
    {
        $query = Asegurador::query();

        if ($request->has('search') && !empty($request->search)) {
            $query->buscar($request->search);
        }

        if ($request->has('tipo') && !empty($request->tipo)) {
            $query->tipo($request->tipo);
        }

        if ($request->has('activo')) {
            $query->where('activo', $request->activo === 'true' || $request->activo === '1');
        }

        $aseguradores = $query->orderBy('nombre')->paginate(50);

        return Inertia::render('admin/configuracion/aseguradores', [
            'aseguradores' => $aseguradores,
            'filters' => $request->only(['search', 'tipo', 'activo']),
        ]);
    }

    /**
     * Gestión de Especialidades
     */
    public function especialidades(Request $request)
    {
        $query = Especialidad::query();

        if ($request->has('search') && !empty($request->search)) {
            $query->buscar($request->search);
        }

        if ($request->has('activo')) {
            $query->where('activo', $request->activo === 'true' || $request->activo === '1');
        }

        $especialidades = $query->orderBy('nombre')->paginate(50);

        return Inertia::render('admin/configuracion/especialidades', [
            'especialidades' => $especialidades,
            'filters' => $request->only(['search', 'activo']),
        ]);
    }

    /**
     * Gestión de Tipos de Servicio
     */
    public function servicios(Request $request)
    {
        $query = TipoServicio::query();

        if ($request->has('search') && !empty($request->search)) {
            $query->buscar($request->search);
        }

        if ($request->has('activo')) {
            $query->where('activo', $request->activo === 'true' || $request->activo === '1');
        }

        $servicios = $query->orderBy('nombre')->paginate(50);

        return Inertia::render('admin/configuracion/servicios', [
            'servicios' => $servicios,
            'filters' => $request->only(['search', 'activo']),
        ]);
    }

    /**
     * Gestión de Tipos de Apoyo
     */
    public function apoyos(Request $request)
    {
        $query = TipoApoyo::query();

        if ($request->has('search') && !empty($request->search)) {
            $query->buscar($request->search);
        }

        if ($request->has('activo')) {
            $query->where('activo', $request->activo === 'true' || $request->activo === '1');
        }

        $apoyos = $query->orderBy('nombre')->paginate(50);

        return Inertia::render('admin/configuracion/apoyos', [
            'apoyos' => $apoyos,
            'filters' => $request->only(['search', 'activo']),
        ]);
    }
}

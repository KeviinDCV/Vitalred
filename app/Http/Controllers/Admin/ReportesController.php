<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\RegistroMedico;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ReportesController extends Controller
{
    public function index()
    {
        $reportes = [
            'registros_por_mes' => RegistroMedico::selectRaw('MONTH(created_at) as mes, COUNT(*) as total')
                ->whereYear('created_at', now()->year)
                ->groupBy('mes')
                ->get(),
            'usuarios_por_rol' => User::selectRaw('role, COUNT(*) as total')->groupBy('role')->get(),
            'diagnosticos_frecuentes' => RegistroMedico::selectRaw('diagnostico_principal, COUNT(*) as total')
                ->groupBy('diagnostico_principal')
                ->orderBy('total', 'desc')
                ->take(10)
                ->get(),
        ];

        return Inertia::render('admin/reportes', [
            'reportes' => $reportes,
            'user' => auth()->user(),
        ]);
    }

    public function generar(Request $request)
    {
        $validated = $request->validate([
            'tipo' => 'required|in:registros,usuarios,diagnosticos,completo',
            'periodo' => 'required|in:mes,trimestre,semestre,año',
            'formato' => 'required|in:pdf,excel,csv'
        ]);

        $data = $this->obtenerDatosReporte($validated['tipo'], $validated['periodo']);

        return response()->json([
            'message' => 'Reporte generado exitosamente',
            'data' => $data,
            'tipo' => $validated['tipo'],
            'periodo' => $validated['periodo']
        ]);
    }

    private function obtenerDatosReporte($tipo, $periodo)
    {
        $fechaInicio = $this->obtenerFechaInicio($periodo);
        
        switch($tipo) {
            case 'registros':
                return RegistroMedico::where('created_at', '>=', $fechaInicio)->count();
            case 'usuarios':
                return User::where('created_at', '>=', $fechaInicio)->count();
            case 'diagnosticos':
                return RegistroMedico::where('created_at', '>=', $fechaInicio)
                    ->selectRaw('diagnostico_principal, COUNT(*) as total')
                    ->groupBy('diagnostico_principal')
                    ->orderBy('total', 'desc')
                    ->get();
            default:
                return ['registros' => RegistroMedico::count(), 'usuarios' => User::count()];
        }
    }

    private function obtenerFechaInicio($periodo)
    {
        return match($periodo) {
            'mes' => now()->startOfMonth(),
            'trimestre' => now()->startOfQuarter(),
            'semestre' => now()->subMonths(6),
            'año' => now()->startOfYear(),
            default => now()->startOfMonth()
        };
    }
}
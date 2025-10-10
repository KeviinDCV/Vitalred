<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\RegistroMedico;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MonitoreoController extends Controller
{
    public function index()
    {
        $metricas = [
            'usuarios_activos' => User::where('is_active', true)->count(),
            'registros_hoy' => RegistroMedico::whereDate('created_at', today())->count(),
            'registros_semana' => RegistroMedico::whereBetween('created_at', [now()->startOfWeek(), now()->endOfWeek()])->count(),
            'usuarios_por_rol' => User::selectRaw('role, COUNT(*) as total')->groupBy('role')->get(),
        ];

        $actividad_reciente = RegistroMedico::with('user')
            ->orderBy('created_at', 'desc')
            ->take(10)
            ->get();

        return Inertia::render('admin/monitoreo', [
            'metricas' => $metricas,
            'actividad_reciente' => $actividad_reciente,
            'user' => auth()->user(),
        ]);
    }
}
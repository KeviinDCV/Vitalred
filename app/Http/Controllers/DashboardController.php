<?php

namespace App\Http\Controllers;

use App\Models\RegistroMedico;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        
        $estadisticas = [
            'total_usuarios' => User::count(),
            'total_registros' => RegistroMedico::count(),
            'registros_hoy' => RegistroMedico::whereDate('created_at', today())->count(),
            'usuarios_activos' => User::where('is_active', true)->count(),
        ];

        $actividad_reciente = RegistroMedico::with('user')
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get();

        return Inertia::render('dashboard', [
            'estadisticas' => $estadisticas,
            'actividad_reciente' => $actividad_reciente,
            'user' => $user,
        ]);
    }
}
<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\RegistroMedico;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ReferenciasController extends Controller
{
    public function index()
    {
        $referencias = RegistroMedico::with('user')
            ->orderBy('created_at', 'desc')
            ->paginate(15);

        $estadisticas = [
            'total_referencias' => RegistroMedico::count(),
            'referencias_mes' => RegistroMedico::whereMonth('created_at', now()->month)->count(),
            'por_especialidad' => RegistroMedico::selectRaw('diagnostico_principal, COUNT(*) as total')
                ->groupBy('diagnostico_principal')
                ->orderBy('total', 'desc')
                ->take(5)
                ->get(),
        ];

        return Inertia::render('admin/referencias', [
            'referencias' => $referencias,
            'estadisticas' => $estadisticas,
            'user' => auth()->user(),
        ]);
    }
}
<?php

namespace App\Http\Controllers\Medico;

use App\Http\Controllers\Controller;
use App\Models\RegistroMedico;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SeguimientoController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        
        $seguimiento = [
            'mis_registros' => RegistroMedico::where('user_id', $user->id)->count(),
            'registros_mes' => RegistroMedico::where('user_id', $user->id)
                ->whereMonth('created_at', now()->month)->count(),
            'registros_recientes' => RegistroMedico::where('user_id', $user->id)
                ->orderBy('created_at', 'desc')
                ->take(10)
                ->get(),
            'diagnosticos_frecuentes' => RegistroMedico::where('user_id', $user->id)
                ->selectRaw('diagnostico_principal, COUNT(*) as total')
                ->groupBy('diagnostico_principal')
                ->orderBy('total', 'desc')
                ->take(5)
                ->get(),
        ];

        return Inertia::render('medico/seguimiento', [
            'seguimiento' => $seguimiento,
            'user' => $user,
        ]);
    }
}
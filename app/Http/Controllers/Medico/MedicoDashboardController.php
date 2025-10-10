<?php

namespace App\Http\Controllers\Medico;

use App\Http\Controllers\Controller;
use App\Models\RegistroMedico;
use App\Models\AnalisisPruebaIA;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MedicoDashboardController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        
        $estadisticas = [
            'registros_totales' => RegistroMedico::where('user_id', $user->id)->count(),
            'registros_mes' => RegistroMedico::where('user_id', $user->id)
                ->whereMonth('created_at', now()->month)->count(),
            'casos_criticos' => RegistroMedico::where('user_id', $user->id)
                ->whereIn('clasificacion_triage', ['1', '2'])->count(),
            'analisis_ia' => AnalisisPruebaIA::where('user_id', $user->id)->count(),
        ];

        $registros_recientes = RegistroMedico::where('user_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get();

        $analisis_recientes = AnalisisPruebaIA::where('user_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->take(3)
            ->get();

        return Inertia::render('medico/medico-dashboard', [
            'estadisticas' => $estadisticas,
            'registros_recientes' => $registros_recientes,
            'analisis_recientes' => $analisis_recientes,
            'user' => $user,
        ]);
    }
}
<?php

namespace App\Http\Controllers\Medico;

use App\Http\Controllers\Controller;
use App\Models\RegistroMedico;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CasosCriticosController extends Controller
{
    public function index()
    {
        $casos_criticos = RegistroMedico::where(function($query) {
            $query->where('clasificacion_triage', '1')
                  ->orWhere('clasificacion_triage', '2')
                  ->orWhere('diagnostico_principal', 'like', '%urgente%')
                  ->orWhere('diagnostico_principal', 'like', '%critico%');
        })
        ->with('user')
        ->orderBy('created_at', 'desc')
        ->paginate(10);

        $estadisticas = [
            'total_criticos' => $casos_criticos->total(),
            'triage_1' => RegistroMedico::where('clasificacion_triage', '1')->count(),
            'triage_2' => RegistroMedico::where('clasificacion_triage', '2')->count(),
        ];

        return Inertia::render('medico/casos-criticos', [
            'casos_criticos' => $casos_criticos,
            'estadisticas' => $estadisticas,
            'user' => auth()->user(),
        ]);
    }
}
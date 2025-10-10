<?php

namespace App\Http\Controllers;

use App\Models\RegistroMedico;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class CacheController extends Controller
{
    public function getEstadisticas()
    {
        return Cache::remember('estadisticas_dashboard', 300, function () {
            return [
                'total_usuarios' => User::count(),
                'total_registros' => RegistroMedico::count(),
                'registros_hoy' => RegistroMedico::whereDate('created_at', today())->count(),
                'usuarios_activos' => User::where('is_active', true)->count(),
            ];
        });
    }

    public function getRegistrosRecientes()
    {
        return Cache::remember('registros_recientes', 60, function () {
            return RegistroMedico::with('user')
                ->orderBy('created_at', 'desc')
                ->take(10)
                ->get();
        });
    }

    public function limpiarCache()
    {
        Cache::flush();
        return response()->json(['message' => 'Cache limpiado exitosamente']);
    }
}
<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\RegistroMedico;
use App\Models\SolicitudIps;
use Illuminate\Http\Request;

class IpsApiController extends Controller
{
    public function estadisticas()
    {
        $user = auth()->user();
        
        $stats = [
            'total_registros' => RegistroMedico::where('user_id', $user->id)->count(),
            'registros_mes' => RegistroMedico::where('user_id', $user->id)
                ->whereMonth('created_at', now()->month)->count(),
            'solicitudes_pendientes' => SolicitudIps::where('user_id', $user->id)
                ->where('estado', 'pendiente')->count(),
            'tasa_aceptacion' => $this->calcularTasaAceptacion($user->id),
        ];

        return response()->json($stats);
    }

    private function calcularTasaAceptacion($userId)
    {
        $total = SolicitudIps::where('user_id', $userId)->count();
        $aceptadas = SolicitudIps::where('user_id', $userId)
            ->where('estado', 'aceptada')->count();
            
        return $total > 0 ? round(($aceptadas / $total) * 100, 1) : 0;
    }
}
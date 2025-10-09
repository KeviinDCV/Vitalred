<?php

namespace App\Http\Controllers\Ips;

use App\Http\Controllers\Controller;
use App\Models\RegistroMedico;
use Illuminate\Http\Request;
use Inertia\Inertia;

class IpsController extends Controller
{
    /**
     * Mostrar el dashboard de IPS
     */
    public function dashboard()
    {
        $user = auth()->user();
        
        // Obtener estadísticas básicas para IPS
        $totalRegistros = RegistroMedico::count();
        $registrosRecientes = RegistroMedico::with('user')
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get();

        return Inertia::render('ips/ips-dashboard', [
            'user' => $user,
            'totalRegistros' => $totalRegistros,
            'registrosRecientes' => $registrosRecientes,
        ]);
    }

    /**
     * Mostrar solicitudes de IPS
     */
    public function solicitudes()
    {
        return Inertia::render('ips/solicitudes');
    }

    /**
     * Mostrar seguimiento de IPS
     */
    public function seguimiento()
    {
        return Inertia::render('ips/seguimiento-ips');
    }

    /**
     * Ingresar registro médico (IPS puede usar la misma funcionalidad que médico)
     */
    public function ingresarRegistro()
    {
        return Inertia::render('medico/ingresar-registro');
    }
}
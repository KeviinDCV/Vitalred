<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\RegistroMedico;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SupervisionController extends Controller
{
    public function index()
    {
        $supervision = [
            'medicos_activos' => User::where('role', 'medico')->where('is_active', true)->count(),
            'ips_activas' => User::where('role', 'ips')->where('is_active', true)->count(),
            'registros_pendientes' => RegistroMedico::whereNull('fecha_respuesta')->count(),
            'actividad_usuarios' => User::with(['registrosMedicos' => function($query) {
                $query->whereMonth('created_at', now()->month);
            }])->where('role', '!=', 'administrador')->get(),
        ];

        return Inertia::render('admin/supervision', [
            'supervision' => $supervision,
            'user' => auth()->user(),
        ]);
    }
}
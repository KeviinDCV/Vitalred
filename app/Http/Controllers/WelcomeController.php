<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class WelcomeController extends Controller
{
    public function index()
    {
        $estadisticas = [
            'usuarios_registrados' => 1250,
            'registros_procesados' => 8500,
            'instituciones_conectadas' => 45,
            'tiempo_promedio_respuesta' => '2.3 horas',
        ];

        return Inertia::render('welcome', [
            'estadisticas' => $estadisticas,
        ]);
    }
}
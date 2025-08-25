<?php

namespace App\Http\Controllers\Medico;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MedicoController extends Controller
{
    /**
     * Mostrar la página de Ingresar Registro
     */
    public function ingresarRegistro()
    {
        return Inertia::render('medico/ingresar-registro');
    }

    /**
     * Mostrar la página de Consulta Pacientes
     */
    public function consultaPacientes()
    {
        return Inertia::render('medico/consulta-pacientes');
    }
}

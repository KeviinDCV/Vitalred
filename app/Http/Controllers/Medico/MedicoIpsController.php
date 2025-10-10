<?php

namespace App\Http\Controllers\Medico;

use App\Http\Controllers\Controller;
use App\Models\RegistroMedico;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MedicoIpsController extends Controller
{
    public function storeRegistroIps(Request $request)
    {
        $validated = $request->validate([
            'tipo_identificacion' => 'required|in:CC,TI,CE,RC,PA',
            'numero_identificacion' => 'required|string|max:20',
            'nombre' => 'required|string|max:100',
            'apellidos' => 'required|string|max:100',
            'fecha_nacimiento' => 'required|date',
            'sexo' => 'required|in:M,F',
            'asegurador' => 'required|string|max:100',
            'departamento' => 'required|string|max:50',
            'ciudad' => 'required|string|max:50',
            'diagnostico_principal' => 'required|string',
            'motivo_consulta' => 'required|string',
            'enfermedad_actual' => 'required|string',
            'antecedentes' => 'nullable|string',
            'frecuencia_cardiaca' => 'nullable|numeric',
            'frecuencia_respiratoria' => 'nullable|numeric',
            'temperatura' => 'nullable|numeric',
            'tension_sistolica' => 'nullable|numeric',
            'tension_diastolica' => 'nullable|numeric',
            'saturacion_oxigeno' => 'nullable|numeric',
            'historia_clinica' => 'nullable|file|mimes:pdf,doc,docx|max:10240',
        ]);

        $validated['user_id'] = auth()->id();
        $validated['institucion_remitente'] = auth()->user()->name;

        if ($request->hasFile('historia_clinica')) {
            $path = $request->file('historia_clinica')->store('historias_clinicas', 'public');
            $validated['historia_clinica_path'] = $path;
        }

        $registro = RegistroMedico::create($validated);

        return redirect()->route('ips.solicitudes')
            ->with('success', 'Registro médico creado exitosamente');
    }
}
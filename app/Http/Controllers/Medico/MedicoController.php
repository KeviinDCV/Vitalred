<?php

namespace App\Http\Controllers\Medico;

use App\Http\Controllers\Controller;
use App\Http\Requests\Medico\RegistroMedicoRequest;
use App\Models\RegistroMedico;
use App\Events\RegistroMedicoCreado;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
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
     * Guardar un nuevo registro médico
     */
    public function storeRegistro(RegistroMedicoRequest $request)
    {
        \Log::info('Datos recibidos en storeRegistro:', $request->all());

        // Validar todos los datos del formulario
        $validatedData = $request->validate([
            // Paso 1: Información Personal
            'tipo_identificacion' => 'required|string',
            'numero_identificacion' => 'required|string|max:20',
            'nombre' => 'required|string|max:255',
            'apellidos' => 'required|string|max:255',
            'fecha_nacimiento' => 'required|date',
            'edad' => 'required|integer|min:0|max:150',
            'sexo' => 'required|in:masculino,femenino,otro',
            'historia_clinica' => 'nullable|file|mimes:pdf,doc,docx,jpg,jpeg,png|max:10240', // 10MB max

            // Paso 2: Datos Sociodemográficos
            'asegurador' => 'required|string|max:255',
            'departamento' => 'required|string|max:255',
            'ciudad' => 'required|string|max:255',
            'institucion_remitente' => 'required|string|max:255',

            // Paso 3: Datos Clínicos
            'tipo_paciente' => 'required|string|max:255',
            'diagnostico_principal' => 'required|string',
            'diagnostico_1' => 'nullable|string',
            'diagnostico_2' => 'nullable|string',
            'fecha_ingreso' => 'required|date',
            'dias_hospitalizados' => 'required|integer|min:0',
            'motivo_consulta' => 'required|string',
            'clasificacion_triage' => 'required|string|max:255',
            'enfermedad_actual' => 'required|string',
            'antecedentes' => 'required|string',
            'frecuencia_cardiaca' => 'required|integer|min:30|max:300',
            'frecuencia_respiratoria' => 'required|integer|min:5|max:60',
            'temperatura' => 'required|numeric|min:30|max:45',
            'tension_sistolica' => 'required|integer|min:50|max:300',
            'tension_diastolica' => 'required|integer|min:30|max:200',
            'saturacion_oxigeno' => 'required|integer|min:50|max:100',
            'glucometria' => 'nullable|integer|min:30|max:600',
            'escala_glasgow' => 'required|string',
            'examen_fisico' => 'required|string',
            'tratamiento' => 'required|string',
            'plan_terapeutico' => 'nullable|string',

            // Paso 4: Datos De Remisión
            'motivo_remision' => 'required|string',
            'tipo_solicitud' => 'required|string|max:255',
            'especialidad_solicitada' => 'required|string|max:255',
            'requerimiento_oxigeno' => 'required|in:SI,NO',
            'tipo_servicio' => 'required|string|max:255',
            'tipo_apoyo' => 'nullable|string|max:255',
        ]);

        // Manejar la subida del archivo de historia clínica
        $historiaClinicaPath = null;
        if ($request->hasFile('historia_clinica')) {
            $historiaClinicaPath = $request->file('historia_clinica')->store(
                'historias_clinicas/' . date('Y/m'),
                'public'
            );
        }

        // Crear el registro médico
        $registro = RegistroMedico::create([
            'user_id' => auth()->id(),
            'historia_clinica_path' => $historiaClinicaPath,
            'estado' => 'enviado',
            'fecha_envio' => now(),
            ...$validatedData
        ]);

        // Disparar evento
        event(new RegistroMedicoCreado($registro));

        return redirect()->route('medico.ingresar-registro')->with('success', 'Registro médico guardado exitosamente.');
    }

    /**
     * Mostrar la página de Consulta Pacientes
     */
    public function consultaPacientes(Request $request)
    {
        $search = $request->get('search');

        // Obtener registros del médico actual con búsqueda y paginación
        $registros = RegistroMedico::where('user_id', auth()->id())
            ->when($search, function ($query, $search) {
                return $query->where(function ($q) use ($search) {
                    $q->where('nombre', 'like', "%{$search}%")
                      ->orWhere('apellidos', 'like', "%{$search}%")
                      ->orWhere('numero_identificacion', 'like', "%{$search}%")
                      ->orWhere('diagnostico_principal', 'like', "%{$search}%");
                });
            })
            ->orderBy('created_at', 'desc')
            ->paginate(10)
            ->withQueryString(); // Mantener parámetros de búsqueda en la paginación

        return Inertia::render('medico/consulta-pacientes', [
            'registros' => $registros,
            'filters' => [
                'search' => $search
            ]
        ]);
    }

    /**
     * Buscar pacientes
     */
    public function buscarPacientes(Request $request)
    {
        $termino = $request->get('q');

        $registros = RegistroMedico::where('user_id', auth()->id())
            ->when($termino, function ($query, $termino) {
                return $query->buscarPaciente($termino);
            })
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return response()->json($registros);
    }

    /**
     * Descargar historia clínica de un registro
     */
    public function descargarHistoria(RegistroMedico $registro)
    {
        // Verificar que el registro pertenece al médico actual
        if ($registro->user_id !== auth()->id()) {
            abort(403, 'No tienes permiso para descargar esta historia clínica.');
        }

        // Verificar que existe el archivo
        if (!$registro->historia_clinica_path) {
            abort(404, 'No hay historia clínica adjunta para este registro.');
        }

        $filePath = storage_path('app/public/' . $registro->historia_clinica_path);

        // Verificar que el archivo existe físicamente
        if (!file_exists($filePath)) {
            abort(404, 'El archivo de historia clínica no se encuentra en el servidor.');
        }

        // Obtener información del archivo
        $fileName = 'historia_clinica_' . $registro->numero_identificacion . '_' . $registro->nombre . '_' . $registro->apellidos;
        $fileExtension = pathinfo($registro->historia_clinica_path, PATHINFO_EXTENSION);
        $downloadName = $fileName . '.' . $fileExtension;

        // Retornar el archivo para descarga
        return response()->download($filePath, $downloadName, [
            'Content-Type' => mime_content_type($filePath),
        ]);
    }
}

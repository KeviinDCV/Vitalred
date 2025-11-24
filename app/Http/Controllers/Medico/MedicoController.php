<?php

namespace App\Http\Controllers\Medico;

use App\Http\Controllers\Controller;
use App\Models\RegistroMedico;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rules;
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
    public function storeRegistro(Request $request)
    {
        // Aumentar tiempo de ejecución para procesamiento con IA
        set_time_limit(180); // 3 minutos
        
        // ✅ CRÍTICO: LIBERAR SESIÓN - Evita bloqueo para otros usuarios/pestañas
        // El análisis de priorización con IA (líneas 114-139) puede tardar 30-60s
        // Sin liberar la sesión, bloquea todas las peticiones del usuario
        session_write_close();
        
        // ✅ SEGURIDAD: No loguear todos los datos del request
        \Log::info('Médico guardando registro', [
            'user_id' => auth()->id(),
            'tipo_identificacion' => $request->input('tipo_identificacion')
        ]);

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
            'asegurador_secundario' => 'nullable|string|max:255',
            'departamento' => 'required|string|max:255',
            'ciudad' => 'required|string|max:255',
            'institucion_remitente' => 'nullable|string|max:255',

            // Paso 3: Datos Clínicos
            'tipo_paciente' => 'required|string|max:255',
            'diagnostico_principal' => 'required|string',
            'diagnostico_1' => 'nullable|string',
            'diagnostico_2' => 'nullable|string',
            'fecha_ingreso' => 'required|date',
            'dias_hospitalizados' => 'required|integer|min:0',
            'motivo_consulta' => 'required|string',
            'enfermedad_actual' => 'required|string',
            'antecedentes' => 'required|string',
            'frecuencia_cardiaca' => 'required|integer|min:40|max:300',
            'frecuencia_respiratoria' => 'required|integer|min:10|max:80',
            'temperatura' => 'required|numeric|min:34|max:42',
            'tension_sistolica' => 'required|integer|min:50|max:300',
            'tension_diastolica' => 'required|integer|min:20|max:200',
            'saturacion_oxigeno' => 'required|integer|min:50|max:100',
            'glucometria' => 'nullable|integer|min:0|max:1000',
            'requerimiento_oxigeno' => 'required|in:SI,NO',
            'medio_soporte_oxigeno' => 'nullable|required_if:requerimiento_oxigeno,SI|string|max:255',
            'escala_glasgow' => 'required|string',
            'examen_fisico' => 'required|string',
            'plan_terapeutico' => 'nullable|string',

            // Paso 4: Datos De Remisión
            'motivo_remision' => 'required|string',
            'tipo_solicitud' => 'required|string|max:255',
            'especialidad_solicitada' => 'required|string|max:255',
            'tipo_servicio' => 'required|string|max:255',
            'tipo_apoyo' => 'nullable|string|max:255',
        ], [
            'frecuencia_cardiaca.min' => 'La frecuencia cardíaca debe ser al menos 40 lpm.',
            'frecuencia_cardiaca.max' => 'La frecuencia cardíaca no puede exceder 300 lpm.',
            'frecuencia_respiratoria.min' => 'La frecuencia respiratoria debe ser al menos 10 rpm.',
            'frecuencia_respiratoria.max' => 'La frecuencia respiratoria no puede exceder 80 rpm.',
            'temperatura.min' => 'La temperatura debe ser al menos 34°C.',
            'temperatura.max' => 'La temperatura no puede exceder 42°C.',
            'tension_sistolica.min' => 'La tensión sistólica debe ser al menos 50 mmHg.',
            'tension_sistolica.max' => 'La tensión sistólica no puede exceder 300 mmHg.',
            'tension_diastolica.min' => 'La tensión diastólica debe ser al menos 20 mmHg.',
            'tension_diastolica.max' => 'La tensión diastólica no puede exceder 200 mmHg.',
            'saturacion_oxigeno.min' => 'La saturación de oxígeno debe ser al menos 50%.',
            'saturacion_oxigeno.max' => 'La saturación de oxígeno no puede exceder 100%.',
            'glucometria.min' => 'La glucometría debe ser al menos 0 mg/dL.',
            'glucometria.max' => 'La glucometría no puede exceder 1000 mg/dL.',
            'medio_soporte_oxigeno.required_if' => 'Debe seleccionar el medio de soporte de oxígeno cuando el requerimiento es SÍ.',
        ]);

        // Manejar la subida del archivo de historia clínica
        $historiaClinicaPath = null;
        if ($request->hasFile('historia_clinica')) {
            $historiaClinicaPath = $request->file('historia_clinica')->store(
                'historias_clinicas/' . date('Y/m'),
                'public'
            );
        }

        // Usar asegurador_secundario si está disponible (nombre específico de EPS/ARL/SOAT)
        // Si no, usar asegurador (categoría general)
        $aseguradorFinal = $validatedData['asegurador_secundario'] ?? $validatedData['asegurador'];
        $validatedData['asegurador'] = $aseguradorFinal;
        unset($validatedData['asegurador_secundario']); // Remover el campo secundario

        // Agregar valores por defecto para campos eliminados del formulario
        $validatedData['clasificacion_triage'] = null;
        $validatedData['tratamiento'] = null;

        // Validar que el paciente no haya sido ingresado más de 2 veces en el día
        $registrosHoy = RegistroMedico::where('numero_identificacion', $validatedData['numero_identificacion'])
            ->whereDate('created_at', today())
            ->count();

        if ($registrosHoy >= 2) {
            return back()->withErrors([
                'numero_identificacion' => 'Este paciente ya fue ingresado más de dos veces en el día, por favor debe esperar',
            ])->withInput();
        }

        // Crear el registro médico
        $registro = RegistroMedico::create([
            'user_id' => auth()->id(),
            'historia_clinica_path' => $historiaClinicaPath,
            'estado' => 'enviado',
            'fecha_envio' => now(),
            ...$validatedData
        ]);

        \Log::info('Registro médico creado exitosamente', [
            'id' => $registro->id,
            'paciente' => $registro->nombre . ' ' . $registro->apellidos
        ]);

        // Analizar con IA si hay historia clínica
        if ($historiaClinicaPath) {
            try {
                \Log::info('Iniciando análisis de priorización con IA para registro ' . $registro->id);
                
                $aiService = app(\App\Services\OpenRouterAIService::class);
                $priorizacionController = app(\App\Http\Controllers\Medico\PriorizacionController::class);
                
                // Extraer texto de la historia clínica
                $textoHistoria = $aiService->extractTextFromFile($historiaClinicaPath);
                
                // Analizar priorización usando el método correcto del PriorizacionController
                $analisisPriorizacion = $priorizacionController->analizarPriorizacionPublico($textoHistoria);
                
                // Guardar resultado en la base de datos
                $registro->prioriza_ia = $analisisPriorizacion['prioriza'] ?? null;
                $registro->save();
                
                \Log::info('Análisis de priorización completado', [
                    'registro_id' => $registro->id,
                    'prioriza' => $registro->prioriza_ia
                ]);
            } catch (\Exception $e) {
                \Log::error('Error analizando priorización para registro ' . $registro->id . ': ' . $e->getMessage());
                // No fallar el guardado si el análisis falla
            }
        }

        // Redirigir a consulta-pacientes para ver el registro guardado
        return redirect()->route('medico.consulta-pacientes')->with('success', 'Registro médico guardado exitosamente.');
    }

    /**
     * Mostrar la página de Consulta Pacientes
     */
    public function consultaPacientes(Request $request)
    {
        $search = $request->get('search');

        // Obtener todos los registros (no solo del médico actual) con información del usuario que los creó
        $registros = RegistroMedico::with('user') // Incluir relación con usuario
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

        // Calcular estadísticas (todos los registros, no solo del médico)
        $totalRegistros = RegistroMedico::count();
        $priorizados = RegistroMedico::where('prioriza_ia', true)->count();
        $noPriorizados = RegistroMedico::where('prioriza_ia', false)->count();

        return Inertia::render('medico/consulta-pacientes', [
            'registros' => $registros,
            'filters' => [
                'search' => $search
            ],
            'stats' => [
                'total' => $totalRegistros,
                'priorizados' => $priorizados,
                'no_priorizados' => $noPriorizados,
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
            ->paginate(7);

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

    /**
     * Atender un caso (aceptar el paciente)
     */
    public function atenderCaso(Request $request, RegistroMedico $registro)
    {
        try {
            // Actualizar estado del registro
            $registro->update([
                'estado' => 'aceptado',
                'medico_asignado_id' => auth()->id(),
                'fecha_atencion' => now(),
            ]);

            // Crear notificación para el IPS que creó el registro
            if ($registro->user_id) {
                \App\Models\Notificacion::create([
                    'user_id' => $registro->user_id, // IPS que recibe la notificación
                    'registro_medico_id' => $registro->id,
                    'medico_id' => auth()->id(),
                    'tipo' => 'aceptado',
                    'titulo' => 'Caso Aceptado',
                    'mensaje' => "El Dr./Dra. " . auth()->user()->nombre . " ha aceptado el caso del paciente {$registro->nombre} {$registro->apellidos} (ID: {$registro->numero_identificacion}).",
                ]);
            }

            \Log::info('Caso atendido', [
                'registro_id' => $registro->id,
                'medico_id' => auth()->id(),
                'ips_id' => $registro->user_id,
            ]);

            return redirect()->back()->with('success', "Caso de {$registro->nombre} {$registro->apellidos} aceptado exitosamente. La IPS ha sido notificada.");

        } catch (\Exception $e) {
            \Log::error('Error atendiendo caso: ' . $e->getMessage());
            
            return redirect()->back()->with('error', 'Error al atender el caso: ' . $e->getMessage());
        }
    }

    /**
     * Rechazar/Derivar un caso
     */
    public function rechazarCaso(Request $request, RegistroMedico $registro)
    {
        $request->validate([
            'motivo' => 'nullable|string|max:500',
        ]);

        try {
            $motivo = $request->input('motivo', 'No especificado');

            // Actualizar estado del registro
            $registro->update([
                'estado' => 'rechazado',
                'medico_asignado_id' => auth()->id(),
                'fecha_atencion' => now(),
                'motivo_rechazo' => $motivo,
            ]);

            // Crear notificación para el IPS que creó el registro
            if ($registro->user_id) {
                \App\Models\Notificacion::create([
                    'user_id' => $registro->user_id, // IPS que recibe la notificación
                    'registro_medico_id' => $registro->id,
                    'medico_id' => auth()->id(),
                    'tipo' => 'rechazado',
                    'titulo' => 'Caso Rechazado',
                    'mensaje' => "El Dr./Dra. " . auth()->user()->nombre . " ha rechazado/derivado el caso del paciente {$registro->nombre} {$registro->apellidos} (ID: {$registro->numero_identificacion}). Motivo: {$motivo}",
                ]);
            }

            \Log::info('Caso rechazado', [
                'registro_id' => $registro->id,
                'medico_id' => auth()->id(),
                'ips_id' => $registro->user_id,
                'motivo' => $motivo,
            ]);

            return redirect()->back()->with('success', "Caso de {$registro->nombre} {$registro->apellidos} rechazado exitosamente. La IPS ha sido notificada.");

        } catch (\Exception $e) {
            \Log::error('Error rechazando caso: ' . $e->getMessage());
            
            return redirect()->back()->with('error', 'Error al rechazar el caso: ' . $e->getMessage());
        }
    }
}

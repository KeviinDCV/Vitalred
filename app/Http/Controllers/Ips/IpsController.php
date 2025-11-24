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

    /**
     * Guardar un nuevo registro médico desde IPS
     */
    public function storeRegistro(Request $request)
    {
        // Aumentar tiempo de ejecución para procesamiento con IA
        set_time_limit(180); // 3 minutos
        
        // ✅ CRÍTICO: LIBERAR SESIÓN - Evita bloqueo para otros usuarios/pestañas
        // El análisis de priorización con IA puede tardar 30-60s
        // Sin liberar la sesión, bloquea todas las peticiones del usuario
        session_write_close();
        
        // ✅ SEGURIDAD: No loguear todos los datos del request
        \Log::info('IPS guardando registro', [
            'user_id' => auth()->id(),
            'tipo_identificacion' => $request->input('tipo_identificacion')
        ]);

        // Validar todos los datos del formulario (igual que médico)
        $validatedData = $request->validate([
            // Paso 1: Información Personal
            'tipo_identificacion' => 'required|string',
            'numero_identificacion' => 'required|string|max:20',
            'nombre' => 'required|string|max:255',
            'apellidos' => 'required|string|max:255',
            'fecha_nacimiento' => 'required|date',
            'edad' => 'required|integer|min:0|max:150',
            'sexo' => 'required|in:masculino,femenino,otro',
            'historia_clinica' => 'nullable|file|mimes:pdf,doc,docx,jpg,jpeg,png|max:10240',

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

        // Crear el registro médico con el user_id del IPS
        $registro = RegistroMedico::create([
            'user_id' => auth()->id(), // IPS que creó el registro
            'historia_clinica_path' => $historiaClinicaPath,
            'estado' => 'enviado',
            'fecha_envio' => now(),
            ...$validatedData
        ]);

        \Log::info('Registro médico creado por IPS exitosamente', [
            'id' => $registro->id,
            'paciente' => $registro->nombre . ' ' . $registro->apellidos,
            'ips_user_id' => auth()->id()
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
            }
        }

        // Redirigir a consulta-pacientes del IPS
        return redirect()->route('ips.consulta-pacientes')->with('success', 'Registro médico guardado exitosamente.');
    }

    /**
     * Mostrar la página de Consulta Pacientes para IPS
     */
    public function consultaPacientes(Request $request)
    {
        $search = $request->get('search');

        // Obtener registros del IPS actual con búsqueda y paginación
        $registros = RegistroMedico::with('user') // Incluir relación con usuario
            ->where('user_id', auth()->id())
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

        // Calcular estadísticas
        $totalRegistros = RegistroMedico::where('user_id', auth()->id())->count();
        $priorizados = RegistroMedico::where('user_id', auth()->id())->where('prioriza_ia', true)->count();
        $noPriorizados = RegistroMedico::where('user_id', auth()->id())->where('prioriza_ia', false)->count();

        return Inertia::render('ips/consulta-pacientes', [
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
}
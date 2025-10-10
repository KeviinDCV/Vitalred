<?php

namespace App\Http\Controllers\Ips;

use App\Http\Controllers\Controller;
use App\Models\RegistroMedico;
use App\Models\SolicitudIps;
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
        $user = auth()->user();
        
        // Obtener registros médicos creados por esta IPS
        $registros = RegistroMedico::where('user_id', $user->id)
            ->with(['user'])
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('ips/solicitudes', [
            'registros' => $registros,
            'user' => $user,
        ]);
    }

    /**
     * Mostrar seguimiento de IPS
     */
    public function seguimiento()
    {
        $user = auth()->user();
        
        // Obtener métricas de la IPS
        $totalRegistros = RegistroMedico::where('user_id', $user->id)->count();
        $registrosRecientes = RegistroMedico::where('user_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->take(10)
            ->get();
            
        // Calcular métricas básicas
        $metricas = [
            'total_registros' => $totalRegistros,
            'registros_mes_actual' => RegistroMedico::where('user_id', $user->id)
                ->whereMonth('created_at', now()->month)
                ->count(),
            'especialidades_frecuentes' => RegistroMedico::where('user_id', $user->id)
                ->selectRaw('diagnostico_principal, COUNT(*) as total')
                ->groupBy('diagnostico_principal')
                ->orderBy('total', 'desc')
                ->take(5)
                ->get(),
        ];

        return Inertia::render('ips/seguimiento-ips', [
            'user' => $user,
            'metricas' => $metricas,
            'registrosRecientes' => $registrosRecientes,
        ]);
    }

    /**
     * Ingresar registro médico (IPS puede usar la misma funcionalidad que médico)
     */
    public function ingresarRegistro()
    {
        return Inertia::render('medico/ingresar-registro');
    }

    /**
     * Crear nueva solicitud IPS
     */
    public function crearSolicitud(Request $request)
    {
        $validated = $request->validate([
            'registro_medico_id' => 'required|exists:registros_medicos,id',
            'tipo_solicitud' => 'required|in:INTERCONSULTA,REMISION,APOYO_DIAGNOSTICO',
            'especialidad_solicitada' => 'required|string',
            'tipo_servicio' => 'required|in:CONSULTA_EXTERNA,HOSPITALIZACION,URGENCIAS',
            'prioridad' => 'required|in:baja,media,alta,urgente',
            'motivo_remision' => 'required|string',
            'observaciones' => 'nullable|string',
        ]);

        $solicitud = SolicitudIps::create([
            'user_id' => auth()->id(),
            ...$validated
        ]);

        return redirect()->route('ips.solicitudes')
            ->with('success', 'Solicitud creada exitosamente');
    }

    /**
     * Actualizar estado de solicitud
     */
    public function actualizarSolicitud(Request $request, SolicitudIps $solicitud)
    {
        $validated = $request->validate([
            'estado' => 'required|in:pendiente,aceptada,rechazada,completada',
            'observaciones' => 'nullable|string',
        ]);

        $solicitud->update($validated);

        if ($validated['estado'] !== 'pendiente') {
            $solicitud->update(['fecha_respuesta' => now()]);
        }

        return back()->with('success', 'Solicitud actualizada exitosamente');
    }
}
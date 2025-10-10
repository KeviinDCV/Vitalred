<?php

namespace App\Http\Controllers\Ips;

use App\Http\Controllers\Controller;
use App\Models\SolicitudIps;
use App\Models\RegistroMedico;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SolicitudController extends Controller
{
    public function index()
    {
        $solicitudes = SolicitudIps::with(['registroMedico', 'user'])
            ->where('user_id', auth()->id())
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return Inertia::render('ips/solicitudes', [
            'solicitudes' => $solicitudes,
            'user' => auth()->user(),
        ]);
    }

    public function store(Request $request)
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

        SolicitudIps::create([
            'user_id' => auth()->id(),
            ...$validated
        ]);

        return redirect()->route('ips.solicitudes')
            ->with('success', 'Solicitud creada exitosamente');
    }

    public function update(Request $request, SolicitudIps $solicitud)
    {
        $this->authorize('update', $solicitud);

        $validated = $request->validate([
            'estado' => 'required|in:pendiente,aceptada,rechazada,completada',
            'observaciones' => 'nullable|string',
        ]);

        $solicitud->update($validated);

        if ($validated['estado'] !== 'pendiente') {
            $solicitud->update(['fecha_respuesta' => now()]);
        }

        return back()->with('success', 'Solicitud actualizada');
    }
}
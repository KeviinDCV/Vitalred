<?php

namespace App\Http\Requests\Ips;

use Illuminate\Foundation\Http\FormRequest;

class SolicitudIpsRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->user()->isIps() || auth()->user()->isAdministrador();
    }

    public function rules(): array
    {
        return [
            'registro_medico_id' => 'required|exists:registros_medicos,id',
            'tipo_solicitud' => 'required|in:INTERCONSULTA,REMISION,APOYO_DIAGNOSTICO',
            'especialidad_solicitada' => 'required|string|max:100',
            'tipo_servicio' => 'required|in:CONSULTA_EXTERNA,HOSPITALIZACION,URGENCIAS',
            'prioridad' => 'required|in:baja,media,alta,urgente',
            'motivo_remision' => 'required|string|max:2000',
            'observaciones' => 'nullable|string|max:1000',
        ];
    }

    public function messages(): array
    {
        return [
            'registro_medico_id.exists' => 'El registro médico seleccionado no existe.',
            'motivo_remision.required' => 'El motivo de remisión es obligatorio.',
        ];
    }
}
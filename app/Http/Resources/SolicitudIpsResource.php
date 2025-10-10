<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SolicitudIpsResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'tipo_solicitud' => $this->tipo_solicitud,
            'especialidad_solicitada' => $this->especialidad_solicitada,
            'estado' => $this->estado,
            'prioridad' => $this->prioridad,
            'fecha_solicitud' => $this->fecha_solicitud->format('d/m/Y H:i'),
            'registro_medico' => new RegistroMedicoResource($this->whenLoaded('registroMedico')),
        ];
    }
}
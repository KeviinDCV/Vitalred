<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class RegistroMedicoResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'numero_identificacion' => $this->numero_identificacion,
            'nombre_completo' => $this->nombre . ' ' . $this->apellidos,
            'edad' => $this->edad ?? now()->diffInYears($this->fecha_nacimiento),
            'diagnostico_principal' => $this->diagnostico_principal,
            'fecha_creacion' => $this->created_at->format('d/m/Y H:i'),
            'usuario' => new UserResource($this->whenLoaded('user')),
            'solicitudes' => SolicitudIpsResource::collection($this->whenLoaded('solicitudesIps')),
        ];
    }
}
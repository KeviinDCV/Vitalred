<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SolicitudIps extends Model
{
    use HasFactory;

    protected $table = 'solicitudes_ips';

    protected $fillable = [
        'user_id',
        'registro_medico_id',
        'tipo_solicitud',
        'especialidad_solicitada',
        'tipo_servicio',
        'estado',
        'prioridad',
        'motivo_remision',
        'observaciones',
        'fecha_solicitud',
        'fecha_respuesta',
    ];

    protected $casts = [
        'fecha_solicitud' => 'datetime',
        'fecha_respuesta' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function registroMedico(): BelongsTo
    {
        return $this->belongsTo(RegistroMedico::class);
    }
}
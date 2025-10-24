<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Notificacion extends Model
{
    protected $table = 'notificaciones';

    protected $fillable = [
        'user_id',
        'registro_medico_id',
        'medico_id',
        'tipo',
        'titulo',
        'mensaje',
        'leida',
        'leida_at',
    ];

    protected $casts = [
        'leida' => 'boolean',
        'leida_at' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Usuario que recibe la notificación (IPS)
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * Registro médico relacionado
     */
    public function registroMedico(): BelongsTo
    {
        return $this->belongsTo(RegistroMedico::class, 'registro_medico_id');
    }

    /**
     * Médico que realizó la acción
     */
    public function medico(): BelongsTo
    {
        return $this->belongsTo(User::class, 'medico_id');
    }

    /**
     * Marcar notificación como leída
     */
    public function marcarComoLeida(): void
    {
        $this->update([
            'leida' => true,
            'leida_at' => now(),
        ]);
    }

    /**
     * Scope para notificaciones no leídas
     */
    public function scopeNoLeidas($query)
    {
        return $query->where('leida', false);
    }

    /**
     * Scope para notificaciones de un usuario específico
     */
    public function scopeParaUsuario($query, int $userId)
    {
        return $query->where('user_id', $userId);
    }
}

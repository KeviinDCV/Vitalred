<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Notificacion extends Model
{
    use HasFactory;

    protected $table = 'notificaciones';

    protected $fillable = [
        'user_id',
        'titulo',
        'mensaje',
        'tipo',
        'leida',
        'url',
        'datos_adicionales',
    ];

    protected $casts = [
        'leida' => 'boolean',
        'datos_adicionales' => 'array',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function marcarComoLeida()
    {
        $this->update(['leida' => true]);
    }

    public function scopeNoLeidas($query)
    {
        return $query->where('leida', false);
    }
}
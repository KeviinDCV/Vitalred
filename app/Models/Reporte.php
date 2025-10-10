<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Reporte extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'tipo',
        'nombre',
        'parametros',
        'estado',
        'archivo_path',
        'fecha_generacion',
        'fecha_expiracion',
    ];

    protected $casts = [
        'parametros' => 'array',
        'fecha_generacion' => 'datetime',
        'fecha_expiracion' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function scopeActivos($query)
    {
        return $query->where('estado', 'completado')
                    ->where('fecha_expiracion', '>', now());
    }
}
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ActividadSistema extends Model
{
    use HasFactory;

    protected $table = 'actividad_sistema';

    protected $fillable = [
        'user_id',
        'accion',
        'modelo',
        'modelo_id',
        'datos_anteriores',
        'datos_nuevos',
        'ip_address',
        'user_agent',
    ];

    protected $casts = [
        'datos_anteriores' => 'array',
        'datos_nuevos' => 'array',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public static function registrar($accion, $modelo = null, $modelo_id = null, $datos_anteriores = null, $datos_nuevos = null)
    {
        return self::create([
            'user_id' => auth()->id(),
            'accion' => $accion,
            'modelo' => $modelo,
            'modelo_id' => $modelo_id,
            'datos_anteriores' => $datos_anteriores,
            'datos_nuevos' => $datos_nuevos,
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent(),
        ]);
    }
}
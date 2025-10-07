<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Modelo temporal para almacenar pruebas de análisis de IA
 * con campos de comparación manual vs IA
 */
class AnalisisPruebaIA extends Model
{
    protected $table = 'analisis_pruebas_ia';

    protected $fillable = [
        'nombre_documento',
        'nombre_archivo_original',
        'analisis_precisa',
        'analisis_vital_red',
        'analisis_medico',
        'texto_extraido',
        'analisis_ia',
        'razonamiento_priorizacion',
        'user_id',
    ];

    protected $casts = [
        'razonamiento_priorizacion' => 'array',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Relación con el usuario que realizó el análisis
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Asegurador extends Model
{
    use HasFactory;

    protected $table = 'aseguradores';

    protected $fillable = [
        'tipo',
        'nombre',
        'activo',
    ];

    protected $casts = [
        'activo' => 'boolean',
    ];

    public function scopeActivos($query)
    {
        return $query->where('activo', true);
    }

    public function scopeTipo($query, $tipo)
    {
        if (empty($tipo)) {
            return $query;
        }

        return $query->where('tipo', $tipo);
    }

    public function scopeBuscar($query, $termino)
    {
        if (empty($termino)) {
            return $query;
        }

        return $query->where('nombre', 'like', "%{$termino}%");
    }
}

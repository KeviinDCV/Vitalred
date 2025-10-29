<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Institucion extends Model
{
    use HasFactory;

    protected $table = 'instituciones';

    protected $fillable = [
        'tipo',
        'nombre',
        'codigo_habilitacion',
        'departamento',
        'municipio',
        'activo',
    ];

    protected $casts = [
        'activo' => 'boolean',
    ];

    /**
     * Scope para filtrar solo instituciones activas
     */
    public function scopeActivas($query)
    {
        return $query->where('activo', true);
    }

    /**
     * Scope para filtrar por tipo
     */
    public function scopeTipo($query, $tipo)
    {
        if (empty($tipo)) {
            return $query;
        }

        return $query->where('tipo', $tipo);
    }

    /**
     * Scope para búsqueda por nombre, departamento o municipio
     */
    public function scopeBuscar($query, $termino)
    {
        if (empty($termino)) {
            return $query;
        }

        return $query->where(function($q) use ($termino) {
            $q->where('nombre', 'like', "%{$termino}%")
              ->orWhere('departamento', 'like', "%{$termino}%")
              ->orWhere('municipio', 'like', "%{$termino}%")
              ->orWhere('codigo_habilitacion', 'like', "%{$termino}%");
        });
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SolicitudRegistro extends Model
{
    use HasFactory;

    protected $table = 'solicitudes_registro';

    protected $fillable = [
        'ips_id',
        'ips_nombre',
        'nit',
        'nombre_responsable',
        'cargo_responsable',
        'telefono',
        'email',
        'password',
        'estado',
        'observaciones',
        'aprobado_por',
        'fecha_aprobacion',
    ];

    protected $hidden = [
        'password',
    ];

    protected $casts = [
        'fecha_aprobacion' => 'datetime',
    ];

    /**
     * Relación con la institución (IPS)
     */
    public function institucion()
    {
        return $this->belongsTo(Institucion::class, 'ips_id');
    }

    /**
     * Relación con el usuario que aprobó/rechazó
     */
    public function aprobador()
    {
        return $this->belongsTo(User::class, 'aprobado_por');
    }

    /**
     * Scope para solicitudes pendientes
     */
    public function scopePendientes($query)
    {
        return $query->where('estado', 'pendiente');
    }

    /**
     * Scope para solicitudes aprobadas
     */
    public function scopeAprobadas($query)
    {
        return $query->where('estado', 'aprobada');
    }

    /**
     * Scope para solicitudes rechazadas
     */
    public function scopeRechazadas($query)
    {
        return $query->where('estado', 'rechazada');
    }
}

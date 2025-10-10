<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RegistroMedico extends Model
{
    protected $table = 'registros_medicos';

    protected $fillable = [
        // Paso 1: Información Personal
        'user_id',
        'tipo_identificacion',
        'numero_identificacion',
        'nombre',
        'apellidos',
        'fecha_nacimiento',
        'edad',
        'sexo',
        'historia_clinica_path',

        // Paso 2: Datos Sociodemográficos
        'asegurador',
        'departamento',
        'ciudad',
        'institucion_remitente',

        // Paso 3: Datos Clínicos
        'tipo_paciente',
        'diagnostico_principal',
        'diagnostico_1',
        'diagnostico_2',
        'fecha_ingreso',
        'dias_hospitalizados',
        'motivo_consulta',
        'clasificacion_triage',
        'enfermedad_actual',
        'antecedentes',
        'frecuencia_cardiaca',
        'frecuencia_respiratoria',
        'temperatura',
        'tension_sistolica',
        'tension_diastolica',
        'saturacion_oxigeno',
        'glucometria',
        'escala_glasgow',
        'examen_fisico',
        'tratamiento',
        'plan_terapeutico',

        // Paso 4: Datos De Remisión
        'motivo_remision',
        'tipo_solicitud',
        'especialidad_solicitada',
        'requerimiento_oxigeno',
        'tipo_servicio',
        'tipo_apoyo',

        // Campos de control
        'estado',
        'fecha_envio',
    ];

    protected $casts = [
        'fecha_nacimiento' => 'date',
        'fecha_ingreso' => 'date',
        'fecha_envio' => 'datetime',
        'edad' => 'integer',
        'dias_hospitalizados' => 'integer',
        'frecuencia_cardiaca' => 'integer',
        'frecuencia_respiratoria' => 'integer',
        'temperatura' => 'decimal:1',
        'tension_sistolica' => 'integer',
        'tension_diastolica' => 'integer',
        'saturacion_oxigeno' => 'integer',
        'glucometria' => 'integer',
    ];

    /**
     * Relación con el usuario que creó el registro
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Solicitudes IPS relacionadas con este registro
     */
    public function solicitudesIps()
    {
        return $this->hasMany(SolicitudIps::class);
    }

    /**
     * Scope para filtrar por estado
     */
    public function scopeByEstado($query, $estado)
    {
        return $query->where('estado', $estado);
    }

    /**
     * Scope para buscar por paciente
     */
    public function scopeBuscarPaciente($query, $termino)
    {
        return $query->where(function ($q) use ($termino) {
            $q->where('nombre', 'like', "%{$termino}%")
              ->orWhere('apellidos', 'like', "%{$termino}%")
              ->orWhere('numero_identificacion', 'like', "%{$termino}%");
        });
    }

    /**
     * Accessor para obtener el nombre completo del paciente
     */
    public function getNombreCompletoAttribute()
    {
        return $this->nombre . ' ' . $this->apellidos;
    }

    /**
     * Accessor para obtener la edad calculada
     */
    public function getEdadCalculadaAttribute()
    {
        return $this->fecha_nacimiento->age ?? $this->edad;
    }
}

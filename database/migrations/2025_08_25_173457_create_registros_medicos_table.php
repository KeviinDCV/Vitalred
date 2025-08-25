<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('registros_medicos', function (Blueprint $table) {
            $table->id();

            // Relación con el usuario que crea el registro
            $table->foreignId('user_id')->constrained()->onDelete('cascade');

            // Paso 1: Información Personal
            $table->string('tipo_identificacion');
            $table->string('numero_identificacion');
            $table->string('nombre');
            $table->string('apellidos');
            $table->date('fecha_nacimiento');
            $table->integer('edad');
            $table->enum('sexo', ['masculino', 'femenino', 'otro']);
            $table->string('historia_clinica_path')->nullable(); // Ruta del archivo

            // Paso 2: Datos Sociodemográficos
            $table->string('asegurador');
            $table->string('departamento');
            $table->string('ciudad');
            $table->string('institucion_remitente');

            // Paso 3: Datos Clínicos
            $table->string('tipo_paciente');
            $table->text('diagnostico_principal');
            $table->text('diagnostico_1')->nullable();
            $table->text('diagnostico_2')->nullable();
            $table->date('fecha_ingreso');
            $table->integer('dias_hospitalizados')->default(0);
            $table->text('motivo_consulta');
            $table->string('clasificacion_triage');
            $table->text('enfermedad_actual');
            $table->text('antecedentes');

            // Signos vitales
            $table->integer('frecuencia_cardiaca');
            $table->integer('frecuencia_respiratoria');
            $table->decimal('temperatura', 4, 1);
            $table->integer('tension_sistolica');
            $table->integer('tension_diastolica');
            $table->integer('saturacion_oxigeno');
            $table->integer('glucometria')->nullable();
            $table->string('escala_glasgow');

            // Examen físico y tratamiento
            $table->text('examen_fisico');
            $table->text('tratamiento');
            $table->text('plan_terapeutico')->nullable();

            // Paso 4: Datos De Remisión
            $table->text('motivo_remision');
            $table->string('tipo_solicitud');
            $table->string('especialidad_solicitada');
            $table->enum('requerimiento_oxigeno', ['SI', 'NO'])->default('NO');
            $table->string('tipo_servicio');
            $table->string('tipo_apoyo')->nullable();

            // Campos de control
            $table->enum('estado', ['borrador', 'enviado', 'procesado', 'completado'])->default('borrador');
            $table->timestamp('fecha_envio')->nullable();

            $table->timestamps();

            // Índices para búsquedas frecuentes
            $table->index(['numero_identificacion']);
            $table->index(['nombre', 'apellidos']);
            $table->index(['fecha_ingreso']);
            $table->index(['estado']);
            $table->index(['user_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('registros_medicos');
    }
};

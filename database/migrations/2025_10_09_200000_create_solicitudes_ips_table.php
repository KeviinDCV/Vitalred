<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('solicitudes_ips', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('registro_medico_id')->constrained('registros_medicos')->onDelete('cascade');
            $table->enum('tipo_solicitud', ['INTERCONSULTA', 'REMISION', 'APOYO_DIAGNOSTICO']);
            $table->string('especialidad_solicitada');
            $table->enum('tipo_servicio', ['CONSULTA_EXTERNA', 'HOSPITALIZACION', 'URGENCIAS']);
            $table->enum('estado', ['pendiente', 'aceptada', 'rechazada', 'completada'])->default('pendiente');
            $table->enum('prioridad', ['baja', 'media', 'alta', 'urgente'])->default('media');
            $table->text('motivo_remision');
            $table->text('observaciones')->nullable();
            $table->timestamp('fecha_solicitud')->useCurrent();
            $table->timestamp('fecha_respuesta')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('solicitudes_ips');
    }
};
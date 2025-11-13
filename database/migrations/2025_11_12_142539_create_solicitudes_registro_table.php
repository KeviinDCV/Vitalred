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
        Schema::create('solicitudes_registro', function (Blueprint $table) {
            $table->id();
            $table->foreignId('ips_id')->nullable()->constrained('instituciones')->onDelete('set null');
            $table->string('ips_nombre')->nullable();
            $table->string('nit');
            $table->string('nombre_responsable');
            $table->string('cargo_responsable');
            $table->string('telefono');
            $table->string('email')->unique();
            $table->enum('estado', ['pendiente', 'aprobada', 'rechazada'])->default('pendiente');
            $table->text('observaciones')->nullable();
            $table->foreignId('aprobado_por')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamp('fecha_aprobacion')->nullable();
            $table->timestamps();
            
            $table->index('estado');
            $table->index('email');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('solicitudes_registro');
    }
};

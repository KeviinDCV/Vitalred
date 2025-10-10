<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('reportes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->enum('tipo', ['registros', 'usuarios', 'diagnosticos', 'completo', 'personalizado']);
            $table->string('nombre');
            $table->json('parametros')->nullable();
            $table->enum('estado', ['pendiente', 'procesando', 'completado', 'error'])->default('pendiente');
            $table->string('archivo_path')->nullable();
            $table->timestamp('fecha_generacion')->nullable();
            $table->timestamp('fecha_expiracion')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reportes');
    }
};
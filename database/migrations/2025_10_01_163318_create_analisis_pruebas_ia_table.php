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
        Schema::create('analisis_pruebas_ia', function (Blueprint $table) {
            $table->id();
            
            // Datos del documento/archivo
            $table->string('nombre_documento');
            $table->string('nombre_archivo_original')->nullable();
            
            // Campos de análisis manual (solicitados por el usuario)
            $table->text('analisis_precisa')->nullable();
            $table->text('analisis_vital_red')->nullable();
            $table->text('analisis_medico')->nullable();
            
            // Resultados de la IA (para comparación)
            $table->longText('texto_extraido')->nullable();
            $table->longText('analisis_ia')->nullable();
            $table->json('razonamiento_priorizacion')->nullable();
            
            // Metadata
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('set null');
            $table->timestamps();
            
            // Índices para búsquedas
            $table->index('nombre_documento');
            $table->index('created_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('analisis_pruebas_ia');
    }
};

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
        Schema::table('registros_medicos', function (Blueprint $table) {
            // Agregar campo para almacenar resultado de análisis de IA
            // true = prioriza, false = no prioriza, null = no analizado aún
            $table->boolean('prioriza_ia')->nullable()->after('fecha_envio');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('registros_medicos', function (Blueprint $table) {
            $table->dropColumn('prioriza_ia');
        });
    }
};

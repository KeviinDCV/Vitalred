<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Modificar el ENUM para agregar 'aceptado' y 'rechazado'
        DB::statement("ALTER TABLE registros_medicos MODIFY COLUMN estado ENUM('borrador', 'enviado', 'procesado', 'completado', 'aceptado', 'rechazado') NOT NULL DEFAULT 'borrador'");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Volver al ENUM original
        DB::statement("ALTER TABLE registros_medicos MODIFY COLUMN estado ENUM('borrador', 'enviado', 'procesado', 'completado') NOT NULL DEFAULT 'borrador'");
    }
};

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
            $table->foreignId('medico_asignado_id')->nullable()->after('prioriza_ia')->constrained('users')->onDelete('set null');
            $table->timestamp('fecha_atencion')->nullable()->after('medico_asignado_id');
            $table->text('motivo_rechazo')->nullable()->after('fecha_atencion');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('registros_medicos', function (Blueprint $table) {
            $table->dropForeign(['medico_asignado_id']);
            $table->dropColumn(['medico_asignado_id', 'fecha_atencion', 'motivo_rechazo']);
        });
    }
};

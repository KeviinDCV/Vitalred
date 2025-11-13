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
            $table->string('medio_soporte_oxigeno')->nullable()->after('requerimiento_oxigeno');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('registros_medicos', function (Blueprint $table) {
            $table->dropColumn('medio_soporte_oxigeno');
        });
    }
};

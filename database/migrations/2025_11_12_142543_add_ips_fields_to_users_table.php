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
        Schema::table('users', function (Blueprint $table) {
            $table->foreignId('ips_id')->nullable()->after('is_active')->constrained('instituciones')->onDelete('set null');
            $table->string('ips_nombre')->nullable()->after('ips_id');
            $table->string('nit')->nullable()->after('ips_nombre');
            $table->string('nombre_responsable')->nullable()->after('nit');
            $table->string('cargo_responsable')->nullable()->after('nombre_responsable');
            $table->string('telefono')->nullable()->after('cargo_responsable');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['ips_id']);
            $table->dropColumn(['ips_id', 'ips_nombre', 'nit', 'nombre_responsable', 'cargo_responsable', 'telefono']);
        });
    }
};

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('solicitudes_ips', function (Blueprint $table) {
            $table->index(['user_id', 'estado'], 'idx_solicitudes_user_estado');
            $table->index(['registro_medico_id', 'estado'], 'idx_solicitudes_registro_estado');
            $table->index('fecha_solicitud', 'idx_solicitudes_fecha');
        });

        Schema::table('notificaciones', function (Blueprint $table) {
            $table->index(['user_id', 'leida'], 'idx_notificaciones_user_leida');
            $table->index('created_at', 'idx_notificaciones_fecha');
        });

        Schema::table('reportes', function (Blueprint $table) {
            $table->index(['user_id', 'estado'], 'idx_reportes_user_estado');
            $table->index('created_at', 'idx_reportes_fecha');
        });
    }

    public function down(): void
    {
        Schema::table('solicitudes_ips', function (Blueprint $table) {
            $table->dropIndex('idx_solicitudes_user_estado');
            $table->dropIndex('idx_solicitudes_registro_estado');
            $table->dropIndex('idx_solicitudes_fecha');
        });

        Schema::table('notificaciones', function (Blueprint $table) {
            $table->dropIndex('idx_notificaciones_user_leida');
            $table->dropIndex('idx_notificaciones_fecha');
        });

        Schema::table('reportes', function (Blueprint $table) {
            $table->dropIndex('idx_reportes_user_estado');
            $table->dropIndex('idx_reportes_fecha');
        });
    }
};
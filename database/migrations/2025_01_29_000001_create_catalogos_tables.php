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
        // Tabla de Códigos CIE-10
        Schema::create('codigos_cie10', function (Blueprint $table) {
            $table->id();
            $table->string('codigo', 10)->unique();
            $table->text('descripcion');
            $table->boolean('activo')->default(true);
            $table->timestamps();
            
            $table->index('codigo');
            $table->index('activo');
        });

        // Tabla de Instituciones Prestadoras de Salud
        Schema::create('instituciones', function (Blueprint $table) {
            $table->id();
            $table->enum('tipo', ['nacional', 'policia']);
            $table->string('nombre', 255);
            $table->string('codigo_habilitacion', 50)->nullable();
            $table->string('departamento', 100)->nullable();
            $table->string('municipio', 100)->nullable();
            $table->boolean('activo')->default(true);
            $table->timestamps();
            
            $table->index('nombre');
            $table->index('tipo');
            $table->index('departamento');
            $table->index('activo');
        });

        // Tabla de Aseguradores
        Schema::create('aseguradores', function (Blueprint $table) {
            $table->id();
            $table->enum('tipo', ['eps', 'arl', 'soat', 'adres', 'particular', 'secretaria_salud_departamental', 'secretaria_salud_distrital']);
            $table->string('nombre', 255);
            $table->boolean('activo')->default(true);
            $table->timestamps();
            
            $table->unique(['tipo', 'nombre']);
            $table->index('tipo');
            $table->index('activo');
        });

        // Tabla de Especialidades Médicas
        Schema::create('especialidades', function (Blueprint $table) {
            $table->id();
            $table->string('nombre', 255)->unique();
            $table->text('descripcion')->nullable();
            $table->boolean('activo')->default(true);
            $table->timestamps();
            
            $table->index('activo');
        });

        // Tabla de Tipos de Servicio
        Schema::create('tipos_servicio', function (Blueprint $table) {
            $table->id();
            $table->string('codigo', 100)->unique();
            $table->string('nombre', 255);
            $table->boolean('activo')->default(true);
            $table->timestamps();
            
            $table->index('activo');
        });

        // Tabla de Tipos de Apoyo
        Schema::create('tipos_apoyo', function (Blueprint $table) {
            $table->id();
            $table->string('codigo', 100)->unique();
            $table->string('nombre', 255);
            $table->boolean('activo')->default(true);
            $table->timestamps();
            
            $table->index('activo');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tipos_apoyo');
        Schema::dropIfExists('tipos_servicio');
        Schema::dropIfExists('especialidades');
        Schema::dropIfExists('aseguradores');
        Schema::dropIfExists('instituciones');
        Schema::dropIfExists('codigos_cie10');
    }
};

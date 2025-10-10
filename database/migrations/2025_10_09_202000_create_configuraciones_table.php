<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('configuraciones', function (Blueprint $table) {
            $table->id();
            $table->string('clave')->unique();
            $table->json('valor');
            $table->enum('tipo', ['string', 'integer', 'boolean', 'json', 'array'])->default('string');
            $table->string('descripcion')->nullable();
            $table->string('categoria')->default('general');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('configuraciones');
    }
};
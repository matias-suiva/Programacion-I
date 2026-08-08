<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Ejecuta la migración (crea la tabla).
     */
    public function up(): void
    {
        Schema::create('registros', function (Blueprint $table) {
            $table->id();
            $table->string('nombre');
            $table->string('email');
            $table->string('capitan');
            $table->timestamps();
        });
    }

    /**
     * Revierte la migración (borra la tabla).
     */
    public function down(): void
    {
        Schema::dropIfExists('registros');
    }
};

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('mazmorras', function (Blueprint $table) {
            $table->id();
            $table->string('nombre');
            $table->integer('piso')->default(1);
            $table->integer('ancho');  // Ancho en tiles
            $table->integer('alto');   // Alto en tiles
            $table->text('layout');    // JSON: mapa de tiles (0=suelo, 1=pared, 2=decoración, 3=entrada, 4=salida)
            $table->string('objetivo')->default('Explora la mazmorra y encuentra la salida.');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('mazmorras');
    }
};

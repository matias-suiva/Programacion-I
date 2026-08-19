<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('personajes', function (Blueprint $table) {
            $table->id();
            $table->string('nombre');
            $table->string('clase'); // Guerrero, Tanque, Maga, Arquera
            $table->integer('nivel')->default(12);
            $table->integer('hp_max');
            $table->integer('hp_actual');
            $table->integer('mp_max');
            $table->integer('mp_actual');
            $table->integer('ataque');
            $table->integer('defensa');
            $table->integer('magia');
            $table->integer('velocidad');
            $table->string('color')->default('#ffffff'); // Color placeholder para sprite
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('personajes');
    }
};

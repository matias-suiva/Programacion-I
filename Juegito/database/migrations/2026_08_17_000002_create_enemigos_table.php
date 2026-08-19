<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('enemigos', function (Blueprint $table) {
            $table->id();
            $table->string('nombre');
            $table->integer('hp_max');
            $table->integer('ataque');
            $table->integer('defensa');
            $table->integer('magia');
            $table->integer('velocidad');
            $table->string('color')->default('#ff0000'); // Color placeholder
            $table->string('emoji')->default('👾');       // Emoji para canvas
            $table->integer('exp_reward')->default(0);    // Para futuro
            $table->integer('gold_reward')->default(0);   // Para futuro
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('enemigos');
    }
};

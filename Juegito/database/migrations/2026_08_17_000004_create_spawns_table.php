<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('spawns', function (Blueprint $table) {
            $table->id();
            $table->foreignId('mazmorra_id')->constrained('mazmorras')->onDelete('cascade');
            $table->foreignId('enemigo_id')->constrained('enemigos')->onDelete('cascade');
            $table->integer('tile_x');
            $table->integer('tile_y');
            $table->boolean('activo')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('spawns');
    }
};

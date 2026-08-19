<?php

use App\Http\Controllers\Api\PersonajeController;
use App\Http\Controllers\Api\EnemigoController;
use App\Http\Controllers\Api\MazmorraController;
use Illuminate\Support\Facades\Route;

// Personajes del grupo
Route::get('/personajes', [PersonajeController::class, 'index']);
Route::post('/personajes/reset', [PersonajeController::class, 'reset']);

// Tipos de enemigo
Route::get('/enemigos', [EnemigoController::class, 'index']);

// Mazmorras (con spawns y enemigos)
Route::get('/mazmorras/{id}', [MazmorraController::class, 'show']);

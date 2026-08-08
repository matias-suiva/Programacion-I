<?php

use App\Http\Controllers\RegistroController;
use Illuminate\Support\Facades\Route;

Route::post('/registros', [RegistroController::class, 'store']);
Route::get('/registros', [RegistroController::class, 'index']);

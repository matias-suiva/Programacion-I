<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Enemigo;
use Illuminate\Http\JsonResponse;

class EnemigoController extends Controller
{
    /**
     * Devuelve todos los tipos de enemigo disponibles.
     */
    public function index(): JsonResponse
    {
        $enemigos = Enemigo::all();
        return response()->json($enemigos);
    }
}

<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Mazmorra;
use Illuminate\Http\JsonResponse;

class MazmorraController extends Controller
{
    /**
     * Devuelve una mazmorra con su layout y spawns (incluyendo el tipo de enemigo).
     */
    public function show(int $id): JsonResponse
    {
        $mazmorra = Mazmorra::with('spawns.enemigo')->findOrFail($id);
        return response()->json($mazmorra);
    }
}

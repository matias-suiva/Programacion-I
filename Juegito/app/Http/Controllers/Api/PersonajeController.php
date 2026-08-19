<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Personaje;
use Illuminate\Http\JsonResponse;

class PersonajeController extends Controller
{
    /**
     * Devuelve los 4 personajes del grupo con todos sus stats.
     */
    public function index(): JsonResponse
    {
        $personajes = Personaje::all();
        return response()->json($personajes);
    }

    /**
     * Resetea HP y MP de todos los personajes a su máximo.
     * Se usa al perder un combate o al reiniciar.
     */
    public function reset(): JsonResponse
    {
        Personaje::query()->get()->each(function (Personaje $p) {
            $p->update([
                'hp_actual' => $p->hp_max,
                'mp_actual' => $p->mp_max,
            ]);
        });

        return response()->json([
            'message'    => 'Personajes reseteados',
            'personajes' => Personaje::all(),
        ]);
    }
}

<?php

namespace App\Http\Controllers;

use App\Models\Registro;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class RegistroController extends Controller
{
    /**
     * POST /api/registros
     * Valida los datos del formulario y crea un nuevo registro.
     */
    public function store(Request $request): JsonResponse
    {
        $validado = $request->validate([
            'nombre'  => 'required|string|max:255',
            'email'   => 'required|email|max:255',
            'capitan' => 'required|string|max:255',
        ]);

        $registro = Registro::create($validado);

        return response()->json([
            'mensaje' => 'Registro guardado correctamente',
            'data'    => $registro,
        ], 201);
    }

    /**
     * GET /api/registros
     * Devuelve todos los registros guardados (sirve para comprobar
     * que se están guardando bien, sin tener que entrar a la base de datos).
     */
    public function index(): JsonResponse
    {
        return response()->json(Registro::latest()->get());
    }
}

<?php

namespace Database\Seeders;

use App\Models\Mazmorra;
use App\Models\Spawn;
use Illuminate\Database\Seeder;

class MazmorraSeeder extends Seeder
{
    public function run(): void
    {
        // Layout 20x15 tiles
        // 0 = suelo, 1 = pared, 2 = decoración (barril/vasija), 3 = entrada, 4 = salida
        $layout = [
            // Fila 0 (top)
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
            // Fila 1
            [1,0,0,0,0,1,1,1,1,1,1,1,1,0,0,0,0,0,0,1],
            // Fila 2
            [1,0,3,0,0,1,1,1,1,1,1,1,1,0,0,2,0,0,0,1],
            // Fila 3
            [1,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,1],
            // Fila 4
            [1,0,0,2,0,0,0,0,0,1,1,1,0,0,0,0,0,2,0,1],
            // Fila 5
            [1,1,1,1,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,1],
            // Fila 6
            [1,1,1,1,1,1,0,0,0,0,0,0,0,0,1,1,1,0,0,1],
            // Fila 7 (pasillo central)
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,1],
            // Fila 8
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            // Fila 9
            [1,0,2,0,0,1,1,0,0,0,0,0,1,1,1,0,0,0,0,1],
            // Fila 10
            [1,0,0,0,0,1,1,0,0,2,0,0,1,1,1,0,0,2,0,1],
            // Fila 11
            [1,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1],
            // Fila 12
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,0,0,1],
            // Fila 13
            [1,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            // Fila 14 (bottom)
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
        ];

        $mazmorra = Mazmorra::create([
            'nombre'   => 'Mazmorra Antigua',
            'piso'     => 1,
            'ancho'    => 20,
            'alto'     => 15,
            'layout'   => $layout,
            'objetivo' => 'Explora la mazmorra y encuentra la salida.',
        ]);

        // Puntos de spawn distribuidos por el mapa
        $spawns = [
            ['enemigo_id' => 1, 'tile_x' => 7,  'tile_y' => 3],  // Slime en la sala izquierda
            ['enemigo_id' => 1, 'tile_x' => 14, 'tile_y' => 2],  // Slime en la sala derecha superior
            ['enemigo_id' => 2, 'tile_x' => 10, 'tile_y' => 7],  // Murciélago en el pasillo central
            ['enemigo_id' => 3, 'tile_x' => 3,  'tile_y' => 11], // Esqueleto en la sala inferior izquierda
            ['enemigo_id' => 2, 'tile_x' => 15, 'tile_y' => 10], // Murciélago en la sala inferior derecha
        ];

        foreach ($spawns as $s) {
            Spawn::create(array_merge($s, [
                'mazmorra_id' => $mazmorra->id,
                'activo'      => true,
            ]));
        }
    }
}

<?php

namespace Database\Seeders;

use App\Models\Enemigo;
use Illuminate\Database\Seeder;

class EnemigoSeeder extends Seeder
{
    public function run(): void
    {
        $enemigos = [
            [
                'nombre'      => 'Slime',
                'hp_max'      => 30,
                'ataque'      => 12,
                'defensa'     => 8,
                'magia'       => 5,
                'velocidad'   => 8,
                'color'       => '#4488ff',
                'emoji'       => '🟦',
                'exp_reward'  => 15,
                'gold_reward' => 8,
            ],
            [
                'nombre'      => 'Murciélago',
                'hp_max'      => 25,
                'ataque'      => 15,
                'defensa'     => 6,
                'magia'       => 8,
                'velocidad'   => 22,
                'color'       => '#8844aa',
                'emoji'       => '🦇',
                'exp_reward'  => 20,
                'gold_reward' => 12,
            ],
            [
                'nombre'      => 'Esqueleto',
                'hp_max'      => 45,
                'ataque'      => 20,
                'defensa'     => 15,
                'magia'       => 10,
                'velocidad'   => 14,
                'color'       => '#ccccaa',
                'emoji'       => '💀',
                'exp_reward'  => 30,
                'gold_reward' => 18,
            ],
        ];

        foreach ($enemigos as $e) {
            Enemigo::create($e);
        }
    }
}

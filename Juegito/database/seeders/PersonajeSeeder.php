<?php

namespace Database\Seeders;

use App\Models\Personaje;
use Illuminate\Database\Seeder;

class PersonajeSeeder extends Seeder
{
    public function run(): void
    {
        $personajes = [
            [
                'nombre'    => 'Arion',
                'clase'     => 'Guerrero',
                'nivel'     => 12,
                'hp_max'    => 120,
                'hp_actual' => 120,
                'mp_max'    => 45,
                'mp_actual' => 45,
                'ataque'    => 28,
                'defensa'   => 22,
                'magia'     => 10,
                'velocidad' => 18,
                'color'     => '#e07020',
            ],
            [
                'nombre'    => 'Galen',
                'clase'     => 'Tanque',
                'nivel'     => 12,
                'hp_max'    => 160,
                'hp_actual' => 160,
                'mp_max'    => 30,
                'mp_actual' => 30,
                'ataque'    => 20,
                'defensa'   => 35,
                'magia'     => 8,
                'velocidad' => 12,
                'color'     => '#4080c0',
            ],
            [
                'nombre'    => 'Luna',
                'clase'     => 'Maga',
                'nivel'     => 12,
                'hp_max'    => 80,
                'hp_actual' => 80,
                'mp_max'    => 90,
                'mp_actual' => 90,
                'ataque'    => 10,
                'defensa'   => 14,
                'magia'     => 38,
                'velocidad' => 20,
                'color'     => '#a050d0',
            ],
            [
                'nombre'    => 'Mira',
                'clase'     => 'Arquera',
                'nivel'     => 12,
                'hp_max'    => 95,
                'hp_actual' => 95,
                'mp_max'    => 55,
                'mp_actual' => 55,
                'ataque'    => 25,
                'defensa'   => 16,
                'magia'     => 15,
                'velocidad' => 30,
                'color'     => '#40b060',
            ],
        ];

        foreach ($personajes as $p) {
            Personaje::create($p);
        }
    }
}

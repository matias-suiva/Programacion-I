<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Personaje extends Model
{
    protected $table = 'personajes';

    protected $fillable = [
        'nombre', 'clase', 'nivel',
        'hp_max', 'hp_actual', 'mp_max', 'mp_actual',
        'ataque', 'defensa', 'magia', 'velocidad',
        'color',
    ];

    protected $casts = [
        'nivel' => 'integer',
        'hp_max' => 'integer',
        'hp_actual' => 'integer',
        'mp_max' => 'integer',
        'mp_actual' => 'integer',
        'ataque' => 'integer',
        'defensa' => 'integer',
        'magia' => 'integer',
        'velocidad' => 'integer',
    ];
}

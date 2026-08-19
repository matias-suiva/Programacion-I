<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Enemigo extends Model
{
    protected $table = 'enemigos';

    protected $fillable = [
        'nombre',
        'hp_max', 'ataque', 'defensa', 'magia', 'velocidad',
        'color', 'emoji',
        'exp_reward', 'gold_reward',
    ];

    protected $casts = [
        'hp_max' => 'integer',
        'ataque' => 'integer',
        'defensa' => 'integer',
        'magia' => 'integer',
        'velocidad' => 'integer',
        'exp_reward' => 'integer',
        'gold_reward' => 'integer',
    ];

    /**
     * Spawns de este tipo de enemigo.
     */
    public function spawns(): HasMany
    {
        return $this->hasMany(Spawn::class, 'enemigo_id');
    }
}

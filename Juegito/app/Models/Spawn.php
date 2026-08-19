<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Spawn extends Model
{
    protected $table = 'spawns';

    protected $fillable = [
        'mazmorra_id', 'enemigo_id',
        'tile_x', 'tile_y',
        'activo',
    ];

    protected $casts = [
        'tile_x' => 'integer',
        'tile_y' => 'integer',
        'activo' => 'boolean',
    ];

    /**
     * Mazmorra donde está este spawn.
     */
    public function mazmorra(): BelongsTo
    {
        return $this->belongsTo(Mazmorra::class, 'mazmorra_id');
    }

    /**
     * Tipo de enemigo que aparece en este spawn.
     */
    public function enemigo(): BelongsTo
    {
        return $this->belongsTo(Enemigo::class, 'enemigo_id');
    }
}

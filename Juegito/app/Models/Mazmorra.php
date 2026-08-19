<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Mazmorra extends Model
{
    protected $table = 'mazmorras';

    protected $fillable = [
        'nombre', 'piso', 'ancho', 'alto',
        'layout', 'objetivo',
    ];

    protected $casts = [
        'piso' => 'integer',
        'ancho' => 'integer',
        'alto' => 'integer',
        'layout' => 'array', // Auto JSON encode/decode
    ];

    /**
     * Puntos de spawn en esta mazmorra.
     */
    public function spawns(): HasMany
    {
        return $this->hasMany(Spawn::class, 'mazmorra_id');
    }
}

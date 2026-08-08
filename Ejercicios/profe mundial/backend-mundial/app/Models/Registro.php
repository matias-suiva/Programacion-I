<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Registro extends Model
{
    use HasFactory;

    /**
     * Campos que se pueden asignar de forma masiva
     * (los que va a recibir Registro::create([...])).
     */
    protected $fillable = [
        'nombre',
        'email',
        'capitan',
    ];
}

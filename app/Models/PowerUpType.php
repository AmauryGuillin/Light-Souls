<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PowerUpType extends Model
{
    protected $table = 'powerup_types';

    public function powerups()
    {
        $this->hasMany(PowerUp::class);
    }
}

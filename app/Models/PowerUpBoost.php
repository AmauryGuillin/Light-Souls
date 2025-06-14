<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PowerUpBoost extends Model
{
    protected $table = 'powerup_boosts';

    public function powerups()
    {
        $this->hasMany(PowerUp::class);
    }
}

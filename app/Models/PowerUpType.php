<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PowerUpType extends Model
{
    public function powerups()
    {
        $this->hasMany(PowerUp::class);
    }
}

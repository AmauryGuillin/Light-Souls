<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PowerUpBoost extends Model
{
    protected $table = 'powerup_boosts';

    protected $fillable = ['type', 'multiplier'];

    public function powerups()
    {
        $this->hasMany(PowerUp::class);
    }
}

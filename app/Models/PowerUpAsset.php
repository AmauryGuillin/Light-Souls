<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PowerUpAsset extends Model
{
    protected $table = 'powerup_assets';

    public function powerups()
    {
        $this->hasMany(PowerUp::class);
    }
}

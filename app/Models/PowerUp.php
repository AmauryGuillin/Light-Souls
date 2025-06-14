<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PowerUp extends Model
{
    public function type()
    {
        return $this->belongsTo(PowerupType::class, 'powerup_types_id');
    }

    public function boost()
    {
        return $this->belongsTo(PowerupBoost::class, 'powerup_boosts_id');
    }

    public function asset()
    {
        return $this->belongsTo(PowerupAsset::class, 'powerup_assets_id');
    }
}

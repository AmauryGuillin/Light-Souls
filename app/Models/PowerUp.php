<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PowerUp extends Model
{

    protected $table = 'powerups';

    protected $fillable = ['powerup_types_id', 'powerup_boosts_id', 'powerup_assets_id', 'name', 'description', 'unlockLevel'];

    public function type(): BelongsTo
    {
        return $this->belongsTo(PowerUpType::class, 'powerup_types_id');
    }

    public function boost(): BelongsTo
    {
        return $this->belongsTo(PowerUpBoost::class, 'powerup_boosts_id');
    }

    public function asset(): BelongsTo
    {
        return $this->belongsTo(PowerUpAsset::class, 'powerup_assets_id');
    }
}

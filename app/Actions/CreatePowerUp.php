<?php

namespace App\Actions;

use App\Data\PowerUpFormData;
use App\Models\PowerUp;
use App\Models\PowerUpBoost;
use Illuminate\Support\Facades\DB;

class CreatePowerUp
{
    public function handle(PowerUpFormData $formData)
    {
        DB::transaction(function () use ($formData) {
            $boost = $this->createPowerUpBoost($formData);
            $this->createPowerUp($formData, $boost);
        });
    }

    private function createPowerUpBoost(PowerUpFormData $formData): PowerUpBoost
    {
        return PowerUpBoost::create([
            'type' => $formData->bonusType,
            'multiplier' => $formData->multiplier
        ]);
    }

    private function createPowerUp(PowerUpFormData $formData, PowerUpBoost $boost)
    {
        PowerUp::create([
            'powerup_types_id' => 1,
            'powerup_boosts_id' => $boost->id,
            'powerup_assets_id' => $formData->assetId,
            'name' => $formData->name,
            'description' => $formData->description,
            'unlockLevel' => $formData->unlockLevel,
        ]);
    }
}

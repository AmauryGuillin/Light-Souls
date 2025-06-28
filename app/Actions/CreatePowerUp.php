<?php

namespace App\Actions;

use App\Data\PowerUpFormData;
use App\Models\PowerUp;
use App\Models\PowerUpBoost;
use App\Models\PowerUpType;
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
        $pupType = $this->getPowerupTypeId($formData->powerupType);
        PowerUp::create([
            'powerup_types_id' => $pupType->id,
            'powerup_boosts_id' => $boost->id,
            'powerup_assets_id' => $formData->assetId,
            'name' => $formData->name,
            'description' => $formData->description,
            'unlockLevel' => $formData->unlockLevel,
        ]);
    }

    private function getPowerupTypeId(string $type): PowerUpType
    {
        return PowerUpType::where('type', $type)->first();
    }
}

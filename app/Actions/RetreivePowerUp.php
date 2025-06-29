<?php

namespace App\Actions;

use App\Models\PowerUp;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class RetreivePowerUp
{
    public function handle(int $playerLevel)
    {
        return DB::transaction(function () use ($playerLevel) {
            return $this->getThreeRandomPowerUps($playerLevel);
        });
    }

    private function getThreeRandomPowerUps(int $playerLevel): Collection
    {
        $powerUps = collect(PowerUp::with('type', 'boost', 'asset')->where('unlockLevel', '<=', $playerLevel)->get());
        if ($playerLevel >= 10) {
            $powerUps = $powerUps->filter(function ($p) {
                return $p->unlockLevel === 10;
            });
        } else if ($playerLevel >= 2) {
            $powerUps = $powerUps->filter(function ($p) {
                return $p->unlockLevel === 2;
            });
        }
        return $powerUps->random(min(3, $powerUps->count()));
    }
}

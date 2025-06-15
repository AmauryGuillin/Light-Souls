<?php

namespace App\Http\Controllers;

use App\Data\PowerUpFormData;
use App\Enum\PowerupBoosts;
use App\Models\PowerUp;
use App\Models\PowerUpAsset;
use App\Models\PowerUpBoost;
use App\Models\PowerUpType;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class PowerupController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $powerupTypes = PowerUpType::select('id', 'type')->get();
        $powerupBoosts = [PowerupBoosts::INCREASE, PowerUpBoosts::DECREASE];
        $powerupAssets = PowerUpAsset::select('path')->get();
        return Inertia::render('gameDev/PowerUpFactory', ['powerupTypes' =>  $powerupTypes, 'powerupBoosts' => $powerupBoosts, 'powerupAssets' => $powerupAssets]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(PowerUpFormData $formData)
    {
        DB::transaction(function () use ($formData) {
            $boost = PowerUpBoost::create([
                'type' => $formData->bonusType,
                'multiplier' => $formData->multiplier
            ]);

            PowerUp::create([
                'powerup_types_id' => 1,
                'powerup_boosts_id' => $boost->id,
                'powerup_assets_id' => $formData->assetId,
                'name' => $formData->name,
                'description' => $formData->description,
                'unlockLevel' => $formData->unlockLevel,
            ]);
        });
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}

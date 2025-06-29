<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('powerups', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('description');
            $table->integer('unlockLevel');
            $table->foreignId('powerup_types_id')->constrained();
            $table->foreignId('powerup_boosts_id')->constrained();
            $table->foreignId('powerup_assets_id')->constrained();
            $table->timestamps();
        });

        DB::table('powerups')->insert([
            [
                'name' => 'Ember Fist',
                'description' => 'Emplify your attack power by 25%',
                'unlockLevel' => 2,
                'powerup_types_id' => 1,
                'powerup_boosts_id' => 1,
                'powerup_assets_id' => 2,
                'created_at' => now()
            ],
            [
                'name' => 'Crystal Aegis',
                'description' => 'Emplify your defense by 25%',
                'unlockLevel' => 2,
                'powerup_types_id' => 2,
                'powerup_boosts_id' => 2,
                'powerup_assets_id' => 8,
                'created_at' => now()
            ],
            [
                'name' => 'Wind Rush',
                'description' => 'Emplify your movement speed by 10%',
                'unlockLevel' => 2,
                'powerup_types_id' => 3,
                'powerup_boosts_id' => 3,
                'powerup_assets_id' => 3,
                'created_at' => now()
            ],
            [
                'name' => 'Rapid Spark',
                'description' => 'Emplify your fire rate by 25%',
                'unlockLevel' => 2,
                'powerup_types_id' => 4,
                'powerup_boosts_id' => 4,
                'powerup_assets_id' => 5,
                'created_at' => now()
            ],
            [
                'name' => 'Rapid Spark',
                'description' => 'Restores 20% of your max HP',
                'unlockLevel' => 2,
                'powerup_types_id' => 5,
                'powerup_boosts_id' => 5,
                'powerup_assets_id' => 7,
                'created_at' => now()
            ],
            [
                'name' => 'Rune of Vitality',
                'description' => 'Increase your max HP by 5 HP',
                'unlockLevel' => 2,
                'powerup_types_id' => 6,
                'powerup_boosts_id' => 6,
                'powerup_assets_id' => 7,
                'created_at' => now()
            ], // level 5
            [
                'name' => 'Inferno Strike',
                'description' => 'Emplify your attack power by 45%',
                'unlockLevel' => 10,
                'powerup_types_id' => 1,
                'powerup_boosts_id' => 7,
                'powerup_assets_id' => 1,
                'created_at' => now()
            ],
            [
                'name' => 'Titan Guard',
                'description' => 'Emplify your defense by 35%',
                'unlockLevel' => 10,
                'powerup_types_id' => 2,
                'powerup_boosts_id' => 8,
                'powerup_assets_id' => 4,
                'created_at' => now()
            ],
            [
                'name' => 'Phantom Dash',
                'description' => 'Emplify your movement speed by 15%',
                'unlockLevel' => 10,
                'powerup_types_id' => 3,
                'powerup_boosts_id' => 9,
                'powerup_assets_id' => 6,
                'created_at' => now()
            ],
            [
                'name' => 'Blitz Core',
                'description' => 'Emplify your fire rate by 30%',
                'unlockLevel' => 10,
                'powerup_types_id' => 4,
                'powerup_boosts_id' => 10,
                'powerup_assets_id' => 5,
                'created_at' => now()
            ],
            [
                'name' => 'Elixir of Renewal',
                'description' => 'Restores 35% of your max HP',
                'unlockLevel' => 10,
                'powerup_types_id' => 5,
                'powerup_boosts_id' => 11,
                'powerup_assets_id' => 7,
                'created_at' => now()
            ],
            [
                'name' => 'Heartstone',
                'description' => 'Increase your max HP by 10 HP',
                'unlockLevel' => 10,
                'powerup_types_id' => 6,
                'powerup_boosts_id' => 12,
                'powerup_assets_id' => 7,
                'created_at' => now()
            ],
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('powerups');
    }
};

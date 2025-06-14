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
            ['name' => 'Ring of power', 'description' => 'Used by strong wizards to emplify their attack power by 5%', 'unlockLevel' => 1, 'powerup_types_id' => 1, 'powerup_boosts_id' => 1, 'powerup_assets_id' => 2, 'created_at' => now()]
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

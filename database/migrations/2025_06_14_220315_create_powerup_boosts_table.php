<?php

use App\Enum\PowerupBoosts;
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
        Schema::create('powerup_boosts', function (Blueprint $table) {
            $table->id();
            $table->string('type');
            $table->double('multiplier');
            $table->timestamps();
        });

        DB::table('powerup_boosts')->insert([
            ['type' => PowerupBoosts::INCREASE, 'multiplier' => 1.05, 'created_at' => now()]
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('powerup_boosts');
    }
};

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
        Schema::create('powerupboosts', function (Blueprint $table) {
            $table->id();
            $table->string('boost_type');
            $table->string('percentage');
            $table->float('multiplier');
            $table->timestamps();
        });

        DB::table('powerupboosts')->insert([
            ['boost_type' => PowerupBoosts::INCREASE, 'percentage' => '+10%', 'multiplier' => '1.1', 'created_at' => now()]
        ]);

        Schema::table('powerups', function (Blueprint $table) {
            $table->foreignId('powerupboost_id')->constrained();
        });

        DB::table('powerups')->insert([
            ['poweruptype_id' => 1, 'powerupboost_id' => 1, 'description' => 'Increase by 10% your attack power', 'created_at' => now()]
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('powerupboosts');
    }
};

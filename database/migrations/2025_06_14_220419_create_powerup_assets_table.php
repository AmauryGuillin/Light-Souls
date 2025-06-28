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
        Schema::create('powerup_assets', function (Blueprint $table) {
            $table->id();
            $table->string('path');
            $table->timestamps();
        });

        DB::table('powerup_assets')->insert(
            [
                ['path' => '/assets/boost/powerup_asset_1.png', 'created_at' => now()],
                ['path' => '/assets/boost/powerup_asset_2.png', 'created_at' => now()],
                ['path' => '/assets/boost/powerup_asset_3.png', 'created_at' => now()],
            ]
        );
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('powerup_assets');
    }
};

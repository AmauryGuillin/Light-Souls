<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->integer('max_survival_time')->default(0);
            $table->integer('last_game_enemies_killed')->default(0);
            $table->integer('enemies_killed_best')->default(0);
            $table->integer('total_enemies_killed')->default(0);
            $table->integer('total_game_played')->default(0);
            $table->integer('total_hour_played')->default(0);
            $table->integer('death_count')->default(0);
            $table->integer('higher_level')->default(1);
            $table->integer('total_fireball_shot')->default(0);
            $table->integer('total_player_dps')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('profiles');
    }
};

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
            $table->integer('max_survival_time')->nullable();
            $table->integer('last_game_enemies_killed')->nullable();
            $table->integer('enemies_killed_best')->nullable();
            $table->integer('total_enemies_killed')->nullable();
            $table->integer('total_game_played')->nullable();
            $table->integer('total_hour_played')->nullable();
            $table->integer('death_count')->nullable();
            $table->integer('higher_level')->nullable();
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

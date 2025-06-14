<?php

use App\Enum\PowerupTypes;
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
        Schema::create('powerup_types', function (Blueprint $table) {
            $table->id();
            $table->string('type');
            $table->timestamps();
        });

        DB::table('powerup_types')->insert([
            ['type' => PowerupTypes::ATTACK, 'created_at' => now()],
            ['type' => PowerupTypes::DEFENSE, 'created_at' => now()],
            ['type' => PowerupTypes::SPEED, 'created_at' => now()],
            ['type' => PowerupTypes::FIRERATE, 'created_at' => now()],
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('powerup_types');
    }
};

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Profile extends Model
{
    protected $fillable = [
        'user_id',
        'max_survival_time',
        'last_game_enemies_killed',
        'enemies_killed_best',
        'total_enemies_killed',
        'total_game_played',
        'total_hour_played',
        'death_count',
        'higher_level',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function settings(): HasOne
    {
        return $this->hasOne(Settings::class);
    }
}

<?php

use App\Http\Controllers\GameController;
use App\Http\Controllers\Settings\SettingsController;
use Illuminate\Support\Facades\Route;

Route::get('game/mainMenu', [GameController::class, 'launchGame'])->middleware(['auth', 'verified'])->name('mainMenu');
Route::get('game/user/profile/settings/{userId}', [SettingsController::class, 'getUserSettings'])->middleware(['auth', 'verified'])->name('getUserSettings');

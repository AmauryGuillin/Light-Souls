<?php

use App\Http\Controllers\GameController;
use Illuminate\Support\Facades\Route;

Route::get('game/mainMenu', [GameController::class, 'launchGame'])->name('mainMenu');

<?php

use App\Http\Controllers\GameController;
use App\Http\Controllers\PowerupController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome');
})->name('home');

Route::get('LightSouls', function () {
    return Inertia::render('GameScene');
})->middleware(['auth', 'verified'])->name('LightSouls');

Route::get('dashboard', [UserController::class, 'index'])->middleware(['auth', 'verified'])->name('dashboard');

Route::get('game/powerup/{playerLevel}', [GameController::class, 'powerup'])->middleware(['auth', 'verified'])->name('test');


require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
require __DIR__ . '/powerup.php';

<?php

use App\Http\Controllers\PowerupController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome');
})->name('home');

// Route::get('dashboard', function () {
//     return Inertia::render('Dashboard');
// })->middleware(['auth', 'verified'])->name('dashboard');

Route::get('LightSouls', function () {
    return Inertia::render('GameScene');
})->middleware(['auth', 'verified'])->name('LightSouls');

Route::get('dashboard', [UserController::class, 'index'])->middleware(['auth', 'verified'])->name('dashboard');
Route::get('powerupfactory', [PowerupController::class, 'index'])->middleware(['auth', 'verified'])->name('powerupfactory');
Route::post('powerupfactory', [PowerupController::class, 'store'])->middleware(['auth', 'verified'])->name('powerupfactory.store');

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';

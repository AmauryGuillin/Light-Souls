<?php

use App\Http\Controllers\PowerupController;
use Illuminate\Support\Facades\Route;

Route::get('powerupfactory', [PowerupController::class, 'index'])->middleware(['auth', 'verified'])->name('powerupfactory');
Route::post('powerupfactory', [PowerupController::class, 'store'])->middleware(['auth', 'verified'])->name('powerupfactory.store');

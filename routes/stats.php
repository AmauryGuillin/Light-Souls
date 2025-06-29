<?php

use App\Http\Controllers\Settings\ProfileController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth')->group(function () {
    Route::get('/profile/stats/{userId}', [ProfileController::class, 'show'])->name('profile.stats');
});

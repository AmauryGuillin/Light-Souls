<?php

namespace App\Http\Controllers;

use App\Actions\RetreivePowerUp;
use Inertia\Inertia;

class GameController extends Controller
{

    public function launchGame()
    {
        return Inertia::render('StartMenu');
    }

    /**
     * Display a listing of the resource.
     */
    public function powerup(int $playerLevel, RetreivePowerUp $retreivePowerUp)
    {
        return response()->json($retreivePowerUp->handle($playerLevel));
    }
}

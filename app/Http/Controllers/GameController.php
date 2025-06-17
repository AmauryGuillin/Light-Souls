<?php

namespace App\Http\Controllers;

use App\Actions\RetreivePowerUp;
use Illuminate\Http\Request;

class GameController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function powerup(int $playerLevel, RetreivePowerUp $retreivePowerUp)
    {
        return response()->json($retreivePowerUp->handle($playerLevel));
    }
}

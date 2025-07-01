<?php

namespace App\Http\Controllers;

use App\Models\Profile;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class LandingController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $totalUserNumber = User::all()->count();

        $totalEnemiesKilled = Profile::sum('total_enemies_killed');

        $bestPlayer = Profile::orderByDesc('max_survival_time')->orderByDesc('enemies_killed_best')->with('user')->first();

        $stats = [
            'users' => $totalUserNumber,
            'totalEnemiesKilled' => $totalEnemiesKilled,
            'bestPlayer' => $bestPlayer->user->name
        ];
        return Inertia::render('Landing', ['stats' => $stats]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}

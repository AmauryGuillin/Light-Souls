<?php

namespace App\Http\Controllers;

use App\Models\Profile;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LeaderBoardController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {

        $profiles = Profile::with('user')->orderByDesc('max_survival_time')->orderByDesc('enemies_killed_best')->get();

        return Inertia::render('Leaderboard', ['profiles' => $profiles]);
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

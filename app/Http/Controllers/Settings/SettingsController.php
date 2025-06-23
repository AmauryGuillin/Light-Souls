<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Models\Profile;
use App\Models\Settings;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class SettingsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    public function getUserSettings(string $userId)
    {
        $profile = Profile::where('user_id', $userId)->firstOrFail();
        return Settings::where('profile_id', $profile->id)->firstOrFail();
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
    public function update(Request $request)
    {
        DB::transaction(function () use ($request) {
            $profile = Profile::where('user_id', $request->input('user_id'))->firstOrFail();
            $settings = Settings::where('profile_id', $profile->id)->firstOrFail();

            $settings->update([
                'music_volume' => $request->input('music_volume'),
                'sound_effects_volume' => $request->input('sound_effects_volume')
            ]);

            return back();
        });
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}

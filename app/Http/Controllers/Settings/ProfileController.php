<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Http\Requests\Settings\ProfileUpdateRequest;
use App\Models\Profile;
use App\Models\User;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Show the user's profile settings page.
     */
    public function edit(Request $request): Response
    {
        return Inertia::render('settings/Profile', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => $request->session()->get('status'),
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $request->user()->fill($request->validated());

        if ($request->user()->isDirty('email')) {
            $request->user()->email_verified_at = null;
        }

        $request->user()->save();

        return to_route('home');
    }

    public function show(int $userId): Response
    {
        $user = User::where('id', $userId)->firstOrFail();
        $profile = Profile::where('user_id', $userId)->firstOrFail();
        return Inertia::render('Stats', ['user' => $user, 'profile' => $profile]);
    }

    public function updateProfileStats(Request $request): RedirectResponse
    {
        $authUser = Auth::user();
        $profile = Profile::where('user_id', $authUser->id)->firstOrFail();

        $profile->update([
            'max_survival_time' => $request->input('last_survival_time') > $profile->max_survival_time ? $profile->max_survival_time = $request->input('last_survival_time') : $profile->max_survival_time,
            'last_game_enemies_killed' => $request->input('last_game_enemies_killed'),
            'total_enemies_killed' => $profile->total_enemies_killed + $request->input('last_game_enemies_killed'),
            'total_game_played' => $profile->total_game_played + 1,
            'total_hour_played' => $profile->total_hour_played + $request->input('last_survival_time'),
            'enemies_killed_best' => $request->input('last_game_enemies_killed') > $profile->enemies_killed_best ? $profile->enemies_killed_best = $request->input('last_game_enemies_killed') : $profile->enemies_killed_best = $profile->enemies_killed_best,
            'death_count' => $request->input('is_player_dead') ? $profile->death_count + 1 : $profile->death_count + 0,
            'higher_level' => $request->input('last_game_level') > $profile->higher_level ? $request->input('last_game_level') : $profile->higher_level,
            'total_fireball_shot' => $profile->total_fireball_shot += $request->input('total_fireball_shot'),
            'total_player_dps' => $profile->total_player_dps += $request->input('total_player_dps'),
        ]);

        return back();
    }

    /**
     * Delete the user's profile.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}

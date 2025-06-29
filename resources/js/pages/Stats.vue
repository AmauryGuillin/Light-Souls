<script setup lang="ts">
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link, usePage } from '@inertiajs/vue3';
import { Award, Clock, Crosshair, GamepadIcon, LogIn, LogOut, Play, Shield, Skull, Target, Trophy, Zap } from 'lucide-vue-next';
import { computed } from 'vue';

const props = defineProps<{
    user: any;
    profile: any;
}>();

const page = usePage();
const auth = (page.props as { auth?: { user?: any } }).auth;
const userPage = auth?.user;
const isAuthenticated = computed(() => !!userPage);
const isUserHasDevRole = computed(() => userPage?.role_id === 2);
const totalTimePlayed = new Date(props.profile.total_hour_played * 1000).toISOString().substring(11, 16);
const maxSurvivalTime = new Date(props.profile.max_survival_time * 1000).toISOString().substring(11, 16);

function lauchGame() {
    window.open('https://light-souls.test/game/mainMenu');
}
</script>

<template>
    <header class="border-b border-white/10 bg-black/20 backdrop-blur-sm">
        <div class="container mx-auto px-4 py-4">
            <nav class="flex items-center justify-between">
                <div class="flex items-center space-x-2">
                    <!-- <Swords class="h-8 w-8" /> -->
                    <Link :href="'/'" class="font-game cursor-pointer text-2xl font-bold text-white">Light Souls</Link>
                </div>
                <div class="hidden items-center space-x-6 md:flex">
                    <Link :href="`/profile/stats/${userPage.id}`" class="text-white transition-colors hover:text-red-300"> Profile </Link>
                    <Link href="/leaderboard" class="text-white transition-colors hover:text-red-300"> Leaderboard </Link>
                    <a
                        href="https://github.com/AmauryGuillin/Light-Souls"
                        target="_blank"
                        rel="noopener"
                        class="text-white transition-colors hover:text-red-300"
                    >
                        GitHub
                    </a>
                    <Link href="/about" class="text-white transition-colors hover:text-red-300"> About </Link>
                    <Link v-if="isUserHasDevRole" href="/powerupfactory" class="text-white transition-colors hover:text-red-300"
                        >Powerup Factory</Link
                    >
                </div>
                <div class="flex space-x-2">
                    <Button v-if="isAuthenticated" asChild class="cursor-pointer bg-red-600 text-white hover:bg-red-700" @click="lauchGame">
                        <div>
                            <Play class="mr-2 h-4 w-4" />
                            Play Now
                        </div>
                    </Button>
                    <Button v-if="isAuthenticated" asChild class="cursor-pointer bg-orange-500 text-white hover:bg-orange-700">
                        <Link href="/logout" method="post">
                            <LogOut class="h-4 w-4" />
                            Disconnect
                        </Link>
                    </Button>
                    <Button v-if="!isAuthenticated" asChild class="cursor-pointer bg-red-600 text-white hover:bg-red-700">
                        <Link href="/login">
                            <LogIn class="h-4 w-4" />
                            Login
                        </Link>
                    </Button>
                    <Button v-if="!isAuthenticated" asChild class="cursor-pointer bg-red-600 text-white hover:bg-red-700">
                        <Link href="/register">
                            <LogIn class="h-4 w-4" />
                            Register
                        </Link>
                    </Button>
                </div>
            </nav>
        </div>
    </header>
    <div class="min-h-screen bg-gradient-to-tr from-black via-gray-900 to-red-700 p-4">
        <div class="mx-auto max-w-6xl space-y-6">
            <Card class="border-red-500/30 bg-black/40 backdrop-blur-sm">
                <CardContent class="p-6">
                    <div class="flex items-center gap-6">
                        <div class="relative">
                            <Avatar class="h-32 w-32 border-2 border-red-500">
                                <AvatarImage src="/assets/player/profile-pic.jpg" alt="@unovue" />
                                <AvatarFallback>CN</AvatarFallback>
                            </Avatar>
                            <Badge class="absolute -right-2 -bottom-2 bg-red-600 hover:bg-red-600"> LVL {{ profile.higher_level || 'N/A' }} </Badge>
                        </div>
                        <div class="flex-1">
                            <h1 class="mb-2 text-4xl font-bold text-white">{{ user.name || 'N/A' }}</h1>
                            <p class="mb-4 text-lg text-red-300">Elite Survivor</p>
                            <div class="flex gap-4 text-sm text-gray-300">
                                <div class="flex items-center gap-2">
                                    <GamepadIcon class="h-4 w-4" />
                                    <span>{{ profile.total_game_played || 'N/A' }} Games Played</span>
                                </div>
                                <div class="flex items-center gap-2">
                                    <Clock class="h-4 w-4" />
                                    <span>{{ totalTimePlayed || 'N/A' }}h Total Playtime</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card class="border-red-500/30 bg-red-900/20 backdrop-blur-sm">
                    <CardHeader class="pb-3">
                        <CardTitle class="flex items-center gap-2 text-red-400">
                            <Shield class="h-5 w-5" />
                            Max Survival
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div class="mb-1 text-2xl font-bold text-white">{{ maxSurvivalTime || 'N/A' }}h</div>
                        <p class="text-sm text-red-300">Personal Best</p>
                    </CardContent>
                </Card>

                <Card class="border-red-600/40 bg-red-900/30 backdrop-blur-sm">
                    <CardHeader class="pb-3">
                        <CardTitle class="flex items-center gap-2 text-red-400">
                            <Trophy class="h-5 w-5" />
                            Highest Level
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div class="mb-1 text-2xl font-bold text-white">{{ profile.higher_level || 'N/A' }}</div>
                    </CardContent>
                </Card>

                <Card class="border-red-400/40 bg-red-800/30 backdrop-blur-sm">
                    <CardHeader class="pb-3">
                        <CardTitle class="flex items-center gap-2 text-red-300">
                            <Target class="h-5 w-5" />
                            Best Kill Streak
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div class="mb-1 text-2xl font-bold text-white">{{ profile.enemies_killed_best || 'N/A' }}</div>
                        <p class="text-sm text-red-200">Single Game Record</p>
                    </CardContent>
                </Card>

                <Card class="border-red-500/35 bg-red-900/25 backdrop-blur-sm">
                    <CardHeader class="pb-3">
                        <CardTitle class="flex items-center gap-2 text-red-400">
                            <Crosshair class="h-5 w-5" />
                            Last Game Kills
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div class="mb-1 text-2xl font-bold text-white">{{ profile.last_game_enemies_killed || 'N/A' }}</div>
                        <p class="text-sm text-red-300">Recent Performance</p>
                    </CardContent>
                </Card>
            </div>

            <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <Card class="border-red-500/25 bg-black/30 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle class="flex items-center gap-2 text-red-400">
                            <Zap class="h-5 w-5" />
                            Combat Statistics
                        </CardTitle>
                    </CardHeader>
                    <CardContent class="space-y-4">
                        <div class="flex items-center justify-between">
                            <span class="text-gray-300">Total Enemies Killed</span>
                            <span class="text-lg font-bold text-white">{{ profile.total_enemies_killed?.toLocaleString() || 'N/A' }}</span>
                        </div>
                        <div class="flex items-center justify-between">
                            <span class="text-gray-300">Total shot fired</span>
                            <span class="font-bold text-white">N/A</span>
                        </div>
                        <div class="flex items-center justify-between">
                            <span class="text-gray-300">Death Count</span>
                            <span class="flex items-center gap-1 font-bold text-red-400">
                                <Skull class="h-4 w-4" />
                                {{ profile.death_count || 'N/A' }}
                            </span>
                        </div>
                    </CardContent>
                </Card>

                <Card class="border-red-500/25 bg-black/30 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle class="flex items-center gap-2 text-red-400">
                            <Award class="h-5 w-5" />
                            Performance Metrics
                        </CardTitle>
                    </CardHeader>
                    <CardContent class="space-y-4">
                        <div class="flex items-center justify-between">
                            <span class="text-gray-300">Total dps (all games)</span>
                            <span class="font-bold text-white"> N/A </span>
                        </div>
                        <div class="flex items-center justify-between">
                            <span class="text-gray-300">Games Played</span>
                            <span class="font-bold text-white">{{ profile.total_game_played || 'N/A' }}</span>
                        </div>
                        <div class="flex items-center justify-between">
                            <span class="text-gray-300">Total Hours</span>
                            <span class="flex items-center gap-1 font-bold text-red-400">
                                <Clock class="h-4 w-4" />
                                {{ profile.total_hour_played || 'N/A' }}h
                            </span>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    </div>
</template>

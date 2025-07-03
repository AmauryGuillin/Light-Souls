<script setup lang="ts">
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from '@inertiajs/vue3';
import { Award, Clock, Crosshair, GamepadIcon, Shield, Skull, Target, Trophy, Zap } from 'lucide-vue-next';
import Nav from './Nav.vue';

const props = defineProps<{
    user: any;
    profile: any;
}>();

const totalTimePlayed = new Date(props.profile.total_hour_played * 1000).toISOString().substring(11, 16);
const maxSurvivalTime = new Date(props.profile.max_survival_time * 1000).toISOString().substring(11, 16);
</script>

<template>
    <div class="min-h-screen bg-gradient-to-tr from-black via-gray-900 to-red-700">
        <Nav />
        <div class="mx-auto max-w-6xl space-y-6 pt-10">
            <Card class="border-red-500/30 bg-black/40 backdrop-blur-sm">
                <CardContent class="p-6">
                    <div class="flex items-center gap-6">
                        <div class="relative">
                            <Avatar class="h-32 w-32 border-2 border-red-500">
                                <AvatarImage src="/assets/player/profile-pic.jpg" alt="@unovue" />
                                <AvatarFallback>CN</AvatarFallback>
                            </Avatar>
                            <Badge class="absolute -right-2 -bottom-2 bg-red-600 hover:bg-red-600"> LVL {{ profile.higher_level || '1' }} </Badge>
                        </div>
                        <div class="flex-1">
                            <h1 class="mb-2 text-4xl font-bold text-white">{{ user.name || 'Username' }}</h1>
                            <p class="mb-4 text-lg text-red-300">Elite Survivor</p>
                            <div class="flex gap-4 text-sm text-gray-300">
                                <div class="flex items-center gap-2">
                                    <GamepadIcon class="h-4 w-4" />
                                    <span>{{ profile.total_game_played || '0' }} Games Played</span>
                                </div>
                                <div class="flex items-center gap-2">
                                    <Clock class="h-4 w-4" />
                                    <span>{{ totalTimePlayed || '00:00' }}h Total Playtime</span>
                                </div>
                            </div>
                        </div>
                        <div>
                            <Button variant="secondary">
                                <Link :href="'/settings/profile'">Settings</Link>
                            </Button>
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
                        <div class="mb-1 text-2xl font-bold text-white">{{ maxSurvivalTime || '00:00' }}h</div>
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
                        <div class="mb-1 text-2xl font-bold text-white">{{ profile.higher_level || '1' }}</div>
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
                        <div class="mb-1 text-2xl font-bold text-white">{{ profile.enemies_killed_best || '0' }}</div>
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
                        <div class="mb-1 text-2xl font-bold text-white">{{ profile.last_game_enemies_killed || '0' }}</div>
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
                            <span class="text-lg font-bold text-white">{{ profile.total_enemies_killed?.toLocaleString() || '0' }}</span>
                        </div>
                        <div class="flex items-center justify-between">
                            <span class="text-gray-300">Total shot fired</span>
                            <span class="font-bold text-white"> {{ profile.total_fireball_shot || '0' }}</span>
                        </div>
                        <div class="flex items-center justify-between">
                            <span class="text-gray-300">Death Count</span>
                            <span class="flex items-center gap-1 font-bold text-red-400">
                                <Skull class="h-4 w-4" />
                                {{ profile.death_count || '0' }}
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
                            <span class="font-bold text-white"> {{ profile.total_player_dps || '0' }} </span>
                        </div>
                        <div class="flex items-center justify-between">
                            <span class="text-gray-300">Games Played</span>
                            <span class="font-bold text-white">{{ profile.total_game_played || '0' }}</span>
                        </div>
                        <div class="flex items-center justify-between">
                            <span class="text-gray-300">Total Hours</span>
                            <span class="flex items-center gap-1 font-bold text-red-400">
                                <Clock class="h-4 w-4" />
                                {{ totalTimePlayed || '00:00' }}h
                            </span>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    </div>
</template>

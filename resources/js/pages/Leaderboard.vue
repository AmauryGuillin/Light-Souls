<script setup lang="ts">
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCaption, TableCell, TableRow } from '@/components/ui/table';
import { lauchGame } from '@/utils/game/game-utils';
import { Link, usePage } from '@inertiajs/vue3';
import { Crown, LogIn, LogOut, Play } from 'lucide-vue-next';
import { computed } from 'vue';

defineProps<{
    profiles: any;
}>();

const page = usePage();
const auth = (page.props as { auth?: { user?: any } }).auth;
const user = auth?.user;
const isAuthenticated = computed(() => !!user);
const isUserHasDevRole = computed(() => user?.role_id === 2);
</script>

<template>
    <div class="min-h-screen bg-gradient-to-br from-gray-900 via-red-950 to-black">
        <header class="border-b border-white/10 bg-black/20 backdrop-blur-sm">
            <div class="container mx-auto px-4 py-4">
                <nav class="flex items-center justify-between">
                    <div class="flex items-center space-x-2">
                        <!-- <Swords class="h-8 w-8" /> -->
                        <Link :href="'/'" class="font-game cursor-pointer text-2xl font-bold text-white">Light Souls</Link>
                    </div>
                    <div class="hidden items-center space-x-6 md:flex">
                        <Link :href="`/profile/stats/${user?.id}`" class="text-white transition-colors hover:text-red-300"> Profile </Link>
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
        <div class="flex w-full flex-col items-center justify-center gap-5 pt-10">
            <h1 class="font-game text-5xl font-bold underline underline-offset-8">LEADERBOARD</h1>
            <h1 class="text-2xl font-bold">Top players</h1>
            <div class="w-1/2">
                <Table>
                    <TableCaption>Light Souls - leaderboard</TableCaption>
                    <TableBody>
                        <TableRow v-for="(profile, i) in profiles" :key="profile.id" class="hover:bg-red-500/30">
                            <TableCell class="font-medium">
                                <Crown v-if="i === 0" class="text-yellow-300" />
                                <span v-if="i != 0" class="text-lg"> #{{ i + 1 }} </span>
                            </TableCell>
                            <TableCell>
                                <Avatar class="h-10 w-10">
                                    <AvatarFallback class="bg-from-black bg-gradient-to-tr from-black via-black to-red-700">{{
                                        profile.user.name.charAt(0).toUpperCase() || 'X'
                                    }}</AvatarFallback>
                                </Avatar>
                            </TableCell>
                            <TableCell>
                                <div class="flex gap-5">
                                    <div class="mb-1 flex items-center gap-2">
                                        <Link
                                            :href="`profile/stats/${profile.user.id}`"
                                            class="cursor-pointer text-lg font-semibold text-white hover:text-white/50"
                                        >
                                            {{ profile.user.name || 'Anonymous' }}
                                        </Link>
                                    </div>
                                    <div class="flex items-center gap-3">
                                        <Badge variant="outline" class="border-red-600/50 bg-red-950/30 text-red-300">
                                            Level {{ profile.higher_level || '0' }}
                                        </Badge>
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell class="text-right">
                                <div class="text-2xl font-bold">{{ profile.total_enemies_killed || '0' }}</div>
                                <div>Points</div>
                            </TableCell>
                            <TableCell class="text-center">
                                <Badge v-if="i === 0" class="rounded-2xl bg-yellow-600 font-bold text-yellow-100">CHAMPION</Badge>
                                <Badge v-if="i === 1" class="rounded-2xl bg-gray-600 font-bold text-gray-100">RUNNER-UP</Badge>
                                <Badge v-if="i === 2" class="rounded-2xl bg-amber-600 font-bold text-amber-100">THIRD</Badge>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </div>
        </div>
    </div>
</template>

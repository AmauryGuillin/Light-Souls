<script setup lang="ts">
import { Button } from '@/components/ui/button';
import { lauchGame } from '@/utils/game/game-utils';
import { Link, usePage } from '@inertiajs/vue3';
import { LogIn, LogOut, Play } from 'lucide-vue-next';
import { computed } from 'vue';

const page = usePage();
const auth = (page.props as { auth?: { user?: any } }).auth;
const user = auth?.user;
const isAuthenticated = computed(() => !!user);
const isUserHasDevRole = computed(() => user?.role_id === 2);
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
</template>

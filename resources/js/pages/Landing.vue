<script setup lang="ts">
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { lauchGame } from '@/utils/game/game-utils';
import { ArrowRight, Play, Trophy, Users, Zap } from 'lucide-vue-next';
import Nav from './Nav.vue';

const props = defineProps<{
    stats: {
        users: number;
        totalEnemiesKilled: number;
        bestPlayer: string;
    };
}>();

const tutorialCardsContent = [
    {
        id: 1,
        title: 'Move Your Character',
        description: 'Use WASD on your keyboard to move you character',
        image: ['/assets/tutorial/1/tutorial_1.png', '/assets/player/main-menu-player.gif'],
        subDescription: 'Keys used to move your character can be changed in the settings (WASD and ZQSD available).',
    },
    {
        id: 2,
        title: 'Automatic Shoot',
        description: 'No need to click your screen to fire a shot.',
        image: ['/assets/tutorial/2/tutorial_2.gif'],
        subDescription: "It would've been too easy if you could choose when to shoot. :)",
    },
    {
        id: 3,
        title: 'Shoot In Two Directions',
        description: 'Use your mouse cursor to control your shooting direction.',
        image: ['/assets/tutorial/3/tutorial_3_2.gif'],
        subDescription:
            'Your player is the reference point. Move your cursor to the right of your player to shoot right, or to the left to shoot left.',
    },
    {
        id: 4,
        title: 'Select Power-Ups',
        description: 'Each time you level up, choose a power-up to boost your progress.',
        image: ['/assets/tutorial/4/tutorial_4.jpg'],
        subDescription: 'Three power-ups are selected at random. Choose wisely!',
    },
];
</script>

<template>
    <div class="min-h-screen bg-gradient-to-tr from-gray-900 via-black to-red-700">
        <!-- Navigation Header -->
        <Nav />
        <!-- Hero Section -->
        <section class="px-4 py-20">
            <div class="container mx-auto text-center">
                <!-- <Badge class="mb-6 border-purple-500/30 bg-purple-600/20 text-white">badge</Badge> -->
                <h1 class="font-game mb-6 bg-clip-text text-5xl font-bold text-white md:text-7xl">Light Souls</h1>
                <p class="mx-auto mb-8 max-w-3xl text-xl leading-relaxed text-gray-300 md:text-2xl">
                    Survive as long as possible against a horde of enemies desperate to take you down. Gain levels, improve your skills and become the
                    best player on the leaderboard thanks to your extraordinary abilities!
                </p>
                <div class="flex flex-col items-center justify-center gap-4 sm:flex-row">
                    <Button
                        size="lg"
                        asChild
                        class="cursor-pointer bg-gradient-to-r from-red-600 to-red-800 px-8 py-6 text-lg text-white hover:from-red-700 hover:to-red-900"
                        @click="lauchGame"
                    >
                        <div>
                            <Play class="mr-2 h-5 w-5" />
                            Start Playing
                        </div>
                    </Button>
                    <!-- <Button size="lg" variant="outline" class="border-white/20 bg-white/10 px-8 py-6 text-lg text-white hover:bg-white/20">
                        Watch Trailer
                    </Button> -->
                </div>

                <!-- Game Stats  -->
                <div class="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 md:grid-cols-3">
                    <div class="text-center">
                        <div class="mb-2 flex items-center justify-center">
                            <Users class="mr-2 h-6 w-6 text-purple-400" />
                            <span class="text-3xl font-bold text-white">{{ props.stats?.users || '0' }}</span>
                        </div>
                        <p class="text-gray-400">Total Players</p>
                    </div>
                    <div class="text-center">
                        <div class="mb-2 flex items-center justify-center">
                            <Trophy class="mr-2 h-6 w-6 text-yellow-400" />
                            <span class="text-3xl font-bold text-white">{{ props.stats?.totalEnemiesKilled || '0' }}</span>
                        </div>
                        <p class="text-gray-400">Total enemies killed</p>
                    </div>
                    <div class="text-center">
                        <div class="mb-2 flex items-center justify-center">
                            <Zap class="mr-2 h-6 w-6 text-blue-400" />
                            <span class="text-3xl font-bold text-white">{{ props.stats?.bestPlayer || '0' }}</span>
                        </div>
                        <p class="text-gray-400">Best player</p>
                    </div>
                </div>
            </div>
        </section>

        <!-- Tutorial Section  -->
        <section class="bg-black/20 px-4 py-20">
            <div class="container mx-auto">
                <div class="mb-16 text-center">
                    <h2 class="mb-4 text-4xl font-bold text-white md:text-5xl">How to Play</h2>
                    <p class="mx-auto max-w-2xl text-xl text-gray-300">
                        Master the game in just a few simple steps. Follow this tutorial to become a pro player!
                    </p>
                </div>

                <div class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                    <Card
                        v-for="card in tutorialCardsContent"
                        :key="card.id"
                        class="border-white/10 bg-white/5 backdrop-blur-sm transition-all duration-300 hover:bg-white/10"
                    >
                        <CardHeader>
                            <div class="mb-4 flex items-center justify-end">
                                <!-- <Badge class="border-purple-500/30 bg-purple-600/20 text-purple-300">Step 1</Badge> -->
                                <div class="flex h-12 w-12 items-center justify-center rounded-full bg-red-700">
                                    <span class="text-xl font-bold text-purple-300">{{ card.id }}</span>
                                </div>
                            </div>
                            <CardTitle class="text-xl text-white">{{ card.title }}</CardTitle>
                            <CardDescription class="text-gray-300">
                                {{ card.description }}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div class="flex items-center justify-center">
                                <img
                                    v-for="image in card.image"
                                    :key="image"
                                    :src="image"
                                    alt="tutorial image"
                                    width="{200}"
                                    height="{200}"
                                    class="mb-4 h-48 w-full rounded-lg object-contain"
                                />
                            </div>
                            <p class="text-sm text-gray-400">{{ card.subDescription }}</p>
                        </CardContent>
                    </Card>
                </div>

                <div class="mt-16 text-center">
                    <Button
                        size="lg"
                        asChild
                        class="cursor-pointer bg-gradient-to-r from-red-600 to-red-800 px-8 py-6 text-lg text-white hover:from-red-700 hover:to-red-900"
                    >
                        <Button @click="lauchGame">
                            Ready to Play?
                            <ArrowRight class="ml-2 h-5 w-5" />
                        </Button>
                    </Button>
                </div>
            </div>
        </section>
    </div>
</template>

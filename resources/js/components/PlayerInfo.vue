<script setup lang="ts">
import { Heart } from 'lucide-vue-next';
import { watch } from 'vue';
import { ExperienceBar } from './ui/progress-experience-bar';
const props = defineProps<{
    isGameDevModeEnabled: boolean;
    playerHP: number;
    playerScore: number;
    playerXP: number;
    playerLevel: number;
    playerSpawnState: boolean;
    playerFireRate: number;
    previousPlayerFireRate: number;
}>();

let percentage = 1;

watch(
    () => props.playerXP,
    () => {
        if (props.playerSpawnState) percentage = Math.round((props.playerXP / (props.playerLevel * 100)) * 100);
        if (percentage > 100) {
            percentage = 100;
        }
    },
);
</script>

<template>
    <!-- <div class="font-game mt-5 ml-5 flex flex-col gap-2">
        <div class="flex flex-col gap-2 bg-black/70 p-5">
            <HealthBar class="z-50 h-5 w-2/5 bg-white" :model-value="props.playerHP" />
            <ExperienceBar class="z-50 w-1/5 bg-white" :model-value="percentage" />
        </div>
        <div v-if="props.isGameDevModeEnabled" class="az-50 font-bold text-red-500">{{ props.playerHP }} HP</div>
        <div class="font-game z-50 w-fit rounded bg-black/70 px-2 py-1 text-lg text-red-400">Level : {{ props.playerLevel }}</div>
        <div class="z-50 font-bold text-red-500">Score : {{ props.playerScore }}</div>
        <div v-if="props.isGameDevModeEnabled" class="z-50 font-bold text-red-500">FireRate: {{ props.playerFireRate }}</div>
        <div v-if="props.isGameDevModeEnabled" class="z-50 font-bold text-red-500">Enemy HP: {{ 100 * (props.playerLevel / 2) }}</div>
    </div> -->
    <ExperienceBar class="z-50 w-full bg-black/75" :model-value="percentage" />
    <div class="m-5 flex w-1/5 flex-col gap-5">
        <div class="flex min-w-96 flex-col gap-3">
            <div class="rounded-lg border-2 border-red-500/70 bg-slate-900/90 p-3 shadow-lg backdrop-blur-sm">
                <div class="mb-2 flex items-center gap-2">
                    <Heart class="h-5 w-5 text-red-500" />
                    <span class="text-sm font-bold tracking-wider text-red-400">HEALTH</span>
                    <span class="ml-auto text-sm font-bold text-white">{{ props.playerHP }}/100</span>
                </div>
                <div class="h-4 w-full rounded-full border border-slate-600 bg-slate-700 shadow-inner">
                    <div
                        class="h-full rounded-full bg-gradient-to-r from-red-600 via-red-500 to-red-400 shadow-sm transition-all duration-500"
                        :style="{ width: `${props.playerHP}%` }"
                    />
                </div>
            </div>
        </div>
        <div class="font-game absolute top-32 right-0 z-10 w-fit -translate-y-1/2 transform">
            <div class="rounded-l-lg border-t border-b border-l border-white/20 bg-black/70 px-3 py-6 backdrop-blur-sm">
                <div class="flex flex-col gap-4 text-center">
                    <div>
                        <div class="font-mono text-xs text-white/50">Level</div>
                        <div class="font-mono text-lg font-bold text-white/80">{{ props.playerLevel }}</div>
                    </div>
                    <div class="h-px w-full bg-white/20"></div>
                    <div>
                        <div class="font-mono text-xs text-white/50">Score</div>
                        <div class="font-mono text-sm text-white/80">{{ props.playerScore === 0 ? '0000' : props.playerScore }}</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

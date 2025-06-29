<script setup lang="ts">
import { Heart } from 'lucide-vue-next';
import { watch } from 'vue';
import { ExperienceBar } from './ui/progress-experience-bar';
const props = defineProps<{
    isGameDevModeEnabled: boolean;
    playerHP: number;
    playerMaxHP: number;
    playerScore: number;
    playerXP: number;
    playerLevel: number;
    playerSpawnState: boolean;
    playerFireRate: number;
    previousPlayerFireRate: number;
}>();

let percentage = 1;
const pad = '0000';

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
    <ExperienceBar class="z-50 w-full bg-black/75" :model-value="percentage" :class="`${percentage >= 100 ? 'animate-pulse' : ''}`" />
    <div class="z-50 m-5 flex w-1/5 flex-col">
        <div class="flex min-w-96 flex-col">
            <div class="rounded-lg border-2 border-red-500/70 bg-slate-900/90 p-3 shadow-lg backdrop-blur-sm">
                <div class="mb-2 flex w-fit items-center gap-2">
                    <Heart class="h-5 w-5 text-red-500" />
                    <span class="text-sm font-bold tracking-wider text-red-400">HEALTH</span>
                    <span class="ml-auto text-sm font-bold text-white">{{ Math.floor(props.playerHP) }}/{{ Math.floor(props.playerMaxHP) }}</span>
                </div>
                <div class="h-4 w-full rounded-full border border-slate-600 bg-slate-700 shadow-inner">
                    <div
                        class="h-full rounded-full bg-gradient-to-r from-red-600 via-red-500 to-red-400 shadow-sm transition-all duration-500"
                        :style="{ width: `${Math.round((props.playerHP / props.playerMaxHP) * 100)}%` }"
                    />
                </div>
            </div>
            <div
                class="mx-auto flex w-fit items-center justify-center rounded-br-lg rounded-bl-lg border-r-2 border-b-2 border-l-2 border-white/20 bg-black/70 backdrop-blur-sm"
            >
                <div class="flex gap-4 px-4 text-center">
                    <div>
                        <div class="font-mono text-xs text-green-400">Level</div>
                        <div class="font-mono text-lg font-bold text-white/80">{{ props.playerLevel }}</div>
                    </div>
                    <div>
                        <div class="font-mono text-xs text-amber-500">Score</div>
                        <div class="font-mono text-lg text-white/80">
                            {{
                                props.playerScore === 0
                                    ? '0000'
                                    : pad.substring(0, pad.length - props.playerScore.toString().length) + props.playerScore
                            }}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ExperienceBar } from '@/components/ui/progress-experience-bar';
import { HealthBar } from '@/components/ui/progress-health-bar';
import { watch } from 'vue';
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
    <div class="mt-5 ml-5 flex flex-col gap-2">
        <HealthBar class="z-50 h-3 w-96 bg-white" :model-value="props.playerHP" />
        <ExperienceBar class="z-50 w-96 bg-white" :model-value="percentage" />
        <div v-if="props.isGameDevModeEnabled" class="az-50 font-bold text-red-500">{{ props.playerHP }} HP</div>
        <div class="z-50 font-bold text-red-500">Level: {{ props.playerLevel }}</div>
        <div class="z-50 font-bold text-red-500">Score: {{ props.playerScore }}</div>
        <div v-if="props.isGameDevModeEnabled" class="z-50 font-bold text-red-500">FireRate: {{ props.playerFireRate }}</div>
        <div v-if="props.isGameDevModeEnabled" class="z-50 font-bold text-red-500">Enemy HP: {{ 100 * (props.playerLevel / 2) }}</div>
    </div>
</template>

<script setup lang="ts">
import { ExperienceBar } from '@/components/ui/progress-experience-bar';
import { HealthBar } from '@/components/ui/progress-health-bar';
const props = defineProps<{
    isGameDevModeEnabled: boolean;
    playerHP: number;
    playerScore: number;
}>();
</script>

<template>
    <div class="mt-5 ml-5 flex flex-col gap-2">
        <HealthBar class="z-50 h-3 w-96 bg-white" :model-value="props.playerHP" />
        <ExperienceBar class="z-50 w-96 bg-white" :model-value="80" />
        <div v-if="props.isGameDevModeEnabled" class="az-50 font-bold text-red-500">{{ props.playerHP }} HP</div>
        <div class="z-50 font-bold text-red-500">Score: {{ props.playerScore }}</div>
    </div>
</template>

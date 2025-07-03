<script setup lang="ts">
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Loader2 } from 'lucide-vue-next';
import PowerUpDialogContent from './PowerUpDialogContent.vue';
import { ScrollArea } from './ui/scroll-area';

const props = defineProps<{
    isBoostPageOpen: boolean;
    isPowerUpLoading: boolean;
    playerPowerUps: any[];
}>();

// const emits = defineEmits(['update:HandlePauseStateWhenBonusPageOpen']);
const emits = defineEmits<{
    (e: 'update:HandlePauseStateWhenBonusPageOpen'): void;
    (e: 'update:upgradePlayerAttributes', powerup: any): any;
}>();
</script>

<template>
    <Dialog :open="props.isBoostPageOpen">
        <PowerUpDialogContent class="max-w-4xl border-slate-600 bg-slate-800 text-white">
            <DialogHeader class="pb-6 text-center">
                <DialogTitle class="mb-2 text-3xl font-bold text-amber-400">Choose Your Power</DialogTitle>
                <p class="text-lg text-slate-300">Select one upgrade to enhance your abilities</p>
            </DialogHeader>

            <div class="grid grid-cols-1 gap-6 md:grid-cols-3">
                <Card
                    v-for="powerup in props.playerPowerUps"
                    :key="powerup.id"
                    class="group border-slate-600 bg-slate-700 transition-all duration-300 hover:border-amber-500 hover:shadow-lg hover:shadow-amber-500/20"
                >
                    <CardContent v-if="isPowerUpLoading" class="flex flex-col items-center justify-center space-y-4 p-6 text-center">
                        Loading...<Loader2 class="animate-spin" />
                    </CardContent>
                    <CardContent v-else class="space-y-4 p-6 text-center">
                        <div class="flex justify-center">
                            <div
                                class="flex h-20 w-20 items-center justify-center rounded-lg border-2 border-slate-500 bg-slate-600 transition-colors duration-300 group-hover:border-amber-400"
                            >
                                <img :src="powerup.asset.path" :alt="powerup.name" class="h-16 w-16 object-cover" />
                            </div>
                        </div>

                        <h3 class="text-xl font-bold text-amber-300 transition-colors duration-300 group-hover:text-amber-200">
                            {{ powerup.name }}
                        </h3>

                        <ScrollArea class="h-[75px]">
                            <p class="flex items-center text-sm leading-relaxed text-slate-300">
                                {{ powerup.description }}
                            </p>
                        </ScrollArea>

                        <Button
                            @Click="emits('update:upgradePlayerAttributes', powerup)"
                            class="w-full transform rounded-lg bg-amber-600 px-4 py-3 font-bold text-white transition-all duration-300 hover:scale-105 hover:bg-amber-500 hover:shadow-lg hover:shadow-amber-500/30"
                        >
                            SELECT
                        </Button>
                    </CardContent>
                </Card>
            </div>

            <div class="border-t border-slate-600 pt-4 text-center">
                <p class="text-sm text-slate-400">Choose wisely - this decision will shape your journey ahead</p>
            </div>
        </PowerUpDialogContent>
    </Dialog>
</template>

<script setup lang="ts">
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { defineEmits, defineProps } from 'vue';

const props = defineProps<{
    open: boolean;
    isGameDevModeEnabled: boolean;
    isEnemiesEnabled: boolean;
    isPlayerProjectilesEnabled: boolean;
}>();

const emits = defineEmits<{
    (e: 'update:isGameDevModeEnabled', value: boolean): void;
    (e: 'update:isEnemiesEnabled', value: boolean): void;
    (e: 'update:isPlayerProjectilesEnabled', value: boolean): void;
    (e: 'resume'): void;
}>();
</script>

<template>
    <Dialog :open="props.open">
        <DialogContent>
            <DialogHeader class="gap-10">
                <DialogTitle>
                    <h1 class="flex items-center justify-center text-4xl">GAME PAUSED</h1>
                </DialogTitle>
                <DialogDescription class="h-80">
                    <div class="flex items-center gap-2">
                        <Label>Enable Game Dev mode</Label>
                        <Switch :model-value="props.isGameDevModeEnabled" @update:model-value="(val) => emits('update:isGameDevModeEnabled', val)" />
                    </div>
                    <div v-if="props.isGameDevModeEnabled" class="flex items-center gap-2">
                        <Label>Enable Enemies</Label>
                        <Switch :model-value="props.isEnemiesEnabled" @update:model-value="(val) => emits('update:isEnemiesEnabled', val)" />
                    </div>
                    <div v-if="props.isGameDevModeEnabled" class="flex items-center gap-2">
                        <Label>Enable player's projectiles</Label>
                        <Switch
                            :model-value="props.isPlayerProjectilesEnabled"
                            @update:model-value="(val) => emits('update:isPlayerProjectilesEnabled', val)"
                        />
                    </div>
                </DialogDescription>
            </DialogHeader>
            <DialogFooter>
                <Button type="button" class="cursor-pointer" @click="emits('resume')">Resume</Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
</template>

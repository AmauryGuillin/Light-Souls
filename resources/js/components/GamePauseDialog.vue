<script setup lang="ts">
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { usePage } from '@inertiajs/vue3';
import { LoaderCircle } from 'lucide-vue-next';
import { computed, defineEmits, defineProps } from 'vue';
import { Slider } from './ui/slider';

const props = defineProps<{
    open: boolean;
    isGameDevModeEnabled: boolean;
    isEnemiesEnabled: boolean;
    isPlayerProjectilesEnabled: boolean;
    musicVolume: number;
    soundEffectsVolume: number;
    keyboardConfig: string;
    isLoading: boolean;
}>();

const emits = defineEmits<{
    (e: 'update:isGameDevModeEnabled', value: boolean): void;
    (e: 'update:isEnemiesEnabled', value: boolean): void;
    (e: 'update:isPlayerProjectilesEnabled', value: boolean): void;
    (e: 'update:musicVolume', value: number): void;
    (e: 'update:soundEffectsVolume', value: number): void;
    (e: 'update:keyboardConfig', value: string): void;
    (e: 'send:profileData'): void;
    (e: 'resume'): void;
}>();

const page = usePage();
const auth = (page.props as { auth?: { user?: any } }).auth;
const user = auth?.user;
const isUserHasDevRole = computed(() => user.role_id === 2);

function quitWithoutSaving() {
    window.close();
}
</script>

<template>
    <Dialog :open="props.open">
        <DialogContent class="font-game">
            <DialogHeader class="gap-10">
                <DialogTitle>
                    <h1 class="flex items-center justify-center text-4xl">GAME PAUSED</h1>
                </DialogTitle>
                <DialogDescription>
                    <div v-if="isUserHasDevRole" class="flex items-center gap-2">
                        <Label>Enable Game Dev mode</Label>
                        <Switch :model-value="props.isGameDevModeEnabled" @update:model-value="(val) => emits('update:isGameDevModeEnabled', val)" />
                    </div>
                    <div v-if="isUserHasDevRole && props.isGameDevModeEnabled" class="flex items-center gap-2">
                        <Label>Enable Enemies</Label>
                        <Switch :model-value="props.isEnemiesEnabled" @update:model-value="(val) => emits('update:isEnemiesEnabled', val)" />
                    </div>
                    <div v-if="isUserHasDevRole && props.isGameDevModeEnabled" class="flex items-center gap-2">
                        <Label>Enable player's projectiles</Label>
                        <Switch
                            :model-value="props.isPlayerProjectilesEnabled"
                            @update:model-value="(val) => emits('update:isPlayerProjectilesEnabled', val)"
                        />
                    </div>
                    <div class="mt-5 grid w-full grid-cols-3 items-center justify-center gap-5">
                        <span>Music volume: </span>
                        <Slider
                            class=""
                            :max="1"
                            :step="0.1"
                            :model-value="[props.musicVolume]"
                            @update:modelValue="(val) => emits('update:musicVolume', val![0])"
                        />
                        <span class="text-lg">{{ props.musicVolume * 10 }}</span>
                    </div>
                    <div class="mt-5 grid w-full grid-cols-3 items-center justify-center gap-5">
                        <span>Sound effects volume: </span>
                        <Slider
                            class=""
                            :max="1"
                            :step="0.1"
                            :model-value="[props.soundEffectsVolume]"
                            @update:modelValue="(val) => emits('update:soundEffectsVolume', val![0])"
                        />
                        <span class="text-lg">{{ props.soundEffectsVolume * 10 }}</span>
                    </div>
                    <div class="mt-5 grid w-full grid-cols-3 items-center justify-center gap-5">
                        <span>Keyboard configuration: </span>
                        <DropdownMenu>
                            <DropdownMenuTrigger as-child>
                                <Button variant="outline"> {{ keyboardConfig }} </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent class="w-56">
                                <DropdownMenuRadioGroup
                                    :model-value="props.keyboardConfig"
                                    @update:modelValue="(val) => emits('update:keyboardConfig', val)"
                                >
                                    <DropdownMenuRadioItem value="WASD"> WASD </DropdownMenuRadioItem>
                                    <DropdownMenuRadioItem value="ZQSD"> ZQSD </DropdownMenuRadioItem>
                                </DropdownMenuRadioGroup>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                    <div class="mt-3 flex w-full flex-col items-start gap-3">
                        <Button v-if="!props.isLoading" variant="secondary" @click="emits('send:profileData')">Save and quit</Button>
                        <Button v-else variant="ghost"><LoaderCircle class="animate-spin" /></Button>
                        <Button variant="destructive" @click="quitWithoutSaving">Quit without saving</Button>
                    </div>
                </DialogDescription>
            </DialogHeader>
            <DialogFooter>
                <Button type="button" variant="secondary" @click="emits('resume')">Resume</Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
</template>

<script setup lang="ts">
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import { router, useForm, usePage } from '@inertiajs/vue3';
import { Howl } from 'howler';
import { LoaderCircle } from 'lucide-vue-next';
import { onMounted, ref } from 'vue';

const menuItems = ['Start game', 'Settings', 'Quit game'];
const videoRef = ref<HTMLVideoElement | null>(null);
const settings = ref<boolean>(false);
const videoLoaded = ref<boolean>(false);
const videoProgress = ref<number>(0);
const playerInteracted = ref<boolean>(false);
const musicON = ref<boolean>(true);
const soundEffectON = ref<boolean>(true);
const musicVolume = ref<number>(0);
const soundEffetcsVolume = ref<number>(0.3);
const keyboardConfig = ref<string>('WASD');
const mainMenuMusic = new Howl({
    src: ['/assets/music/mainMenu/main-menu.mp3'],
    volume: musicVolume.value,
    loop: true,
});
const soundEffect = new Howl({
    src: ['/assets/music/mainMenu/selection/Modern1.mp3'],
    volume: soundEffetcsVolume.value,
});

const page = usePage();
const auth = (page.props as { auth?: { user?: any } }).auth;
const user = auth?.user;

function retreiveUserSettings(userId: number) {
    fetch(`/game/user/profile/settings/${userId}`)
        .then((res) => res.json())
        .then((data) => {
            musicVolume.value = data.music_volume;
            soundEffetcsVolume.value = data.sound_effects_volume;
            mainMenuMusic.volume(musicVolume.value);
            soundEffect.volume(soundEffetcsVolume.value);
            keyboardConfig.value = data.keyboard_config;
        })
        .then(() => {
            playMusic();
        });
}

async function sendUserSettings(userId: number) {
    const form = useForm({
        user_id: userId,
        music_volume: musicVolume.value,
        sound_effects_volume: soundEffetcsVolume.value,
        keyboard_config: keyboardConfig.value,
    });
    router.patch(route('settings.update'), form.data());
}

function onVideoLoaded() {
    videoLoaded.value = true;
}

function onVideoProgress(event: Event) {
    const video = event.target as HTMLVideoElement;
    if (video.buffered.length > 0) {
        const bufferedEnd = video.buffered.end(video.buffered.length - 1);
        const duration = video.duration || 1;
        videoProgress.value = Math.min((bufferedEnd / duration) * 100, 100);
    }
}

function handlePlayerFirstInterfaction() {
    playerInteracted.value = true;
    playMenuSelectionSound();
    videoRef.value?.play();
}

async function handleSettings() {
    if (!settings.value) {
        settings.value = true;
        playMenuSelectionSound();
        return;
    }
    playMenuSelectionSound();
    await sendUserSettings(user.id);
    settings.value = false;
}

async function handleClick(item: string) {
    switch (item) {
        case menuItems[0]:
            await playMenuSelectionSound();
            window.location.href = '/LightSouls';
            break;
        case menuItems[1]:
            handleSettings();
            break;
        case menuItems[2]:
            window.close();
            break;
        default:
            console.log('default action', 'none');
            break;
    }
}

function playMusic() {
    if (!musicON.value) return;
    mainMenuMusic.play();
}

function handleMusicVolume(value: number) {
    musicVolume.value = value;
    mainMenuMusic.volume(value);
}

function handleSoundEffectsVolume(value: number) {
    soundEffetcsVolume.value = value;
    soundEffect.volume(value);
}

function playSelectSound() {
    if (!soundEffectON.value) return;
    soundEffect.play();
}

function playMenuSelectionSound() {
    if (!soundEffectON.value) return;
    return new Promise((resolve) => {
        const soundEffectSelection = new Howl({
            src: ['/assets/music/mainMenu/selection/menu-selection.mp3'],
            volume: soundEffetcsVolume.value,
            onend: resolve,
        });
        soundEffectSelection.play();
    });
}

onMounted(() => {
    retreiveUserSettings(user.id);
});
</script>

<template>
    <div class="relative flex max-h-screen min-h-screen w-full flex-col items-center justify-center gap-10 font-(family-name:--font-game)">
        <video
            ref="videoRef"
            id="intro-video"
            class="fixed inset-0 z-0 h-full w-full object-cover"
            autoplay
            loop
            preload="auto"
            @canplaythrough="onVideoLoaded"
            @progress="onVideoProgress"
        >
            <source src="/assets/mainMenu/main-menu.mp4" type="video/mp4" />
            Your browser does not support the video tag.
        </video>
        <div v-if="!videoLoaded" class="h-fill z-50 flex w-full flex-col items-center justify-center gap-4">
            <span>Loading...</span> <LoaderCircle class="animate-spin" />
            <div class="h-2 w-1/3 rounded bg-gray-700">
                <Progress class="w-full" :model-value="videoProgress" />
            </div>
            <span class="text-xs text-white">{{ Math.round(videoProgress) }}%</span>
        </div>
        <h1 v-if="videoLoaded" class="z-50 cursor-default text-9xl font-bold drop-shadow-[0_1.2px_1.2px_rgba(252,124,0,1)]">Light Souls</h1>
        <div v-if="videoLoaded" class="z-50 flex w-full flex-col items-center justify-center">
            <div v-if="playerInteracted" class="z-50 flex flex-col items-center justify-center gap-3 text-xl">
                <h2
                    v-for="item in menuItems"
                    :key="item"
                    class="cursor-pointer transition-all duration-200 hover:scale-110 hover:font-bold hover:text-orange-400"
                    @click="handleClick(item)"
                    @mouseenter="playSelectSound()"
                >
                    {{ item }}
                </h2>
            </div>
            <div v-else>
                <span class="animate-pulse cursor-default text-4xl" @click="handlePlayerFirstInterfaction">Click here to continue</span>
            </div>
            <Dialog :open="settings && playerInteracted">
                <DialogContent class="font-game bg-gradient-to-tr from-black via-black to-red-800">
                    <DialogHeader>
                        <DialogTitle class="text-center text-3xl">SETTINGS</DialogTitle>
                        <DialogDescription>
                            <div class="mt-5 grid w-full grid-cols-3 items-center justify-center gap-5">
                                <span>Music volume: </span>
                                <Slider
                                    class=""
                                    :max="1"
                                    :step="0.1"
                                    :model-value="[musicVolume]"
                                    @update:modelValue="(val) => handleMusicVolume(val![0])"
                                />
                                <span class="text-lg">{{ musicVolume * 10 }}</span>
                            </div>
                            <div class="mt-5 grid w-full grid-cols-3 items-center justify-center gap-5">
                                <span>Sound effects volume: </span>
                                <Slider
                                    class=""
                                    :max="1"
                                    :step="0.1"
                                    :model-value="[soundEffetcsVolume]"
                                    @update:modelValue="(val) => handleSoundEffectsVolume(val![0])"
                                />
                                <span class="text-lg">{{ soundEffetcsVolume * 10 }}</span>
                            </div>
                            <div class="mt-5 grid w-full grid-cols-3 items-center justify-center gap-5">
                                <span>Keyboard configuration: </span>
                                <DropdownMenu>
                                    <DropdownMenuTrigger as-child>
                                        <Button variant="outline"> {{ keyboardConfig }} </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent class="w-56">
                                        <DropdownMenuRadioGroup v-model="keyboardConfig">
                                            <DropdownMenuRadioItem value="WASD"> WASD </DropdownMenuRadioItem>
                                            <DropdownMenuRadioItem value="ZQSD"> ZQSD </DropdownMenuRadioItem>
                                        </DropdownMenuRadioGroup>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button @click="handleSettings" class="font-bold"> Save changes </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    </div>
</template>

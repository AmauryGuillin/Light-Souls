<script setup lang="ts">
import { Progress } from '@/components/ui/progress';
import { LoaderCircle } from 'lucide-vue-next';
import { ref } from 'vue';

const menuItems = ['Start game', 'Settings', 'Quit game'];
const videoLoaded = ref<boolean>(false);
const videoProgress = ref<number>(0);

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

function handleClick(item: string) {
    switch (item) {
        case menuItems[0]:
            //window.open('https://light-souls.test/LightSouls');
            window.location.href = '/LightSouls';
            break;
        case menuItems[1]:
            console.log('setting');
            break;
        case menuItems[2]:
            window.close();
            break;
        default:
            console.log('default action', 'none');
            break;
    }
}
</script>

<template>
    <div class="relative flex max-h-screen min-h-screen w-full flex-col items-center justify-center gap-10 font-(family-name:--font-game)">
        <video
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
            <LoaderCircle class="animate-spin" />
            <div class="h-2 w-1/2 rounded bg-gray-700">
                <Progress class="w-full" :model-value="videoProgress" />
            </div>
            <span class="text-xs text-white">{{ Math.round(videoProgress) }}%</span>
        </div>
        <h1 v-if="videoLoaded" class="z-50 cursor-default text-9xl font-bold drop-shadow-[0_1.2px_1.2px_rgba(252,124,0,1)]">Light Souls</h1>
        <div v-if="videoLoaded" class="z-50 flex w-full flex-col items-center justify-center">
            <div class="z-50 flex flex-col items-center justify-center gap-3 text-xl">
                <h2
                    v-for="item in menuItems"
                    :key="item"
                    class="cursor-pointer transition-all duration-200 hover:scale-110 hover:font-bold hover:text-orange-400"
                    @click="handleClick(item)"
                >
                    {{ item }}
                </h2>
            </div>
        </div>
    </div>
</template>

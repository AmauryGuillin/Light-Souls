<script setup lang="ts">
const menuItems = ['Start a new game', 'Settings', 'Quit game'];

function handleClick(item: string) {
    if (item === menuItems[0]) {
        console.log('start');
        window.location.href = '/LightSouls';
    } else if (item === menuItems[1]) {
        console.log('settings');
    }
}
</script>

<template>
    <div class="relative flex max-h-screen min-h-screen w-full flex-col items-center justify-center gap-10">
        <!-- <img
            class="absolute top-[50%] left-[18%] z-0 translate-x-[-50%] translate-y-[-50%] overflow-hidden"
            src="/assets/player/main-menu-player.gif"
            alt=""
            srcset=""
        /> -->
        <video id="intro-video" class="fixed inset-0 z-0 h-full w-full object-cover" autoplay loop preload="auto">
            <source src="/assets/mainMenu/main-menu.mp4" type="video/mp4" />
            Your browser does not support the video tag.
        </video>
        <h1 class="z-50 cursor-default text-9xl font-bold">Light Souls</h1>
        <div class="z-50 flex w-full flex-col items-center justify-center">
            <div class="z-50 flex flex-col items-center justify-center gap-3 text-xl">
                <h2 v-for="item in menuItems" :key="item" class="cursor-pointer transition-all hover:scale-110" @click="handleClick(item)">
                    {{ item }}
                </h2>
            </div>
        </div>
    </div>
</template>

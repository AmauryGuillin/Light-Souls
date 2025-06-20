<script setup lang="ts">
const menuItems = ['Start game', 'Settings', 'Quit game'];

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
    <div class="relative flex max-h-screen min-h-screen w-full flex-col items-center justify-center gap-10 font-(family-name:--font-game)">
        <video id="intro-video" class="fixed inset-0 z-0 h-full w-full object-cover" autoplay loop preload="auto">
            <source src="/assets/mainMenu/main-menu.mp4" type="video/mp4" />
            Your browser does not support the video tag.
        </video>
        <h1 class="z-50 cursor-default text-9xl font-bold">Light Souls</h1>
        <div class="z-50 flex w-full flex-col items-center justify-center">
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

<script setup lang="ts">
const emit = defineEmits(['showHitboxes', 'spawnPlayer', 'spawnEnemy', 'spawnPlayerBonus', 'playerStartShooting']);
</script>

<template>
    <div class="z-50 flex">
        <button class="cursor-pointer rounded-lg border-2 bg-black p-1 font-bold text-white hover:bg-red-600" @click="emit('showHitboxes')">
            Hitboxes
        </button>
        <button class="cursor-pointer rounded-lg border-2 bg-black p-1 font-bold text-white hover:bg-gray-800" @click="emit('spawnPlayer')">
            spawn player
        </button>
        <button class="cursor-pointer rounded-lg border-2 bg-black p-1 font-bold text-white hover:bg-gray-800" @click="emit('spawnEnemy')">
            spawn enemy
        </button>
        <button class="cursor-pointer rounded-lg border-2 bg-black p-1 font-bold text-white hover:bg-gray-800" @click="emit('spawnPlayerBonus')">
            spawn bonus
        </button>
        <button class="cursor-pointer rounded-lg border-2 bg-black p-1 font-bold text-white hover:bg-red-600" @click="emit('playerStartShooting')">
            Shoot!
        </button>
    </div>
</template>

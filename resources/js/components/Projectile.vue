<script setup lang="ts">
const props = defineProps<{
    projectilePosX: number;
    projectilePosY: number;
    projectileDimW: number;
    projectileDimH: number;
    projectileSpawnState: boolean;
}>();
</script>

<template>
    <div
        class="absolute rounded-full border-2 border-amber-600 bg-red-600"
        :style="{
            visibility: `${props.projectileSpawnState ? 'visible' : 'hidden'}`,
            top: `${props.projectilePosY}%`,
            left: `${props.projectilePosX}%`,
            height: `${props.projectileDimH}px`,
            width: `${props.projectileDimW}px`,
        }"
    ></div>
</template>

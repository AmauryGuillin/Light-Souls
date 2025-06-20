<script setup lang="ts">
const props = defineProps<{
    enemySpawnState: boolean;
    enemyPosX: number;
    enemyPosY: number;
    enemyDimW: number;
    enemyDimH: number;
    enemyOrientation: {
        left: boolean;
        right: boolean;
    };
}>();
</script>

<template>
    <div
        class="absolute z-40"
        :style="{
            visibility: `${props.enemySpawnState ? 'visible' : 'hidden'}`,
            top: `${props.enemyPosY}%`,
            left: `${props.enemyPosX}%`,
        }"
    >
        <img
            class=""
            src="assets/enemy/Walk.gif"
            alt=""
            :style="{
                height: `${props.enemyDimH}px`,
                width: `${props.enemyDimW}px`,
                transform: `${props.enemyOrientation.left ? 'scaleX(-1)' : ''}`,
            }"
        />
    </div>
</template>

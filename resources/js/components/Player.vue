<script setup lang="ts">
import { ref, watch } from 'vue';

const props = defineProps<{
    playerPosX: number;
    playerPosY: number;
    playerDimW: number;
    playerDimH: number;
    playerDirection: {
        left: boolean;
        right: boolean;
    };
    playerIsMoving: boolean;
}>();

const lastDirection = ref<'left' | 'right'>('right');

watch(
    () => props.playerDirection,
    (dir) => {
        if (dir.left) lastDirection.value = 'left';
        else if (dir.right) lastDirection.value = 'right';
    },
    { immediate: true, deep: true },
);
</script>

<template>
    <div
        id="player"
        class="absolute z-40"
        :style="{
            top: `${props.playerPosY}%`,
            left: `${props.playerPosX}%`,
        }"
    >
        <img
            v-if="!playerIsMoving"
            src="assets/player/player-idle-white.gif"
            alt=""
            :style="{
                height: `${props.playerDimH}px`,
                width: `${props.playerDimW}px`,
                transform: `${lastDirection === 'left' ? 'scaleX(-1)' : ''}`,
            }"
        />
        <img
            v-if="playerIsMoving"
            src="assets/player/player-move-white.gif"
            alt=""
            :style="{
                height: `${props.playerDimH}px`,
                width: `${props.playerDimW}px`,
                transform: `${props.playerDirection.left ? 'scaleX(-1)' : ''}`,
            }"
        />
    </div>
</template>

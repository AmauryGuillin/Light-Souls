<script setup lang="ts">
const props = defineProps<{
    playerPosX: number;
    playerPosY: number;
    playerDimW: number;
    playerDimH: number;
}>();
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
            class=""
            src="assets/player/player-idle-white.gif"
            alt=""
            :style="{
                height: `${props.playerDimH}px`,
                width: `${props.playerDimW}px`,
            }"
        />
    </div>
</template>

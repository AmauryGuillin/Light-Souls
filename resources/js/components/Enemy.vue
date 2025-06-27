<script setup lang="ts">
const props = defineProps<{
    enemyId: string;
    enemySpawnState: boolean;
    enemyPosX: number;
    enemyPosY: number;
    enemyDimW: number;
    enemyDimH: number;
    enemyOrientation: {
        left: boolean;
        right: boolean;
    };
    damagesToDisplay: any;
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
    <span
        v-for="damage in damagesToDisplay.filter((d: any) => d.enemyId === enemyId)"
        :key="damage.id"
        class="absolute z-50 animate-bounce text-lg font-bold text-red-500"
        :style="{
            top: `${enemyPosY - 2}%`,
            left: `${enemyPosX + 2}%`,
            pointerEvents: 'none',
        }"
    >
        -{{ damage.value }}
    </span>
</template>

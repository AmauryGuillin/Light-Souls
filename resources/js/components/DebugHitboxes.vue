<script setup lang="ts">
import Enemy from '@/components/Enemy.vue';
import { EnemyType } from '@/types/game/enemy';
import { ProjectileType } from '@/types/game/projectile';
import Projectile from './Projectile.vue';

const props = defineProps<{
    playerPosX: number;
    playerPosY: number;
    playerDimW: number;
    playerDimH: number;
    projectilesArray: ProjectileType[];
    enemiesArray: EnemyType[];
}>();
</script>

<template>
    <div
        id="debug-player-hitboxe"
        class="absolute border-2 border-blue-300"
        :style="{
            top: `${props.playerPosY}%`,
            left: `${props.playerPosX}%`,
            height: `${props.playerDimH}px`,
            width: `${props.playerDimW}px`,
        }"
    ></div>
    <Projectile
        class="absolute border-2 border-amber-500"
        v-for="projectile in props.projectilesArray"
        v-bind:key="projectile.id"
        :projectile-dim-h="projectile.structure.dimensions.height"
        :projectile-dim-w="projectile.structure.dimensions.width"
        :projectile-pos-x="projectile.position.X"
        :projectile-pos-y="projectile.position.Y"
        :projectile-spawn-state="projectile.states.isSpawned"
    />
    <Enemy
        class="absolute border-2 border-red-600"
        v-for="enemy in props.enemiesArray"
        v-bind:key="enemy.id"
        :enemy-pos-x="enemy.position.X"
        :enemy-pos-y="enemy.position.Y"
        :enemy-dim-h="enemy.structure.dimensions.height"
        :enemy-dim-w="enemy.structure.dimensions.width"
        :enemy-spawn-state="enemy.states.isSpawned"
        :enemy-orientation="enemy.orientation"
    />
</template>

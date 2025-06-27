<script setup lang="ts">
import DebbugButtons from '@/components/DebbugButtons.vue';
import DebugHitboxes from '@/components/DebugHitboxes.vue';
import Enemy from '@/components/Enemy.vue';
import GamePauseDialog from '@/components/GamePauseDialog.vue';
import Player from '@/components/Player.vue';
import PlayerInfo from '@/components/PlayerInfo.vue';
import PowerUpDialog from '@/components/PowerUpDialog.vue';
import Projectile from '@/components/Projectile.vue';
import { DamageDisplay } from '@/types/game/DamageDisplay';
import { EnemyType } from '@/types/game/enemy';
import { MovementKey } from '@/types/game/movementKey';
import { PlayerType } from '@/types/game/player';

import { ProjectileType } from '@/types/game/projectile';
import {
    calculColisionBetweenTwoEntities,
    clamp,
    handleEnemiesMovementAnimations,
    handlePauseStateWhenBonusPageOpen,
    handlePlayerMovementAnimation,
    handleProjectilesMovementAnimations,
    randomPositionX,
    randomPositionY,
    startEnemiSpawn,
    startFiring,
    stopEnemySpawn,
    stopFiring,
} from '@/utils/game/game-utils';
import { markRaw, onMounted, onUnmounted, ref, watch } from 'vue';

const sceneRef = ref<HTMLElement | null>(null);
const isGamePaused = ref<boolean>(false);
const isGameDevModeEnabled = ref<boolean>(true);
const isEnemiesEnabled = ref<boolean>(false);
const isPlayerProjectilesEnabled = ref<boolean>(false);
const isBoostPageOpen = ref<boolean>(false);
const isHitboxesShown = ref<boolean>(false);
const projectiles = ref<ProjectileType[]>([]);
const enemies = ref<EnemyType[]>([]);
const playerPowerUps = ref<App.Data.PowerupData[]>([]);
const fireInterval: ReturnType<typeof setInterval> | null = null;
const fireIntervalRef = ref<ReturnType<typeof setInterval> | null>(null);
const enemySpawnIntervalRef = ref<ReturnType<typeof setInterval> | null>(null);
let animationFrameId: number;
const player = ref<PlayerType>({
    name: '',
    actions: {
        movement: {
            keys: {
                z: { pressed: false },
                q: { pressed: false },
                s: { pressed: false },
                d: { pressed: false },
            } as Record<MovementKey, { pressed: boolean }>,
            direction: {
                left: false,
                right: false,
            },
            speed: 0.1,
        },
    },
    structure: {
        dimensions: {
            height: 125,
            width: 125,
        },
    },
    position: {
        X: 50,
        Y: 50,
    },
    states: {
        isSpawned: false,
        isShooting: false,
        lastDamageTime: 0,
    },
    personalAttributes: {
        HP: 100,
        fireRate: 2000, //ms
        score: 0,
        XP: 1,
        level: 0,
    },
} as PlayerType);

const previousPlayerFireRate = ref<number>(player.value.personalAttributes.fireRate);

const damagesToDisplay = ref<DamageDisplay[]>([]);

watch(
    () => player.value.states.isSpawned,
    (newVal) => {
        if (newVal) {
            startFiring(ref(fireInterval), player, playerStartShooting, () => stopFiring(fireIntervalRef));
            startEnemiSpawn(enemySpawnIntervalRef, player, spawnEnemy, () => stopEnemySpawn(enemySpawnIntervalRef));
        } else {
            stopFiring(fireIntervalRef);
            stopEnemySpawn(enemySpawnIntervalRef);
        }
    },
);

watch(
    () => player.value.personalAttributes.fireRate,
    () => {
        if (fireInterval) {
            stopFiring(fireIntervalRef);
            startFiring(ref(fireInterval), player, playerStartShooting, () => stopFiring(fireIntervalRef));
        }
    },
);

watch(
    () => player.value.personalAttributes.score,
    (score) => {
        if (score === 5000) {
            isBoostPageOpen.value = true;
        }
    },
);

watch(
    () => isBoostPageOpen.value,
    (state) => {
        if (!state) {
            animationFrameId = requestAnimationFrame(gameLoop);
        }
    },
);

/**
 * Handle most animations required for the game
 * @beta
 */
function gameLoop() {
    if (isGamePaused.value || player.value.personalAttributes.HP <= 0 || isBoostPageOpen.value) return;

    handlePlayerMovementAnimation(player);

    handleProjectilesMovementAnimations(projectiles, projectileHit);

    handleEnemiesMovementAnimations(enemies, player);

    animationFrameId = requestAnimationFrame(gameLoop);
}

/**
 * Make the player spawn into the scene
 * @beta
 */
function spawnPlayer() {
    player.value.position.X = 50;
    player.value.position.Y = 50;
    player.value.name = 'Player';
    player.value.states.isSpawned = true;
    player.value.personalAttributes.level = 1;
}

/**
 * Construct an iteration of a player's projectile
 * Initiate the projectiles movement loop animation
 * @beta
 */
function playerStartShooting() {
    if (!player.value.states.isSpawned || isGamePaused.value || isBoostPageOpen.value) return;
    if (!isPlayerProjectilesEnabled.value) return;
    const projectile = markRaw<ProjectileType>({
        id: crypto.randomUUID(),
        structure: {
            dimensions: { height: 10, width: 10 },
        },
        states: {
            isSpawned: true,
            lifeSpan: 4000,
            createdAt: performance.now(),
        },
        position: {
            X: player.value.position.X + 5,
            Y: player.value.position.Y + 2,
        },
        speed: 0.05,
        hitBox: {
            height: 1,
            width: 1,
        },
        damage: 50,
    });

    projectiles.value.push(projectile);
    projectileMovement(projectile);
}

function onBonusPageClose() {
    handlePauseStateWhenBonusPageOpen(isBoostPageOpen, isGamePaused);
}

/**
 * Handle each player's projectile movement animation
 * @param projectile The player's projectile created in the **playerStartShooting()** function
 * @beta
 */
function projectileMovement(projectile: ProjectileType) {
    const start = performance.now();

    function animateProjectile(now: number) {
        const elapsed = now - start;

        if (elapsed > projectile.states.lifeSpan) {
            projectile.states.isSpawned = false;
            projectiles.value = projectiles.value.filter((p) => p.id !== projectile.id);
            return;
        }

        projectile.position.X += projectile.speed;
        projectile.position.X = clamp(projectile.position.X, 0, 99);
        if (projectile.position.X >= 99) {
            projectile.states.isSpawned = false;
            return;
        }

        if (isGamePaused.value || player.value.personalAttributes.HP > 0 || isBoostPageOpen.value) return;

        requestAnimationFrame(animateProjectile);
    }

    if (isGamePaused.value || player.value.personalAttributes.HP > 0 || isBoostPageOpen.value) return;

    requestAnimationFrame(animateProjectile);
}

/**
 * Handle player's projectiles hitboxes
 * @param projectile The player's projectile created in the **playerStartShooting()** function
 */
function projectileHit(projectile: ProjectileType) {
    enemies.value.forEach((enemy: EnemyType) => {
        const isColliding = calculColisionBetweenTwoEntities(projectile, enemy, sceneRef);

        if (isColliding) {
            enemy.personalAttributes.HP -= projectile.damage;

            const damageId = `${enemy.id}-${Date.now()}`;
            damagesToDisplay.value.push({
                id: damageId,
                enemyId: enemy.id,
                value: projectile.damage,
                x: enemy.position.X,
                y: enemy.position.Y,
            });

            setTimeout(() => {
                damagesToDisplay.value = damagesToDisplay.value.filter((d) => d.id !== damageId);
            }, 1000);

            if (enemy.personalAttributes.HP <= 0) {
                enemy.states.isSpawned = false;
                enemy.states.canKill = false;
                enemies.value = enemies.value.filter((e) => e.id !== enemy.id);
                player.value.personalAttributes.score++;
                if (player.value.personalAttributes.XP <= player.value.personalAttributes.level * 100) {
                    player.value.personalAttributes.XP += 10;
                } else {
                    player.value.personalAttributes.level++;
                    player.value.personalAttributes.XP = 1;
                    getPowerUp();
                }
            }

            projectile.states.isSpawned = false;
            projectiles.value = projectiles.value.filter((p) => p.id != projectile.id);
        }
    });
}

/**
 * Make an enemy spawn into the scene
 * @beta
 */
function spawnEnemy() {
    if (isGamePaused.value || isBoostPageOpen.value) return;

    if (!isEnemiesEnabled.value) return;
    const enemy = markRaw<EnemyType>({
        id: crypto.randomUUID(),
        personalAttributes: {
            HP: 100,
            movementSpeed: 0.05,
            damage: 10,
        },
        structure: {
            dimensions: {
                height: 100,
                width: 100,
            },
        },
        states: {
            isSpawned: true,
            isShooting: false,
            canKill: true,
        },
        position: {
            X: randomPositionX(),
            Y: randomPositionY(),
        },
        orientation: {
            left: false,
            right: false,
        },
        hitBox: {
            offsetX: 0,
            offsetY: 0,
            width: 100,
            height: 100,
        },
    });

    enemies.value.push(enemy);
}

/**
 * Handle keyboard events in order to begin player's actions in the scene
 * @param e The keyboard event to track.
 * @remark
 * Keyboard action **KeyDown**
 */
function movementKeyDown(e: KeyboardEvent) {
    const key = e.key.toLowerCase();
    if (key in player.value.actions.movement.keys) {
        player.value.actions.movement.keys[key as MovementKey].pressed = true;
    }
}

/**
 * Handle keyboard events in order to begin player's actions in the scene
 * @param e The keyboard event to track.
 * @remark
 * Keyboard action **KeyUp**
 */
function movementKeyUp(e: KeyboardEvent) {
    const key = e.key.toLowerCase();
    if (key in player.value.actions.movement.keys) {
        player.value.actions.movement.keys[key as MovementKey].pressed = false;
    }
}

/**
 * For development purpose only
 * @Remark
 * **Meant to be deleted**
 */
function showHitboxes() {
    if (!isHitboxesShown.value) {
        isHitboxesShown.value = true;
        return;
    }

    isHitboxesShown.value = false;
}

/**
 * Toggles the game's pause mode.
 * Handles keyboard events to start player actions in the scene.
 * @param e - The keyboard event to track.
 * @remark
 * Activated on **KeyDown** of the "Escape" key to pause or resume the game.
 */
function pauseGame(e?: KeyboardEvent) {
    const key = e?.key;
    if (key !== undefined && key === 'Escape') {
        if (isGamePaused.value) {
            isGamePaused.value = false;
            animationFrameId = requestAnimationFrame(gameLoop);
            return;
        }
        isGamePaused.value = true;
    }

    if (key === undefined) {
        if (isGamePaused.value) {
            isGamePaused.value = false;
            animationFrameId = requestAnimationFrame(gameLoop);
            return;
        }
        isGamePaused.value = true;
    }
}

onMounted(() => {
    window.addEventListener('keydown', movementKeyDown);
    window.addEventListener('keydown', pauseGame);
    window.addEventListener('keyup', movementKeyUp);
    animationFrameId = requestAnimationFrame(gameLoop);
    spawnPlayer();
});

onUnmounted(() => {
    window.removeEventListener('keydown', movementKeyDown);
    window.removeEventListener('keyup', movementKeyUp);
    cancelAnimationFrame(animationFrameId);
});

function getPowerUp() {
    fetch(`/game/powerup/${player.value.personalAttributes.level}`)
        .then((res) => res.json())
        .then((data) => {
            playerPowerUps.value = [];
            data.forEach((element: any) => {
                playerPowerUps.value.push(element);
            });
            isBoostPageOpen.value = true;
        });
}

function upgradeAtkSpeed(value: number) {
    previousPlayerFireRate.value = player.value.personalAttributes.fireRate;
    player.value.personalAttributes.fireRate /= value;
    isBoostPageOpen.value = false;
}
</script>

<template>
    <div ref="sceneRef" id="scene" class="relative flex h-screen flex-col bg-[url(/assets/ground/ground.jpg)] bg-auto">
        <DebbugButtons
            v-if="isGameDevModeEnabled"
            @showHitboxes="showHitboxes"
            @spawnPlayer="spawnPlayer"
            @spawnEnemy="spawnEnemy"
            @playerStartShooting="playerStartShooting"
            @pause-game="pauseGame"
            @get-power-up="getPowerUp"
        ></DebbugButtons>
        <PowerUpDialog
            :is-boost-page-open="isBoostPageOpen"
            :player-power-ups="playerPowerUps"
            @update:HandlePauseStateWhenBonusPageOpen="onBonusPageClose"
            @update:upgrade-atk-speed="upgradeAtkSpeed"
        />
        <GamePauseDialog
            :open="isGamePaused"
            :isGameDevModeEnabled="isGameDevModeEnabled"
            :isEnemiesEnabled="isEnemiesEnabled"
            :isPlayerProjectilesEnabled="isPlayerProjectilesEnabled"
            @update:isGameDevModeEnabled="(val) => (isGameDevModeEnabled = val)"
            @update:isEnemiesEnabled="(val) => (isEnemiesEnabled = val)"
            @update:isPlayerProjectilesEnabled="(val) => (isPlayerProjectilesEnabled = val)"
            @resume="pauseGame"
        />
        <div v-if="player.personalAttributes.HP <= 0" class="z-50 bg-red-500 text-7xl font-bold text-black">YOU DIED</div>

        <PlayerInfo
            :is-game-dev-mode-enabled="isGameDevModeEnabled"
            :player-h-p="player.personalAttributes.HP"
            :player-score="player.personalAttributes.score"
            :player-x-p="player.personalAttributes.XP"
            :player-level="player.personalAttributes.level"
            :player-spawn-state="player.states.isSpawned"
            :player-fire-rate="player.personalAttributes.fireRate"
            :previous-player-fire-rate="previousPlayerFireRate"
        />

        <Player
            v-if="player.states.isSpawned"
            :player-pos-x="player.position.X"
            :player-pos-y="player.position.Y"
            :player-dim-h="player.structure.dimensions.height"
            :player-dim-w="player.structure.dimensions.width"
            :player-direction="player.actions.movement.direction"
            :player-is-moving="player.actions.movement.isMoving"
        />

        <Projectile
            v-for="projectile in projectiles"
            v-bind:key="projectile.id"
            :projectile-pos-x="projectile.position.X"
            :projectile-pos-y="projectile.position.Y"
            :projectile-dim-h="projectile.structure.dimensions.height"
            :projectile-dim-w="projectile.structure.dimensions.width"
            :projectile-spawn-state="projectile.states.isSpawned"
        />
        <Enemy
            v-for="enemy in enemies"
            v-bind:key="enemy.id"
            :enemy-id="enemy.id"
            :enemy-spawn-state="enemy.states.isSpawned"
            :enemy-pos-x="enemy.position.X"
            :enemy-pos-y="enemy.position.Y"
            :enemy-dim-w="enemy.structure.dimensions.width"
            :enemy-dim-h="enemy.structure.dimensions.height"
            :enemy-orientation="enemy.orientation"
            :damages-to-display="damagesToDisplay"
        />
        <DebugHitboxes
            v-if="player.states.isSpawned && isHitboxesShown"
            :player-pos-x="player.position.X"
            :player-pos-y="player.position.Y"
            :player-dim-h="player.structure.dimensions.height"
            :player-dim-w="player.structure.dimensions.width"
            :projectiles-array="projectiles"
            :enemies-array="enemies"
        />
    </div>
</template>

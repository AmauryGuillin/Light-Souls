<script setup lang="ts">
import DebbugButtons from '@/components/DebbugButtons.vue';
import DebugHitboxes from '@/components/DebugHitboxes.vue';
import Enemy from '@/components/Enemy.vue';
import GamePauseDialog from '@/components/GamePauseDialog.vue';
import Player from '@/components/Player.vue';
import PlayerInfo from '@/components/PlayerInfo.vue';
import Projectile from '@/components/Projectile.vue';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { EnemyType } from '@/types/game/enemy';
import { MovementKey } from '@/types/game/movementKey';
import { PlayerType } from '@/types/game/player';
import { PowerUp } from '@/types/game/powerup';
import { ProjectileType } from '@/types/game/projectile';
import { calculColisionBetweenTwoEntities, randomPositionX, randomPositionY } from '@/utils/game/game-utils';
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
const playerBonus = ref<PowerUp | null>(null);
let fireInterval: ReturnType<typeof setInterval> | null = null;
let enemySpawnInterval: ReturnType<typeof setInterval> | null = null;
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
        fireRate: 1000, //ms
        score: 0,
    },
} as PlayerType);

watch(
    () => player.value.states.isSpawned,
    (newVal) => {
        if (newVal) {
            startFiring();
            startEnemiSpawn();
        } else {
            stopFiring();
            stopEnemySpawn();
        }
    },
);

watch(
    () => player.value.personalAttributes.fireRate,
    () => {
        if (fireInterval) {
            stopFiring();
            startFiring();
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

/**
 * Handle most animations required for the game
 * @beta
 */
function gameLoop() {
    if (isGamePaused.value || player.value.personalAttributes.HP <= 0) return;

    handlePlayerMovementAnimation();

    handleProjectilesMovementAnimations();

    handleEnemiesMovementAnimations();

    animationFrameId = requestAnimationFrame(gameLoop);
}

/**
 * Handle player movement
 * @remark
 * use the **MovementKey** type
 * @beta
 */
function handlePlayerMovementAnimation() {
    if (player.value.states.isSpawned) {
        const keys = player.value.actions.movement.keys;
        const speed = player.value.actions.movement.speed;

        let isMoving = false;
        let directionLeft = false;
        let directionRight = false;

        if (keys.z.pressed) {
            player.value.position.Y -= speed;
            isMoving = true;
        }
        if (keys.s.pressed) {
            player.value.position.Y += speed;
            isMoving = true;
        }
        if (keys.q.pressed) {
            player.value.position.X -= speed;
            directionLeft = true;
            directionRight = false;
            isMoving = true;
        }
        if (keys.d.pressed) {
            player.value.position.X += speed;
            directionLeft = false;
            directionRight = true;
            isMoving = true;
        }

        player.value.actions.movement.isMoving = isMoving;
        player.value.actions.movement.direction.left = directionLeft;
        player.value.actions.movement.direction.right = directionRight;
    }

    player.value.position.X = clamp(player.value.position.X, 0, 93);
    player.value.position.Y = clamp(player.value.position.Y, 0, 86);

    playerBonusHit();
}

/**
 * Handle player's projectiles animations
 * @beta
 */
function handleProjectilesMovementAnimations() {
    projectiles.value.forEach((projectile) => {
        if (!projectile.states.isSpawned) return;

        projectile.position.X += projectile.speed;

        if (projectile.states.lifeSpan <= 0 || projectile.position.X >= 99) {
            projectile.states.isSpawned = false;
        } else {
            projectile.states.lifeSpan -= 16.6; // approx. frame duration
        }

        projectileHit(projectile);
    });

    projectiles.value = projectiles.value.filter((p) => p.states.isSpawned);
}

/**
 * Handle enemies movement animations
 * @beta
 */
function handleEnemiesMovementAnimations() {
    enemies.value.forEach((enemy) => {
        if (!enemy.states.isSpawned) return;

        const dx = player.value.position.X - enemy.position.X;
        const dy = player.value.position.Y - enemy.position.Y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (dx > 0) {
            enemy.orientation.right = true;
            enemy.orientation.left = false;
        } else {
            enemy.orientation.right = false;
            enemy.orientation.left = true;
        }
        if (distance > 1e-2) {
            enemy.position.X += (dx / distance) * enemy.personalAttributes.movementSpeed;
            enemy.position.Y += (dy / distance) * enemy.personalAttributes.movementSpeed;
        }

        if (
            Math.round(enemy.position.X) === Math.round(player.value.position.X) &&
            Math.round(enemy.position.Y) === Math.round(player.value.position.Y)
        ) {
            const now = performance.now();
            const timeSinceLastHit = now - player.value.states.lastDamageTime;
            const damageCoolDown = 500; // ms

            if (timeSinceLastHit > damageCoolDown && player.value.personalAttributes.HP > 0) {
                player.value.personalAttributes.HP -=
                    enemy.personalAttributes.damage *
                    enemies.value.filter(
                        (e) =>
                            Math.round(e.position.X) === Math.round(player.value.position.X) &&
                            Math.round(e.position.Y) === Math.round(player.value.position.Y),
                    ).length;
                player.value.states.lastDamageTime = now;

                if (player.value.personalAttributes.HP <= 0) {
                    player.value.states.isSpawned = false;
                    return;
                }
            }
        }
    });
}

/**
 * Initiate player's projectile shooting loop
 * @beta
 */
function startFiring() {
    if (fireInterval || !player.value.states.isSpawned) return;

    fireInterval = setInterval(() => {
        if (!player.value.states.isSpawned) {
            stopFiring(); // sécurité
            return;
        }
        playerStartShooting();
    }, player.value.personalAttributes.fireRate);
}

/**
 * Initiate enemies spawning loop
 * @beta
 */
function startEnemiSpawn() {
    if (enemySpawnInterval || !player.value.states.isSpawned) return;

    const spawningRate = 1225 - player.value.personalAttributes.score / 20;

    enemySpawnInterval = setInterval(() => {
        if (!player.value.states.isSpawned) {
            stopEnemySpawn();
            return;
        }
        spawnEnemy();
    }, spawningRate);
}

/**
 * Stop player's projectile shooting loop
 * @beta
 */
function stopFiring() {
    if (fireInterval) {
        clearInterval(fireInterval);
        fireInterval = null;
    }
}

/**
 * Stop enemies spawning loop
 * @beta
 */
function stopEnemySpawn() {
    if (enemySpawnInterval) {
        clearInterval(enemySpawnInterval);
        enemySpawnInterval = null;
    }
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
}

/**
 * Construct an iteration of a player's projectile
 * Initiate the projectiles movement loop animation
 * @beta
 */
function playerStartShooting() {
    if (!player.value.states.isSpawned || isGamePaused.value) return;
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
    });

    projectiles.value.push(projectile);
    projectileMovement(projectile);
}

/**
 * Enable the PAUSE state when the bonus selection page is displayed
 * @beta
 */
function HandlePauseStateWhenBonusPageOpen() {
    isBoostPageOpen.value = false;
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

        if (isGamePaused.value || player.value.personalAttributes.HP > 0) return;

        requestAnimationFrame(animateProjectile);
    }

    if (isGamePaused.value || player.value.personalAttributes.HP > 0) return;

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
            player.value.personalAttributes.score++;
            enemy.states.isSpawned = false;
            enemy.states.canKill = false;
            enemies.value = enemies.value.filter((e) => e.id !== enemy.id);
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
    if (isGamePaused.value) return;

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
 * Make a bonus spawn into the scene
 * @Beta
 */
function spawnPlayerBonus() {
    if (isGamePaused.value) return;

    const bonus = {
        name: 'Better fire rate',
        bonusType: 'projectile',
        aquired: false,
        boost: {
            fireRate: 0.5,
        },
        position: {
            X: randomPositionX(),
            Y: randomPositionY(),
        },
        structure: {
            dimensions: {
                width: 20,
                height: 30,
            },
        },
        states: {
            isSpawned: true,
        },
    } as PowerUp;

    playerBonus.value = bonus;
}

/**
 * Handle player bonus hitbox
 * @beta
 */
function playerBonusHit() {
    if (playerBonus.value === null) return;

    const isColliding = calculColisionBetweenTwoEntities(playerBonus.value, player.value, sceneRef);

    if (isColliding) {
        playerBonus.value.states.isSpawned = false;
        if (playerBonus.value.boost?.fireRate && player.value.personalAttributes.fireRate >= 250)
            player.value.personalAttributes.fireRate *= playerBonus.value.boost?.fireRate;
        playerBonus.value = null;
        return;
    }
}

/**
 * Prevent an entity to move out of a certain perimeter
 * @param val The entity position on the scene (X or Y axis)
 * @param min The minimum value in % (0 recommended)
 * @param max The maximum value in % (value < 100 recommended)
 */
function clamp(val: number, min: number, max: number) {
    return Math.max(min, Math.min(max, val));
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
});

onUnmounted(() => {
    window.removeEventListener('keydown', movementKeyDown);
    window.removeEventListener('keyup', movementKeyUp);
    cancelAnimationFrame(animationFrameId);
});
</script>

<template>
    <div ref="sceneRef" id="scene" class="relative flex h-screen flex-col bg-[url(/assets/ground/ground.jpg)] bg-auto">
        <DebbugButtons
            v-if="isGameDevModeEnabled"
            @showHitboxes="showHitboxes"
            @spawnPlayer="spawnPlayer"
            @spawnEnemy="spawnEnemy"
            @spawnPlayerBonus="spawnPlayerBonus"
            @playerStartShooting="playerStartShooting"
        ></DebbugButtons>
        <div v-if="isBoostPageOpen" class="z-50 w-[50%] rounded-xl border-2 border-white bg-black p-3 shadow-2xl">
            <div class="flex items-center justify-center p-3 text-3xl font-bold text-white">
                <h1>SELECT AN UPGRADE</h1>
            </div>
            <div class="flex w-full justify-center gap-5">
                <Card class="w-1/3">
                    <CardHeader>
                        <CardTitle>Movement Speed</CardTitle>
                        <CardDescription>Increase by 2% your movement speed </CardDescription>
                    </CardHeader>
                    <CardFooter>
                        <Button @click="HandlePauseStateWhenBonusPageOpen" class="w-full cursor-pointer">Select</Button>
                    </CardFooter>
                </Card>
                <Card class="w-1/3">
                    <CardHeader>
                        <CardTitle>Projectile Speed</CardTitle>
                        <CardDescription>Increase by 2% your projectiles speed</CardDescription>
                    </CardHeader>
                    <CardFooter>
                        <Button class="w-full cursor-pointer">Select</Button>
                    </CardFooter>
                </Card>
                <Card class="w-1/3">
                    <CardHeader>
                        <CardTitle>Fire Rate</CardTitle>
                        <CardDescription>Increase by 2% your fire rate</CardDescription>
                    </CardHeader>
                    <CardFooter>
                        <Button class="w-full cursor-pointer">Select</Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
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
            :enemy-spawn-state="enemy.states.isSpawned"
            :enemy-pos-x="enemy.position.X"
            :enemy-pos-y="enemy.position.Y"
            :enemy-dim-w="enemy.structure.dimensions.width"
            :enemy-dim-h="enemy.structure.dimensions.height"
            :enemy-orientation="enemy.orientation"
        />
        <div
            v-if="playerBonus !== null"
            class="absolute z-30 animate-pulse text-green-500"
            :style="{
                visibility: `${playerBonus.states.isSpawned ? 'visible' : 'hidden'}`,
                top: `${playerBonus.position.Y - 2}%`,
                left: `${playerBonus.position.X - 1.6}%`,
                height: `${playerBonus.structure.dimensions.height}px`,
                width: `${playerBonus.structure.dimensions.width + 100}px`,
            }"
        >
            {{ playerBonus.name }}
        </div>
        <div
            v-if="playerBonus !== null"
            class="absolute z-30 animate-pulse bg-green-500"
            :style="{
                visibility: `${playerBonus.states.isSpawned ? 'visible' : 'hidden'}`,
                top: `${playerBonus.position.Y}%`,
                left: `${playerBonus.position.X}%`,
                height: `${playerBonus.structure.dimensions.height}px`,
                width: `${playerBonus.structure.dimensions.width}px`,
            }"
        ></div>
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

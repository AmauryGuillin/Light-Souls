<script setup lang="ts">
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { HealthBar } from '@/components/ui/progress-health-bar';
import { Switch } from '@/components/ui/switch';
import { Enemy } from '@/types/Game/enemy';
import { MovementKey } from '@/types/Game/movementKey';
import { Player } from '@/types/Game/player';
import { Projectile } from '@/types/Game/projectile';
import { markRaw, onMounted, onUnmounted, ref, watch } from 'vue';

const sceneRef = ref<HTMLElement | null>(null);
const isGamePaused = ref<boolean>(false);
const isGameDevModeEnabled = ref<boolean>(true);
const isHitboxesShown = ref<boolean>(false);
const projectiles = ref<Projectile[]>([]);
const enemies = ref<Enemy[]>([]);
let fireInterval: ReturnType<typeof setInterval> | null = null;
let enemySpawnInterval: ReturnType<typeof setInterval> | null = null;
let animationFrameId: number;
const player = ref<Player>({
    name: '',
    actions: {
        movement: {
            keys: {
                z: { pressed: false },
                q: { pressed: false },
                s: { pressed: false },
                d: { pressed: false },
            } as Record<MovementKey, { pressed: boolean }>,
            speed: 0.25,
        },
    },
    dimensions: {
        height: 50,
        width: 50,
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
    },
} as Player);

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

        if (keys.z.pressed) player.value.position.Y -= speed;
        if (keys.s.pressed) player.value.position.Y += speed;
        if (keys.q.pressed) player.value.position.X -= speed;
        if (keys.d.pressed) player.value.position.X += speed;
    }

    player.value.position.X = clamp(player.value.position.X, 0, 97);
    player.value.position.Y = clamp(player.value.position.Y, 0, 94);
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

    enemySpawnInterval = setInterval(() => {
        if (!player.value.states.isSpawned) {
            stopEnemySpawn();
            return;
        }
        spawnEnemy();
    }, 1250);
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
    const projectile = markRaw<Projectile>({
        id: crypto.randomUUID(),
        structure: {
            dimensions: { height: 10, width: 10 },
        },
        states: {
            isSpawned: true,
            lifeSpan: 99999,
            createdAt: performance.now(),
        },
        position: {
            X: player.value.position.X + 2,
            Y: player.value.position.Y + 2,
        },
        speed: 0.5,
        hitBox: {
            height: 1,
            width: 1,
        },
    });

    projectiles.value.push(projectile);
    projectileMovement(projectile);
}

/**
 * Handle each player's projectile movement animation
 * @param projectile The player's projectile created in the **playerStartShooting()** function
 * @beta
 */
function projectileMovement(projectile: Projectile) {
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
function projectileHit(projectile: Projectile) {
    if (!sceneRef.value) return;

    const sceneWidth = sceneRef.value.offsetWidth;
    const sceneHeight = sceneRef.value.offsetHeight;

    const pXpx = (projectile.position.X / 100) * sceneWidth;
    const pYpx = (projectile.position.Y / 100) * sceneHeight;
    const pW = projectile.hitBox.width;
    const pH = projectile.hitBox.height;

    enemies.value.forEach((enemy: Enemy) => {
        const eXpx = ((enemy.position.X + enemy.hitBox!.offsetX) / 100) * sceneWidth;
        const eYpx = ((enemy.position.Y + enemy.hitBox!.offsetY) / 100) * sceneHeight;
        const eW = enemy.hitBox!.width;
        const eH = enemy.hitBox!.height;

        const isColliding = pXpx < eXpx + eW && pXpx + pW > eXpx && pYpx < eYpx + eH && pYpx + pH > eYpx;

        if (isColliding) {
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
    const enemy = markRaw<Enemy>({
        id: crypto.randomUUID(),
        personalAttributes: {
            HP: 100,
            movementSpeed: 0.05,
            damage: 10,
        },
        structure: {
            dimensions: {
                height: 50,
                width: 50,
            },
        },
        states: {
            isSpawned: true,
            isShooting: false,
            canKill: true,
        },
        position: {
            X: Math.floor(Math.random() * 97),
            Y: Math.floor(Math.random() * 94),
        },
        hitBox: {
            offsetX: 0,
            offsetY: 0,
            width: 50,
            height: 50,
        },
    });

    enemies.value.push(enemy);
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
    <div ref="sceneRef" id="scene" class="relative flex h-screen flex-col items-center justify-center bg-gray-900">
        <div v-if="isGameDevModeEnabled" class="absolute top-1 left-[82%] z-50 flex">
            <button class="cursor-pointer rounded-lg border-2 bg-black p-1 font-bold text-white hover:bg-red-600" @click="showHitboxes">
                Hitboxes
            </button>
            <button class="cursor-pointer rounded-lg border-2 bg-black p-1 font-bold text-white hover:bg-gray-800" @click="spawnPlayer">
                spawn player
            </button>
            <button class="cursor-pointer rounded-lg border-2 bg-black p-1 font-bold text-white hover:bg-gray-800" @click="spawnEnemy">
                spawn enemy
            </button>
            <button class="cursor-pointer rounded-lg border-2 bg-black p-1 font-bold text-white hover:bg-red-600" @click="playerStartShooting">
                Shoot!
            </button>
        </div>
        <Dialog :open="isGamePaused">
            <DialogContent>
                <DialogHeader class="gap-10">
                    <DialogTitle>
                        <div class="flex items-center justify-center text-4xl">GAME PAUSED</div>
                    </DialogTitle>
                    <DialogDescription class="h-80">
                        <div class="flex items-center gap-2">
                            <Label>Enable Game Dev mode</Label>
                            <Switch v-model="isGameDevModeEnabled"></Switch>
                        </div>
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button type="button" class="cursor-pointer" @click="pauseGame()">Resume</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
        <div v-if="player.personalAttributes.HP <= 0" class="z-50 bg-red-500 text-7xl font-bold text-black">YOU DIED</div>

        <HealthBar class="absolute top-[3%] left-[40%] z-50 w-96 bg-black" :model-value="player.personalAttributes.HP" />
        <div class="absolute top-[5%] left-[40%] z-50 text-red-500">{{ player.personalAttributes.HP }} HP</div>
        <div
            v-if="player.states.isSpawned"
            id="player"
            class="absolute rounded-full bg-blue-300"
            :style="{
                top: `${player.position.Y}%`,
                left: `${player.position.X}%`,
                height: `${player.dimensions.height}px`,
                width: `${player.dimensions.width}px`,
            }"
        ></div>
        <div
            v-for="projectile in projectiles"
            v-bind:key="projectile.id"
            class="absolute rounded-full bg-amber-500"
            :style="{
                visibility: `${projectile.states.isSpawned ? 'visible' : 'hidden'}`,
                top: `${projectile.position.Y}%`,
                left: `${projectile.position.X}%`,
                height: `${projectile.structure.dimensions.height}px`,
                width: `${projectile.structure.dimensions.width}px`,
            }"
        ></div>
        <div
            v-for="enemy in enemies"
            v-bind:key="enemy.id"
            class="absolute rounded-full bg-red-600"
            :style="{
                visibility: `${enemy.states.isSpawned ? 'visible' : 'hidden'}`,
                top: `${enemy.position.Y}%`,
                left: `${enemy.position.X}%`,
                height: `${enemy.structure.dimensions.height}px`,
                width: `${enemy.structure.dimensions.width}px`,
            }"
        ></div>
        <div
            id="debug-player-hitboxe"
            v-if="player.states.isSpawned && isHitboxesShown"
            class="absolute border-2 border-blue-300"
            :style="{
                top: `${player.position.Y}%`,
                left: `${player.position.X}%`,
                height: `${player.dimensions.height}px`,
                width: `${player.dimensions.width}px`,
            }"
        ></div>
        <div
            id="debug-projectiles-hitboxes"
            v-for="projectile in projectiles"
            v-bind:key="projectile.id"
            class="absolute border-2 border-amber-500"
            :style="{
                visibility: `${projectile.states.isSpawned && isHitboxesShown ? 'visible' : 'hidden'}`,
                top: `${projectile.position.Y}%`,
                left: `${projectile.position.X}%`,
                height: `${projectile.structure.dimensions.height}px`,
                width: `${projectile.structure.dimensions.width}px`,
            }"
        ></div>
        <div
            id="debug-enemies-hitboxes"
            v-for="enemy in enemies"
            v-bind:key="enemy.id"
            class="absolute border-2 border-red-600"
            :style="{
                visibility: `${enemy.states.isSpawned && isHitboxesShown ? 'visible' : 'hidden'}`,
                top: `${enemy.position.Y + enemy.hitBox!.offsetY}%`,
                left: `${enemy.position.X + enemy.hitBox!.offsetX}%`,
                height: `${enemy.structure.dimensions.height}px`,
                width: `${enemy.structure.dimensions.width}px`,
            }"
        ></div>
    </div>
</template>

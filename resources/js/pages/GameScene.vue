<script setup lang="ts">
import { Progress } from '@/components/ui/progress';
import { Enemy } from '@/types/Game/enemy';
import { MovementKey } from '@/types/Game/movementKey';
import { Player } from '@/types/Game/player';
import { Projectile } from '@/types/Game/projectile';
import { onMounted, onUnmounted, reactive, ref } from 'vue';

const isGamePaused = ref<boolean>(false);
const isHitboxesShown = ref<boolean>(false);

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
    },
} as Player);

const projectiles = ref<Projectile[]>([]);
const enemies = ref<Enemy[]>([]);

let animationFrameId: number;

function gameLoop() {
    if (isGamePaused.value) return;

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

                console.log('Le joueur a pris un dégât ! HP:', player.value.personalAttributes.HP);

                if (player.value.personalAttributes.HP <= 0) {
                    player.value.states.isSpawned = false;
                    console.log('Le joueur est DEAD, le gros naze');
                    return;
                }
            }
        }
    });

    animationFrameId = requestAnimationFrame(gameLoop);
}

function spawnPlayer() {
    player.value.position.X = 50;
    player.value.position.Y = 50;
    player.value.name = 'Player';
    player.value.states.isSpawned = true;
}

function playerStartShooting() {
    if (!player.value.states.isSpawned || isGamePaused.value) return;
    const projectile = reactive<Projectile>({
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
        speed: 0.05,
        hitBox: {
            height: 1,
            width: 1,
        },
    });

    projectiles.value.push(projectile);
    projectileMovement(projectile);
    //projectileHit(projectile);
}

function projectileMovement(projectile: Projectile) {
    const start = performance.now();

    function animateProjectile(now: number) {
        const elapsed = now - start;

        if (elapsed > projectile.states.lifeSpan) {
            projectile.states.isSpawned = false;
            projectiles.value = projectiles.value.filter((p) => p.id !== projectile.id);
            return;
        }

        // Mouvement
        projectile.position.X += projectile.speed;
        projectile.position.X = clamp(projectile.position.X, 0, 99);
        if (projectile.position.X >= 99) {
            projectile.states.isSpawned = false;
            return;
        }

        if (isGamePaused.value) {
            return;
        }

        requestAnimationFrame(animateProjectile);
    }

    if (isGamePaused.value) {
        return;
    }

    requestAnimationFrame(animateProjectile);
}

function projectileHit(projectile: Projectile) {
    enemies.value.forEach((enemy: Enemy) => {
        const pX = projectile.position.X;
        const pY = projectile.position.Y;
        const pW = projectile.hitBox.width;
        const pH = projectile.hitBox.height;

        const eX = enemy.position.X + enemy.hitBox!.offsetX;
        const eY = enemy.position.Y + enemy.hitBox!.offsetY;
        const eW = enemy.hitBox!.width;
        const eH = enemy.hitBox!.height;

        const isColliding = pX <= eX + eW && pX + pW >= eX && pY <= eY + eH && pY + pH >= eY;

        console.log(
            'calcul',
            pX + ' <= ' + eX + eW + ' && ' + pX + pW + ' >= ' + eX + ' && ' + pY + ' <= ' + eY + eH + ' && ' + pY + pH + ' >= ' + eY,
        );
        console.log('calcul bool', pX <= eX + eW, '&&', pX + pW >= eX, '&&', pY <= eY + eH, '&&', pY + pH >= eY);

        /*
            calcul
            20.55 <= 2050 OK
            && 20.551 >= 20 OK
            && 79.25 <= 7350 OK
            && 79.251 >= 73 OK
        */

        if (isColliding) {
            console.log(enemy.id, 'hit');
            enemy.states.isSpawned = false;
            enemy.states.canKill = false;
            enemies.value = enemies.value.filter((e) => e.id !== enemy.id);
        }
    });
}

function spawnEnemy() {
    const enemy = reactive<Enemy>({
        id: crypto.randomUUID(),
        personalAttributes: {
            HP: 100,
            movementSpeed: 0.05, //0.05
            damage: 1,
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
            X: Math.floor(Math.random() * 97), //80
            Y: Math.floor(Math.random() * 94), //80
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

function clamp(val: number, min: number, max: number) {
    return Math.max(min, Math.min(max, val));
}

function movementKeyDown(e: KeyboardEvent) {
    const key = e.key.toLowerCase();
    if (key in player.value.actions.movement.keys) {
        player.value.actions.movement.keys[key as MovementKey].pressed = true;
    }
}

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

function pauseGame(e: KeyboardEvent) {
    const key = e.key;
    if (key === 'Escape') {
        if (isGamePaused.value) {
            console.log('Game start');
            isGamePaused.value = false;
            animationFrameId = requestAnimationFrame(gameLoop);
            return;
        }
        console.log('Game paused');
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
    <div id="scene" class="relative flex h-screen flex-col items-center justify-center bg-gray-900">
        <div class="absolute top-1 left-[82%] z-50 flex">
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
        <div v-if="isGamePaused" class="z-50 bg-white text-7xl font-bold text-black">GAME PAUSED</div>

        <Progress class="absolute top-[3%] left-[40%] z-50 w-96" :model-value="player.personalAttributes.HP" />
        <div class="absolute top-[5%] left-[40%] z-50">{{ player.personalAttributes.HP }} HP</div>
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
                top: `${enemy.position.Y}%`,
                left: `${enemy.position.X}%`,
                height: `${enemy.structure.dimensions.height}px`,
                width: `${enemy.structure.dimensions.width}px`,
            }"
        ></div>
    </div>
</template>

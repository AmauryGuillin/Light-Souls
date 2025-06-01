<script setup lang="ts">
import { onMounted, onUnmounted, reactive, ref } from 'vue';

type MovementKey = 'z' | 'q' | 's' | 'd';

type Player = {
    name: string;
    actions: {
        movement: {
            keys: {
                z: { pressed: boolean };
                q: { pressed: boolean };
                s: { pressed: boolean };
                d: { pressed: boolean };
            };
            speed: number;
        };
    };
    dimensions: {
        height: number;
        width: number;
    };
    position: {
        X: number;
        Y: number;
    };
    states: {
        isSpawned: boolean;
        isShooting: boolean;
    };
};

type Enemy = {
    id: string;
    personalAttributes: {
        HP: number;
        movementSpeed: number;
    };
    structure: {
        dimensions: {
            height: number;
            width: number;
        };
    };
    states: {
        isSpawned: boolean;
        isShooting: boolean;
        canKill: boolean;
    };
    position: {
        X: number;
        Y: number;
    };
    hitBox?: {
        offsetX: number;
        offsetY: number;
        width: number;
        height: number;
    };
};

type Projectile = {
    id: string;
    structure: {
        dimensions: {
            height: number;
            width: number;
        };
    };
    states: {
        isSpawned: boolean;
        lifeSpan: number;
    };
    position: {
        X: number;
        Y: number;
    };
    speed: number;
    hitBox: {
        height: number;
        width: number;
    };
};

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
    },
} as Player);

const projectiles = ref<Projectile[]>([]);
const enemies = ref<Enemy[]>([]);

let animationFrameId: number;

function gameLoop() {
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
            console.log('you lost');
            player.value.states.isSpawned = false;
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
    if (!player.value.states.isSpawned) return;
    const projectile = reactive<Projectile>({
        id: crypto.randomUUID(),
        structure: {
            dimensions: { height: 10, width: 10 },
        },
        states: {
            isSpawned: true,
            lifeSpan: 99999999999999,
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
    projectileHit(projectile);
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

        projectile.position.X += projectile.speed;
        projectile.position.X = clamp(projectile.position.X, 0, 99);
        if (clamp(projectile.position.X, 0, 99) >= 99) projectile.states.isSpawned = false;

        requestAnimationFrame(animateProjectile);
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

        const isColliding = pX < eX + eW && pX + pW > eX && pY < eY + eH && pY + pH > eY;

        if (isColliding) {
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
            movementSpeed: 0.05,
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
            X: 80,
            Y: 80,
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

onMounted(() => {
    window.addEventListener('keydown', movementKeyDown);
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
    <div id="scene" class="relative h-screen bg-gray-900">
        <button
            class="relative top-1 left-1 z-50 mx-2 my-1 cursor-pointer rounded-lg border-2 bg-black p-1 font-bold text-white hover:bg-gray-800"
            @click="spawnPlayer"
        >
            spawn player
        </button>
        <button
            class="relative top-1 left-1 z-50 mx-2 my-1 cursor-pointer rounded-lg border-2 bg-black p-1 font-bold text-white hover:bg-gray-800"
            @click="spawnEnemy"
        >
            spawn enemy
        </button>
        <button
            class="relative top-1 left-1 z-50 mx-2 my-1 cursor-pointer rounded-lg border-2 bg-black p-1 font-bold text-white hover:bg-red-600"
            @click="playerStartShooting"
        >
            Shoot!
        </button>
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
    </div>
</template>

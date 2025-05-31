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

let animationFrameId: number;

function spawnPlayer() {
    player.value.position.X = 50;
    player.value.position.Y = 50;
    player.value.name = 'Player';
    player.value.states.isSpawned = true;
}

function playerStartShooting() {
    const projectile = reactive<Projectile>({
        id: crypto.randomUUID(),
        structure: {
            dimensions: { height: 10, width: 10 },
        },
        states: {
            isSpawned: true,
            lifeSpan: 500,
        },
        position: {
            X: player.value.position.X + 2,
            Y: player.value.position.Y + 2,
        },
        speed: 0.4,
    });

    projectiles.value.push(projectile);
    projectileMovement(projectile);
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

        requestAnimationFrame(animateProjectile);
    }

    requestAnimationFrame(animateProjectile);
}

function movePlayer() {
    const keys = player.value.actions.movement.keys;
    const speed = player.value.actions.movement.speed;

    if (keys.z.pressed) player.value.position.Y -= speed;
    if (keys.s.pressed) player.value.position.Y += speed;
    if (keys.q.pressed) player.value.position.X -= speed;
    if (keys.d.pressed) player.value.position.X += speed;

    player.value.position.X = clamp(player.value.position.X, 0, 97);
    player.value.position.Y = clamp(player.value.position.Y, 0, 94);

    animationFrameId = requestAnimationFrame(movePlayer);
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
    animationFrameId = requestAnimationFrame(movePlayer);
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
    </div>
</template>

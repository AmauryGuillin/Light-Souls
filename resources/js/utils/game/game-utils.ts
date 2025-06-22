import { EnemyType } from '@/types/game/enemy';
import { PlayerType } from '@/types/game/player';
import { ProjectileType } from '@/types/game/projectile';
import { Ref } from 'vue';

/**
 * Define an entity position on the X axis
 * @returns A random number
 */
export function randomPositionX(): number {
    return Math.floor(Math.random() * 97);
}

/**
 * Define an entity position on the Y axis
 * @returns A random number
 */
export function randomPositionY(): number {
    return Math.floor(Math.random() * 94);
}

/**
 * Prevent an entity to move out of a certain perimeter
 * @param val The entity position on the scene (X or Y axis)
 * @param min The minimum value in % (0 recommended)
 * @param max The maximum value in % (value < 100 recommended)
 */
export function clamp(val: number, min: number, max: number) {
    return Math.max(min, Math.min(max, val));
}

/**
 * Define a boolean that determine if the first entity and the second entity are colliding
 * @param firstEntity The entity that will be collided
 * @param secondEntity The entity that aims to collide the first entity
 * @beta
 */
export function calculColisionBetweenTwoEntities(
    firstEntity: PlayerType | EnemyType | ProjectileType,
    secondEntity: PlayerType | EnemyType | ProjectileType,
    sceneRef: Ref<HTMLElement | null, HTMLElement | null>,
): boolean {
    if (!sceneRef.value) return false;

    const sceneWidth = sceneRef.value.offsetWidth;
    const sceneHeight = sceneRef.value.offsetHeight;

    const firstEntityPositionXPx = (firstEntity.position.X / 100) * sceneWidth;
    const firstEntityPositionYPx = (firstEntity.position.Y / 100) * sceneHeight;
    const firstEntityWidth = firstEntity.structure.dimensions.width;
    const firstEntityHeight = firstEntity.structure.dimensions.height;

    const secondEntityPositionXPx = (secondEntity.position.X / 100) * sceneWidth;
    const secondEntityPositionYPx = (secondEntity.position.Y / 100) * sceneHeight;
    const secondEntityWidth = secondEntity.structure.dimensions.width;
    const secondEntityHeight = secondEntity.structure.dimensions.height;

    const isColliding =
        firstEntityPositionXPx < secondEntityPositionXPx + secondEntityWidth &&
        firstEntityPositionXPx + firstEntityHeight > secondEntityPositionXPx &&
        firstEntityPositionYPx < secondEntityPositionYPx + secondEntityHeight &&
        firstEntityPositionYPx + firstEntityWidth > secondEntityPositionYPx;

    return isColliding;
}

/**
 * Gère la fermeture de la page de bonus et enlève la pause du jeu.
 * @param isBoostPageOpen Ref<boolean> de l'état d'ouverture de la page de bonus
 * @param isGamePaused Ref<boolean> de l'état de pause du jeu
 */
export function handlePauseStateWhenBonusPageOpen(isBoostPageOpen: Ref<boolean>, isGamePaused: Ref<boolean>) {
    isBoostPageOpen.value = false;
    isGamePaused.value = false;
}

/**
 * Handle player movement
 * @param player Ref<PlayerType>
 */
export function handlePlayerMovementAnimation(player: Ref<PlayerType>) {
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
}

/**
 * Handle player's projectiles animations
 * @param projectiles Ref<ProjectileType[]>
 * @param projectileHit Function to handle projectile collision
 */
export function handleProjectilesMovementAnimations(projectiles: Ref<ProjectileType[]>, projectileHit: (projectile: ProjectileType) => void) {
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

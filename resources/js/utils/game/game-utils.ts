import { EnemyType } from '@/types/game/enemy';
import { PlayerType } from '@/types/game/player';
import { PowerUp } from '@/types/game/powerup';
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
 * Define a boolean that determine if the first entity and the second entity are colliding
 * @param firstEntity The entity that will be collided
 * @param secondEntity The entity that aims to collide the first entity
 * @beta
 */
export function calculColisionBetweenTwoEntities(
    firstEntity: PlayerType | EnemyType | ProjectileType | PowerUp,
    secondEntity: PlayerType | EnemyType | ProjectileType | PowerUp,
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

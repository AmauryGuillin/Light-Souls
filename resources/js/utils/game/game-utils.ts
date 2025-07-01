import { EnemyType } from '@/types/game/enemy';
import { PlayerType } from '@/types/game/player';
import { ProjectileType } from '@/types/game/projectile';
import { Ref } from 'vue';

export function lauchGame() {
    window.open(import.meta.env.VITE_GAME_URL);
}

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
    return Math.floor(Math.random() * 92);
}

export function getRandomNumber(min: number, max: number) {
    return Math.floor(Math.random() * (max - min) + min);
}

export function randomEnemyPosition(playerX: number, playerY: number, safeRadius = 20) {
    let x = 0,
        y = 0;
    let tries = 0;
    do {
        // Select random edge
        const border = Math.floor(Math.random() * 4);
        switch (border) {
            case 0: // up
                x = getRandomNumber(0, 99);
                y = 0;
                break;
            case 1: // down
                x = getRandomNumber(0, 99);
                y = 99;
                break;
            case 2: // left
                x = 0;
                y = getRandomNumber(0, 99);
                break;
            case 3: // right
                x = 99;
                y = getRandomNumber(0, 99);
                break;
        }
        tries++;
        // avoid infinite loop
        if (tries > 10) break;
    } while (Math.hypot(x - playerX, y - playerY) < safeRadius);
    return { X: x, Y: y };
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

export function calculEnemyHitColision(
    firstEntity: PlayerType | EnemyType | ProjectileType,
    secondEntity: PlayerType | EnemyType | ProjectileType,
    sceneRef: Ref<HTMLElement | null, HTMLElement | null>,
): boolean {
    if (!sceneRef.value) return false;

    const sceneWidth = sceneRef.value.offsetWidth;
    const sceneHeight = sceneRef.value.offsetHeight;

    const firstEntityPositionXPx = (firstEntity.position.X / 100) * sceneWidth;
    const firstEntityPositionYPx = (firstEntity.position.Y / 100) * sceneHeight;
    const firstEntityWidth = firstEntity.structure.dimensions.width - 90;
    const firstEntityHeight = firstEntity.structure.dimensions.height - 50;

    const secondEntityPositionXPx = (secondEntity.position.X / 100) * sceneWidth;
    const secondEntityPositionYPx = (secondEntity.position.Y / 100) * sceneHeight;
    const secondEntityWidth = secondEntity.structure.dimensions.width - 70;
    const secondEntityHeight = secondEntity.structure.dimensions.height - 70;

    const isColliding =
        firstEntityPositionXPx < secondEntityPositionXPx + secondEntityWidth &&
        firstEntityPositionXPx + firstEntityHeight > secondEntityPositionXPx &&
        firstEntityPositionYPx < secondEntityPositionYPx + secondEntityHeight &&
        firstEntityPositionYPx + firstEntityWidth > secondEntityPositionYPx;

    return isColliding;
}

/**
 * Gère la fermeture de la page de bonus et enlève la pause du jeu.
 * @param isBoostPageOpen Ref<boolean> for the boost page open state
 * @param isGamePaused Ref<boolean> for the pause state of the game
 *
 */
export function handlePauseStateWhenBonusPageOpen(isBoostPageOpen: Ref<boolean>, isGamePaused: Ref<boolean>) {
    isBoostPageOpen.value = false;
    isGamePaused.value = false;
}

/**
 * Handle player movement
 * @param player Ref<PlayerType>
 */
export function handlePlayerMovementAnimation(player: Ref<PlayerType>, keyboardConfig: string) {
    if (player.value.states.isSpawned) {
        if (keyboardConfig === 'WASD') {
            const keys = player.value.actions.movement.WASD.keys;
            const speed = player.value.actions.movement.speed;

            let isMoving = false;
            let directionLeft = false;
            let directionRight = false;

            if (keys.w.pressed) {
                player.value.position.Y -= speed;
                isMoving = true;
            }
            if (keys.s.pressed) {
                player.value.position.Y += speed;
                isMoving = true;
            }
            if (keys.a.pressed) {
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
        } else {
            const keys = player.value.actions.movement.ZQSD.keys;
            const speed = player.value.actions.movement.speed;

            let isMoving = false;
            // let directionLeft = false;
            // let directionRight = false;

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
                // directionLeft = true;
                // directionRight = false;
                isMoving = true;
            }
            if (keys.d.pressed) {
                player.value.position.X += speed;
                //directionLeft = false;
                //directionRight = true;
                isMoving = true;
            }
            player.value.actions.movement.isMoving = isMoving;
            //player.value.actions.movement.direction.left = directionLeft;
            //player.value.actions.movement.direction.right = directionRight;
        }
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

/**
 * Handle enemies movement animations
 * @param enemies Ref<EnemyType[]>
 * @param player Ref<PlayerType>
 */
export function handleEnemiesMovementAnimations(
    enemies: Ref<EnemyType[]>,
    player: Ref<PlayerType>,
    playSoundEffectEnemyAttack: () => void,
    playSoundEffectPlayerHit: () => void,
    sceneRef: Ref<HTMLElement | null>,
) {
    enemies.value.forEach((enemy) => {
        if (!enemy.states.isSpawned) return;

        const dx = player.value.position.X - enemy.position.X;
        const dy = player.value.position.Y - enemy.position.Y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (dx >= 0) {
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

        if (calculEnemyHitColision(enemy, player.value, sceneRef)) {
            const now = performance.now();
            const timeSinceLastHit = now - player.value.states.lastDamageTime;
            const damageCoolDown = 500; // ms

            if (timeSinceLastHit > damageCoolDown && player.value.personalAttributes.HP > 0) {
                const levelMultiplier = 1 + 0.1 * Math.max(0, player.value.personalAttributes.level - 1);
                playSoundEffectEnemyAttack();
                playSoundEffectPlayerHit();
                player.value.personalAttributes.HP -=
                    enemy.personalAttributes.damage *
                    levelMultiplier *
                    player.value.personalAttributes.defense *
                    enemies.value.filter((e) => calculEnemyHitColision(e, player.value, sceneRef)).length;
                player.value.states.lastDamageTime = now;

                if (player.value.personalAttributes.HP <= 0) {
                    player.value.personalAttributes.HP = 0;
                    player.value.states.isSpawned = false;
                    return;
                }
            }
        }
    });
}

/**
 * Démarre la boucle de tir du joueur.
 * @param fireIntervalRef Ref<ReturnType<typeof setInterval> | null>
 * @param player Ref<PlayerType>
 * @param playerStartShooting Call this function for each shoot
 * @param stopFiring Call this function to stop the shoot loop
 *
 */
export function startFiring(
    fireIntervalRef: Ref<ReturnType<typeof setInterval> | null>,
    player: Ref<PlayerType>,
    playerStartShooting: () => void,
    stopFiring: () => void,
) {
    if (fireIntervalRef.value || !player.value.states.isSpawned) return;

    fireIntervalRef.value = setInterval(() => {
        if (!player.value.states.isSpawned) {
            stopFiring();
            return;
        }
        playerStartShooting();
    }, player.value.personalAttributes.fireRate);
}

/**
 * Démarre la boucle de spawn des ennemis.
 * @param enemySpawnIntervalRef Ref<ReturnType<typeof setInterval> | null>
 * @param player Ref<PlayerType>
 * @param spawnEnemy Fonction à appeler pour faire apparaître un ennemi
 * @param stopEnemySpawn Fonction pour arrêter la boucle de spawn
 */
export function startEnemiSpawn(
    enemySpawnIntervalRef: Ref<ReturnType<typeof setInterval> | null>,
    player: Ref<PlayerType>,
    spawnEnemy: () => void,
    stopEnemySpawn: () => void,
) {
    if (enemySpawnIntervalRef.value || !player.value.states.isSpawned) return;

    const spawningRate = 4000;

    enemySpawnIntervalRef.value = setInterval(() => {
        if (!player.value.states.isSpawned) {
            stopEnemySpawn();
            return;
        }
        spawnEnemy();
    }, spawningRate);
}

/**
 * Stoppe la boucle de tir du joueur.
 * @param fireIntervalRef Ref<ReturnType<typeof setInterval> | null>
 */
export function stopFiring(fireIntervalRef: Ref<ReturnType<typeof setInterval> | null>) {
    if (fireIntervalRef.value) {
        clearInterval(fireIntervalRef.value);
        fireIntervalRef.value = null;
    }
}

/**
 * Stoppe la boucle de spawn des ennemis.
 * @param enemySpawnIntervalRef Ref<ReturnType<typeof setInterval> | null>
 */
export function stopEnemySpawn(enemySpawnIntervalRef: Ref<ReturnType<typeof setInterval> | null>) {
    if (enemySpawnIntervalRef.value) {
        clearInterval(enemySpawnIntervalRef.value);
        enemySpawnIntervalRef.value = null;
    }
}

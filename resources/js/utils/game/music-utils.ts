import { Howl } from 'howler';

/**
 * Joue un effet sonore de boule de feu aléatoire.
 * @param soundEffectFireBall Array des chemins vers les sons de boule de feu
 * @param volume Volume du son (0 à 1)
 */
export function playSoundEffectFireBall(soundEffectFireBall: string[], volume: number) {
    const soundEffectIndex = Math.floor(Math.random() * soundEffectFireBall.length);

    const soundEffectFireBallSample = new Howl({
        src: [soundEffectFireBall[soundEffectIndex]],
        volume: volume + 0.2,
    });
    soundEffectFireBallSample.play();
}

/**
 * Joue l'effet sonore de power up.
 * @param soundEffectPowerUp Tableau contenant le chemin du son de power up
 * @param volume Volume du son (0 à 1)
 */
export function playSoundEffectPowerUp(soundEffectPowerUp: string[], volume: number) {
    const soundEffectPowerUpSample = new Howl({
        src: [soundEffectPowerUp[0]],
        volume: volume,
    });

    soundEffectPowerUpSample.play();
}

/**
 * Joue l'effet sonore de coup sur un ennemi.
 */
export function playSoundEffectEnemyHit(soundEffectEnemyHit: string[], volume: number) {
    const soundEffectEnemyHitSample = new Howl({
        src: [soundEffectEnemyHit[0]],
        volume: volume,
    });
    soundEffectEnemyHitSample.play();
}

/**
 * Joue un effet sonore d'attaque d'ennemi aléatoire.
 */
export function playSoundEffectEnemyAttack(soundEffectEnemyAttack: string[], volume: number) {
    const soundEffectIndex = Math.floor(Math.random() * soundEffectEnemyAttack.length);
    const soundEffectEnemyAttackSample = new Howl({
        src: [soundEffectEnemyAttack[soundEffectIndex]],
        volume: volume - 0.2,
    });
    soundEffectEnemyAttackSample.play();
}

/**
 * Joue l'effet sonore de coup reçu par le joueur.
 */
export function playSoundEffectPlayerHit(soundEffectPlayerHit: string[], volume: number) {
    const soundEffectPlayerHitSample = new Howl({
        src: [soundEffectPlayerHit[0]],
        volume: volume - 0.2,
    });
    soundEffectPlayerHitSample.play();
}

import { Howl } from 'howler';

/**
 * Plays a random fireball sound effect from the provided array.
 * @param soundEffectFireBall Array of fireball sound file paths.
 * @param volume Volume for the sound (0 to 1).
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
 * Plays the power-up sound effect.
 * @param soundEffectPowerUp Array containing the power-up sound file path.
 * @param volume Volume for the sound (0 to 1).
 */
export function playSoundEffectPowerUp(soundEffectPowerUp: string[], volume: number) {
    const soundEffectPowerUpSample = new Howl({
        src: [soundEffectPowerUp[0]],
        volume: volume,
    });
    soundEffectPowerUpSample.play();
}

/**
 * Plays the enemy hit sound effect.
 * @param soundEffectEnemyHit Array containing the enemy hit sound file path.
 * @param volume Volume for the sound (0 to 1).
 */
export function playSoundEffectEnemyHit(soundEffectEnemyHit: string[], volume: number) {
    const soundEffectEnemyHitSample = new Howl({
        src: [soundEffectEnemyHit[0]],
        volume: volume,
    });
    soundEffectEnemyHitSample.play();
}

/**
 * Plays a random enemy attack sound effect from the provided array.
 * @param soundEffectEnemyAttack Array of enemy attack sound file paths.
 * @param volume Volume for the sound (0 to 1).
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
 * Plays the player hit sound effect.
 * @param soundEffectPlayerHit Array containing the player hit sound file path.
 * @param volume Volume for the sound (0 to 1).
 */
export function playSoundEffectPlayerHit(soundEffectPlayerHit: string[], volume: number) {
    const soundEffectPlayerHitSample = new Howl({
        src: [soundEffectPlayerHit[0]],
        volume: volume - 0.2,
    });
    soundEffectPlayerHitSample.play();
}

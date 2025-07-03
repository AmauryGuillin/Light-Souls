import { Howl } from 'howler';

const musicNames = [
    {
        id: 0,
        name: 'Diablo - Tristram Villlage',
    },
    {
        id: 1,
        name: "Baldur's Gate 3 - Nine Blades",
    },
    {
        id: 2,
        name: "Baldur's Gate 3 - Bard Dance",
    },
    {
        id: 3,
        name: 'Dofus Unity - Dofus Hero, le cruel',
    },
    {
        id: 4,
        name: 'Dofus Unity - Dofus Hero, le féérique',
    },
    {
        id: 5,
        name: "Dofus Unity - Les 4 cavaliers de l'éliocalypse",
    },
    {
        id: 6,
        name: "Dofus Unity - Dofus Hero, l'occulte",
    },
    {
        id: 6,
        name: "Dofus Unity - Dofus Hero, l'occulte",
    },
    {
        id: 7,
        name: "Guild Wars 2 - Bear's Spirit",
    },
    {
        id: 8,
        name: "Guild Wars 2 - Lornar's Pass",
    },
    {
        id: 9,
        name: 'Final Fantasy XIII-2 - Full Speed Ahead',
    },
    {
        id: 10,
        name: 'Nier Automata - Possessed by Disease (instrumental)',
    },
];

export function getMusicName(id: number) {
    return musicNames.find((m) => m.id === id)?.name;
}

/**
 * Plays a random fireball sound effect from the provided array.
 * @param soundEffectFireBall Array of fireball sound file paths.
 * @param volume Volume for the sound (0 to 1).
 */
export function playSoundEffectFireBall(soundEffectFireBall: string[], volume: number) {
    const soundEffectIndex = Math.floor(Math.random() * soundEffectFireBall.length);
    const soundEffectFireBallSample = new Howl({
        src: [soundEffectFireBall[soundEffectIndex]],
        volume: volume != 0 ? volume + 0.2 : 0,
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
        volume: volume != 0 ? (volume -= 0.2) : 0,
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
        volume: volume != 0 ? (volume -= 0.2) : 0,
    });
    soundEffectPlayerHitSample.play();
}

export function playSoundEffectPlayerDeath(soundEffectPlayerDeath: string[], volume: number) {
    const soundEffectPlayerDeathSample = new Howl({
        src: [soundEffectPlayerDeath[0]],
        volume: volume,
    });
    soundEffectPlayerDeathSample.play();
}

export function stopGameMusic(music: Howl | null) {
    music?.stop();
}

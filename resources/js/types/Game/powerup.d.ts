export type PowerUpType = {
    name: PowerUpBonusNames;
    bonusType: PowerUpBonusType;
    boost: PowerUpBoost;
    description: string;
};

export type PowerUpBonusNames = '';

export type PowerUpBonusType = 'attack' | 'defense' | 'speed' | 'fireRate';

export type PowerUpBoost = {
    damageMultiplier?: number; // ex: 1.1 pour +10% dégâts
    defenseMultiplier?: number; // ex: 1.1 pour +10% défense
    speedMultiplier?: number; // ex: 1.1 pour +10% vitesse
    fireRateMultiplier?: number; // ex: 0.9 pour -10% temps entre tirs
};

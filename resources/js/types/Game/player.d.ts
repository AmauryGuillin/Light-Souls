export type PlayerType = {
    name: string;
    actions: {
        movement: {
            keys: {
                z: { pressed: boolean };
                q: { pressed: boolean };
                s: { pressed: boolean };
                d: { pressed: boolean };
            };
            direction: {
                left: boolean;
                right: boolean;
            };
            isMoving: boolean;
            speed: number;
        };
    };
    structure: {
        dimensions: {
            height: number;
            width: number;
        };
    };
    position: {
        X: number;
        Y: number;
    };
    states: {
        isSpawned: boolean;
        isShooting: boolean;
        lastDamageTime: number;
    };
    personalAttributes: {
        maxHP: number;
        HP: number;
        fireRate: number;
        score: number;
        XP: number;
        level: number;
        defense: number;
        attackPower: number;
    };
};

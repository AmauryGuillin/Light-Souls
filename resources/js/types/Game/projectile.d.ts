export type ProjectileType = {
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
        createdAt: number;
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
    damage: number;
    hitEnemies: string[];
};

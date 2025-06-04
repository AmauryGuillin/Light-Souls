export type PowerUp = {
    name: string;
    bonusType: string;
    aquired: boolean;
    boost?: {
        fireRate?: number;
        movementSpeed?: number;
    };
    position: {
        X: number;
        Y: number;
    };
    structure: {
        dimensions: {
            width: number;
            height: number;
        };
    };
    states: {
        isSpawned: boolean;
    };
};

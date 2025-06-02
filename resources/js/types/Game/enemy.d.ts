export type Enemy = {
    id: string;
    personalAttributes: {
        HP: number;
        movementSpeed: number;
        damage: number;
    };
    structure: {
        dimensions: {
            height: number;
            width: number;
        };
    };
    states: {
        isSpawned: boolean;
        isShooting: boolean;
        canKill: boolean;
    };
    position: {
        X: number;
        Y: number;
    };
    hitBox?: {
        offsetX: number;
        offsetY: number;
        width: number;
        height: number;
    };
};

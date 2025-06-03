export type Player = {
    name: string;
    actions: {
        movement: {
            keys: {
                z: { pressed: boolean };
                q: { pressed: boolean };
                s: { pressed: boolean };
                d: { pressed: boolean };
            };
            speed: number;
        };
    };
    dimensions: {
        height: number;
        width: number;
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
        HP: number;
        fireRate: number;
    };
};

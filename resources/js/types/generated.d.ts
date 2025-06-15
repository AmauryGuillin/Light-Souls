declare namespace App.Data {
    export type PowerUpFormData = {
        name: string;
        powerupType: string;
        bonusType: string;
        multiplier: number | null;
        unlockLevel: number | null;
        assetId: number | null;
        description: string;
    };
    export type PowerupData = {
        id: number;
        name: string;
        description: string;
        unlockLevel: number;
        powerup_types_id: number;
        powerup_boosts_id: number;
        powerup_assets_id: number;
        created_at: string;
        updated_at: string;
    };
    export type RoleData = {
        id: number;
        name: App.Enum.Roles;
    };
    export type UserData = {
        id: number;
        name: string;
        email: string;
        email_verified_at: string;
        password: string;
        remember_token: string;
        created_at: string;
        updated_at: string;
        role_id: number;
    };
}
declare namespace App.Enum {
    export type PowerupBoosts = 'Increase' | 'Decrease';
    export type PowerupTypes = 'Attack' | 'Defense' | 'Speed' | 'FireRate';
    export type Roles = 'User' | 'Developper';
}

declare namespace App.Data {
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

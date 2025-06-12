declare namespace App.Data {
    export type RoleData = {
        id: number;
        name: App.Enum.Roles;
    };
}
declare namespace App.Enum {
    export type Roles = 'User' | 'Developper';
}

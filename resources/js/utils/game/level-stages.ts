export const playerLevels = [
    { playerLevel: 3, enemies: 2 },
    { playerLevel: 6, enemies: 3 },
    { playerLevel: 9, enemies: 4 },
    { playerLevel: 12, enemies: 5 },
    { playerLevel: 15, enemies: 6 },
    { playerLevel: 20, enemies: 7 },
    { playerLevel: 30, enemies: 8 },
    { playerLevel: 40, enemies: 15 },
    { playerLevel: 50, enemies: 15 },
    { playerLevel: 60, enemies: 15 },
    { playerLevel: 70, enemies: 15 },
    { playerLevel: 80, enemies: 15 },
    { playerLevel: 90, enemies: 15 },
    { playerLevel: 100, enemies: 15 },
];

export function getEnemiesNumber(playerLevel: number) {
    return playerLevels.find((item) => playerLevel <= item.playerLevel)?.enemies ?? 20;
}

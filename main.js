import { getSteamInstallDirs, getSteamInstalledGames } from "./list-steam-games.js";

let dirs = await getSteamInstallDirs();
console.log("Steam install dirs :");
console.log(dirs);

let games = await getSteamInstalledGames(dirs);
console.log("Installed games :");
console.log(games);
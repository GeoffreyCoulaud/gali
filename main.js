import { getSteamInstallDirs, getSteamInstalledGames } from "./list-steam-games.js";
import { getLutrisInstalledGames } from "./list-lutris-games.js";

let steamDirs = await getSteamInstallDirs();
let steamGames = await getSteamInstalledGames(steamDirs);
let lutrisGames = await getLutrisInstalledGames();
console.log(steamGames.concat(lutrisGames));
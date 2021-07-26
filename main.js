import { getDolphinEmuInstallDirs, getDolphinEmuInstalledGames } from "./scanners/dolphin-emu.js";
import { getSteamInstalledGames, getSteamInstallDirs } from "./scanners/steam.js";
import { getLutrisInstalledGames } from "./scanners/lutris.js";

const steamDirs = await getSteamInstallDirs();
const dolphinDirs = await getDolphinEmuInstallDirs();
let dolphinGames = await getDolphinEmuInstalledGames(dolphinDirs);
let steamGames = await getSteamInstalledGames(steamDirs);
let lutrisGames = await getLutrisInstalledGames();
let games = (new Array()).concat(steamGames, lutrisGames, dolphinGames);

console.log("Games list :");
for (let game of games){
	console.log(`\t${game.toString()}`);
}
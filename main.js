import { getSteamInstalledGames, getSteamInstallDirs } from "./scanners/steam.js";
import { getLutrisInstalledGames } from "./scanners/lutris.js";

async function getInstalledGames(){
	let steamDirs = await getSteamInstallDirs();
	let steamGames = await getSteamInstalledGames(steamDirs);
	let lutrisGames = await getLutrisInstalledGames();
	return steamGames.concat(lutrisGames);
}

console.log(await getInstalledGames());
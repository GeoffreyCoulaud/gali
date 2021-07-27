import { getDolphinEmuInstallDirs, getDolphinEmuInstalledGames } from "./scanners/dolphin-emu.js";
import { getSteamInstalledGames, getSteamInstallDirs } from "./scanners/steam.js";
import { getLutrisInstalledGames } from "./scanners/lutris.js";

async function getInstalledGames(){
	const dolphinDirs = await getDolphinEmuInstallDirs();
	const dolphinGames = await getDolphinEmuInstalledGames(dolphinDirs);
	const steamDirs = await getSteamInstallDirs();
	const steamGames = await getSteamInstalledGames(steamDirs);
	const lutrisGames = await getLutrisInstalledGames();
	return (new Array()).concat(steamGames, lutrisGames, dolphinGames);
}

function getArrayColumnSizes(gameArrays){
	let padding = [];
	for (let gameArray of gameArrays){
		for (let i = 0; i < gameArray.length; i++){
			let strlen = gameArray[i].length;
			if (typeof padding[i] === "undefined"){
				padding[i] = strlen;
			} else if (padding[i] < strlen){
				padding[i] = strlen;
			}
		}
	}
	return padding;
}

function displayGames(games){
	const gameArrays = games.map(game=>game.toArray());
	const padding    = getArrayColumnSizes(gameArrays);
	for (let arr of gameArrays){
		let string = " ● ";
		string += arr.map((column, index) => String(column).padEnd(padding[index])).join(" | ");
		console.log(string);
	}
}

console.log("Getting games...");
const games = await getInstalledGames();
console.log("\nGames list :");
displayGames(games);
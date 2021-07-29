import { getSteamInstalledGames, getSteamInstallDirs } from "./scanners/steam.js";
import { getDolphinGames } from "./scanners/dolphin.js";
import { getLutrisInstalledGames } from "./scanners/lutris.js";
import { getCitraGames } from "./scanners/citra.js";
import { get2DArrayColumnSizes } from "./utils.js";
import { getYuzuGames } from "./scanners/yuzu.js";

export class Library{	
	
	games = [];
	constructor(warn = false){
		this.warn = warn;
	}

	get length(){
		return this.games.length;
	}

	async scan(){
		const steamDirs = await getSteamInstallDirs(this.warn);
		let games = await Promise.all([
			getYuzuGames(this.warn),
			getCitraGames(this.warn),
			getDolphinGames(this.warn),
			getSteamInstalledGames(steamDirs, this.warn),
			getLutrisInstalledGames(this.warn),
		]);
		this.games = games.flat();
	}

	async sort(criteria = "name", order = 1){
		this.games.sort((gameA, gameB)=>{
			let a = String(gameA[criteria]).toLowerCase(); 
			let b = String(gameB[criteria]).toLowerCase(); 
			if (a < b){
				return order * -1
			} else if (a === b){
				return 0
			} else {
				return order * 1
			}
		});
	}

	displayInConsole(){
		const gameArrays = this.games.map(game=>game.toArray());
		const padding    = get2DArrayColumnSizes(gameArrays);
		for (let arr of gameArrays){
			let string = " ● " + arr.map((column, index) => String(column).padEnd(padding[index])).join(" | ");
			console.log(string);
		}
	}

}
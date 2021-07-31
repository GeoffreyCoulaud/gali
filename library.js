import { getSteamInstalledGames, getSteamInstallDirs } from "./scanners/steam.js";
import { getLutrisInstalledGames } from "./scanners/lutris.js";
import { getDolphinGames } from "./scanners/dolphin.js";
import { getCitraGames } from "./scanners/citra.js";
import { getCemuGames } from "./scanners/lutris-cemu.js";
import { getYuzuGames } from "./scanners/yuzu.js";
import { get2DArrayColumnSizes } from "./utils.js";

export class Library{	
	
	games = [];
	constructor(warn = false){
		this.warn = warn;
	}

	get length(){
		return this.games.length;
	}

	async scan(){
		
		let promises = [
			
			// Get lutris games
			getLutrisInstalledGames(this.warn)
			.then(lutrisGames=>{
				this.games.push(...lutrisGames);
				// Get cemu in lutris games
				const cemuInLutrisGame = lutrisGames.find(game => game.name.toLowerCase() === "cemu");
				if (typeof cemuInLutrisGame !== "undefined"){
					return getCemuGames(cemuInLutrisGame, false, this.warn); // TODO choose between "scan" / "read cache"
				} else {
					return [];
				}
			}).then(cemuGames=>{
				this.games.push(...cemuGames);
			}),

			// Get steam games
			getSteamInstallDirs(this.warn)
			.then(steamDirs=>{
				return getSteamInstalledGames(steamDirs, this.warn);
			}).then(steamGames=>{
				this.games.push(...steamGames);
			}),

			// Get other games
			Promise.all([
				getYuzuGames(this.warn),
				getCitraGames(this.warn),
				getDolphinGames(this.warn),
			]).then(scans=>{
				for (let scan of scans){
					this.games.push(...scan);
				}
			})
		];

		await Promise.all(promises);
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
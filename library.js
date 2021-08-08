import { getLegendaryGames } from "./sources/legendary.js";
import { getRetroarchGames } from "./sources/retroarch.js";
import { getCemuGames } from "./sources/lutris-cemu.js";
import { getDolphinGames } from "./sources/dolphin.js";
import { getLutrisGames } from "./sources/lutris.js";
import { getPPSSPPGames } from "./sources/ppsspp.js";
import { getCitraGames } from "./sources/citra.js";
import { getSteamGames } from "./sources/steam.js";
import { getYuzuGames } from "./sources/yuzu.js";

/**
 * A representation of a game library.
 * @property {Game[]} games - An array of games in the library
 * @property {boolean} preferCache - Whether to prefer cache while scanning. Defaults to true
 * @property {boolean} warn - Whether to display additional warnings (especially during scan)
 * @property {string[]} enabledSources - Names of the sources to scan for games. Defaults to none   
 */
export class Library{	
	
	/**
	 * A list of available game sources
	 */
	static sources =[
		"steam",
		"dolphin",
		"yuzu",
		"citra",
		"ppsspp",
		"lutris",
		"cemu in lutris",
		"retroarch",
		"legendary",
	];

	enabledSources = [];
	preferCache = true;
	warn = false;
	games = [];
	
	/**
	 * Create a game library.
	 * @param {string[]} sources - Sources to get games from
	 * @param {boolean} preferCache - If true, when available scanning will prefer using a cache
	 * @param {boolean} warn - If true, additional warnings will be displayed
	 */
	constructor(sources = [], preferCache = true, warn = false){
		this.enabledSources = sources;
		this.preferCache = preferCache;
		this.warn = warn;
	}

	/**
	 * Scan library's sources for games
	 */
	async scan(){
		
		// Get lutris games
		if (this.enabledSources.includes("lutris")){
			const lutrisGames = await getLutrisGames(this.warn);
			this.games.push(...lutrisGames);
			
			// Get cemu games
			if (this.enabledSources.includes("cemu in lutris")){
				const cemuGame = lutrisGames.find(game=>game.name.toLowerCase() === "cemu");
				if (cemuGame){
					const cemuGames = await getCemuGames(cemuGame, this.preferCache, this.warn);
					this.games.push(...cemuGames);
				}
			}

		}

		// Get all other straightforward games
		let promises = []
		if (this.enabledSources.includes("steam")){
			promises.push(getSteamGames(this.warn));
		}
		if (this.enabledSources.includes("retroarch")){
			promises.push(getRetroarchGames(this.warn));
		}
		if (this.enabledSources.includes("yuzu")){
			promises.push(getYuzuGames(this.warn));
		}
		if (this.enabledSources.includes("dolphin")){
			promises.push(getDolphinGames(this.warn));
		}
		if (this.enabledSources.includes("citra")){
			promises.push(getCitraGames(this.warn));
		}
		if (this.enabledSources.includes("ppsspp")){
			promises.push(getPPSSPPGames(this.warn));
		}
		if (this.enabledSources.includes("legendary")){
			promises.push(getLegendaryGames(this.warn));
		}

		// Add straightforward games to the list 
		const results = await Promise.all(promises);
		const games = results.flat();
		this.games.push(...games);

	}

	/**
	 * Sort library's games by a criteria
	 * @param {string} criteria - The game property to sort games by 
	 * @param {number} order - Either 1 (normal order) or -1 (reverse order)
	 */
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

	/**
	 * Display library's games in the console
	 */
	displayInConsole(){
		for (let game of this.games){
			let string = "● " + game.toString();
			console.log(string);
		}
	}

}
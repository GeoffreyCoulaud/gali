const { DesktopEntryGame, getDesktopEntryGames } = require("./sources/desktop-entries.js");
const { LegendaryGame, getLegendaryGames } = require("./sources/legendary.js");
const { RetroarchGame, getRetroarchGames } = require("./sources/retroarch.js");
const { DolphinGame, getDolphinGames } = require("./sources/dolphin.js");
const { LutrisGame, getLutrisGames } = require("./sources/lutris.js");
const { PPSSPPGame, getPPSSPPGames } = require("./sources/ppsspp.js");
const { HeroicGame, getHeroicGames } = require("./sources/heroic.js");
const { CitraGame, getCitraGames } = require("./sources/citra.js");
const { SteamGame, getSteamGames } = require("./sources/steam.js");
const { YuzuGame, getYuzuGames } = require("./sources/yuzu.js");
const { CemuGame, getCemuGames } = require("./sources/cemu.js");

/**
 * A representation of a game library.
 * @property {Game[]} games - An array of games in the library
 * @property {boolean} preferCache - Whether to prefer cache while scanning. Defaults to true
 * @property {boolean} warn - Whether to display additional warnings (especially during scan)
 * @property {string[]} enabledSources - Names of the sources to scan for games. Defaults to none   
 */
class Library{	
	
	/**
	 * A list of available game sources
	 */
	static sources = [
		DesktopEntryGame.source,
		RetroarchGame.source,
		LegendaryGame.source,
		DolphinGame.source,
		PPSSPPGame.source,
		LutrisGame.source,
		HeroicGame.source,
		SteamGame.source,
		CitraGame.source,
		YuzuGame.source,
		CemuGame.source,
	];

	enabledSources = [];
	preferCache = true;
	warn = false;
	games = [];
	
	/**
	 * Create a game library.
	 * @param {string[]} enabledSources - Sources to get games from
	 * @param {boolean} preferCache - If true, when available scanning will prefer using a cache
	 * @param {boolean} warn - If true, additional warnings will be displayed
	 */
	constructor(enabledSources = [], preferCache = true, warn = false){
		this.enabledSources = enabledSources;
		this.preferCache = preferCache;
		this.warn = warn;
	}

	/**
	 * Empty the library from games
	 */
	empty(){
		this.games.length = 0;
	}

	/**
	 * Scan library's sources for games
	 */
	async scan(){
		
		// Get lutris games
		if (this.enabledSources.includes(LutrisGame.source)){
			const lutrisGames = await getLutrisGames(this.warn);
			this.games.push(...lutrisGames);
			
			// Get cemu games
			if (this.enabledSources.includes(CemuGame.source)){
				const cemuGame = lutrisGames.find(game=>game.name.toLowerCase() === "cemu");
				if (cemuGame){
					const cemuGames = await getCemuGames(cemuGame, this.preferCache, this.warn);
					this.games.push(...cemuGames);
				}
			}

		}

		// Get all other straightforward games
		let promises = []
		if (this.enabledSources.includes(SteamGame.source)){
			promises.push(getSteamGames(this.warn));
		}
		if (this.enabledSources.includes(RetroarchGame.source)){
			promises.push(getRetroarchGames(this.warn));
		}
		if (this.enabledSources.includes(YuzuGame.source)){
			promises.push(getYuzuGames(this.warn));
		}
		if (this.enabledSources.includes(DolphinGame.source)){
			promises.push(getDolphinGames(this.warn));
		}
		if (this.enabledSources.includes(CitraGame.source)){
			promises.push(getCitraGames(this.warn));
		}
		if (this.enabledSources.includes(PPSSPPGame.source)){
			promises.push(getPPSSPPGames(this.warn));
		}
		if (this.enabledSources.includes(LegendaryGame.source)){
			promises.push(getLegendaryGames(this.warn));
		}
		if (this.enabledSources.includes(HeroicGame.source)){
			promises.push(getHeroicGames(this.warn));
		}
		if (this.enabledSources.includes(DesktopEntryGame.source)){
			promises.push(getDesktopEntryGames(this.warn));
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

module.exports = Library;
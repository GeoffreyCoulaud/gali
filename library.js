const { DesktopEntrySource } = require("./sources/desktop-entries.js");
const { LegendarySource } = require("./sources/legendary.js");
const { RetroarchSource } = require("./sources/retroarch.js");
const { DolphinSource } = require("./sources/dolphin.js");
const { PPSSPPSource } = require("./sources/ppsspp.js");
const { HeroicSource } = require("./sources/heroic.js");
const { LutrisSource } = require("./sources/lutris.js");
const { SteamSource } = require("./sources/steam.js");
const { CitraSource } = require("./sources/citra.js");
const { YuzuSource } = require("./sources/yuzu.js");
const { CemuSource } = require("./sources/cemu.js");

/**
 * A representation of a game library.
 * @property {Game[]} games - An array of games in the library
 * @property {boolean} preferCache - Whether to prefer cache while scanning. Defaults to true
 * @property {boolean} warn - Whether to display additional warnings (especially during scan)
 * @property {string[]} enabledSources - Names of the sources to scan for games. Defaults to none   
 */
class Library{	

	static availableSources = [
		DesktopEntrySource.name,
		RetroarchSource.name,
		LegendarySource.name,
		DolphinSource.name,
		HeroicSource.name,
		LutrisSource.name,
		PPSSPPSource.name,
		SteamSource.name,
		CitraSource.name,
		CemuSource.name,
		YuzuSource.name,
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
		
		// TODO Maybe remove the dependency between those two ?
		// Get lutris games
		if (this.enabledSources.includes(LutrisSource.name)){
			const lutris = new LutrisSource();
			const lutrisGames = await lutris.scan(this.warn);
			this.games.push(...lutrisGames);
			
			// Get cemu games
			if (this.enabledSources.includes(CemuSource.name)){
				const cemuGame = lutrisGames.find(game=>game.name.toLowerCase() === "cemu");
				if (cemuGame){
					const cemu = new CemuSource(cemuGame, false);
					const cemuGames = await cemu.scan(this.warn);
					this.games.push(...cemuGames);
				}
			}

		}

		// Get games from straightforward sources
		const EASY_SOURCE_CLASSES = [
			DesktopEntrySource,
			RetroarchSource,
			LegendarySource,
			DolphinSource,
			PPSSPPSource,
			HeroicSource,
			SteamSource,
			CitraSource,
			YuzuSource,
		];
		let promises = []
		for (let sourceClass of EASY_SOURCE_CLASSES){
			if (this.enabledSources.includes(sourceClass.name)){
				const sourceInstance = new sourceClass();
				promises.push(sourceInstance.scan(this.warn));
			}
		} 
		let results = await Promise.all(promises);
		results = results.flat();
		this.games.push(...results);

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
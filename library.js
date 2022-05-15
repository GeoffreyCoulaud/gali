const { DesktopEntrySource } = require("./sources/scanners/DesktopEntriesSource.js");
const { LegendarySource }    = require("./sources/scanners/LegendarySource.js");
const { RetroarchSource }    = require("./sources/scanners/RetroarchSource.js");
const { DolphinSource }      = require("./sources/scanners/DolphinSource.js");
const { HeroicSource }       = require("./sources/scanners/HeroicSource.js");
const { LutrisSource }       = require("./sources/scanners/LutrisSource.js");
const { PPSSPPSource }       = require("./sources/scanners/PPSSPPSource.js");
const { CitraSource }        = require("./sources/scanners/CitraSource.js");
const { SteamSource }        = require("./sources/scanners/SteamSource.js");
const { CemuSource }         = require("./sources/scanners/CemuSource.js");
const { YuzuSource }         = require("./sources/scanners/YuzuSource.js");

/**
 * A representation of a game library.
 * @property {Game[]} games - An array of games in the library
 * @property {boolean} preferCache - Whether to prefer cache while scanning. Defaults to true
 * @property {boolean} warn - Whether to display additional warnings (especially during scan)
 * @property {string[]} enabledSources - Names of the sources to scan for games. Defaults to none
 */
class Library{

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

		this.empty();

		// TODO Find a less hacky way of scanning.

		let promises = [];
		let results = [];

		// Get lutris games
		if (this.enabledSources.includes("Lutris")){
			const lutris = new LutrisSource();
			const lutrisGames = await lutris.scan(this.warn);
			this.games.push(...lutrisGames);

			// Get cemu games
			if (this.enabledSources.includes("Cemu in Lutris")){
				const cemuGame = lutrisGames.find(game=>game.name.toLowerCase() === "cemu");
				if (cemuGame){
					const cemu = new CemuSource(cemuGame, false);
					promises.push(cemu.scan(this.warn));
				}
			}

			results = await Promise.all(promises);
			results = results.flat();
			this.games.push(...results);
		}

		// Get games from straightforward sources
		promises = [];
		const sourceMap = {
			"Citra"          : CitraSource,
			"Desktop entries": DesktopEntrySource,
			"Dolphin"        : DolphinSource,
			"Heroic"         : HeroicSource,
			"Legendary"      : LegendarySource,
			"PPSSPP"         : PPSSPPSource,
			"Retroarch"      : RetroarchSource,
			"Steam"          : SteamSource,
			"Yuzu"           : YuzuSource,
		};
		for (const key in Object.keys(sourceMap)){
			if (this.enabledSources.includes(key)){
				const klass = sourceMap[key];
				const instance = new klass();
				promises.push(instance.scan(this.warn));
			}
		}
		results = await Promise.all(promises);
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
			const a = String(gameA[criteria]).toLowerCase();
			const b = String(gameB[criteria]).toLowerCase();
			if (a < b){
				return order * -1;
			} else if (a === b){
				return 0;
			} else {
				return order * 1;
			}
		});
	}

	/**
	 * Display library's games in the console
	 */
	displayInConsole(){
		for (const game of this.games){
			const string = "● " + game.toString();
			console.log(string);
		}
	}

}

module.exports = Library;
const { DesktopEntrySource } = require("./scanners/DesktopEntrySource.js");
const { LegendarySource }    = require("./scanners/LegendarySource.js");
const { RetroarchSource }    = require("./scanners/RetroarchSource.js");
const { DolphinSource }      = require("./scanners/DolphinSource.js");
const { HeroicSource }       = require("./scanners/HeroicSource.js");
const { LutrisSource }       = require("./scanners/LutrisSource.js");
const { PPSSPPSource }       = require("./scanners/PPSSPPSource.js");
const { CitraSource }        = require("./scanners/CitraSource.js");
const { SteamSource }        = require("./scanners/SteamSource.js");
const { CemuSource }         = require("./scanners/CemuSource.js");
const { YuzuSource }         = require("./scanners/YuzuSource.js");

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
		// ? Remove dependency on games ?

		let promises = [];
		let results = [];

		// Get lutris games
		if (this.enabledSources.includes("Lutris")){
			const lutris = new LutrisSource();
			const lutrisGames = await lutris.scan(this.warn);
			this.games.push(...lutrisGames);

			// Get cemu games
			if (this.enabledSources.includes("Cemu in Lutris")){
				const cemuGame = lutrisGames.find(g=>g.gameSlug.toLowerCase() === "cemu");
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
		const sources = [
			CitraSource,
			DesktopEntrySource,
			DolphinSource,
			HeroicSource,
			LegendarySource,
			PPSSPPSource,
			RetroarchSource,
			SteamSource,
			YuzuSource,
		];
		for (const klass of sources){
			if (this.enabledSources.includes(klass.name)){
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
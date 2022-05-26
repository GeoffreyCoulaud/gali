let sources = require("./scanners/all.js");
sources = Object.values(sources);

class ClassPlusArgs{
	constructor(klass, args = []){
		this.klass = klass;
		this.args = args;
	}
}

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

		const awaiting = [];
		const scannables = [];

		// Prepare sources
		for (const source of sources){
			if (!this.enabledSources.includes(source.name)){
				continue;
			}
			if (source.gameDependency){
				awaiting.push(source);
			} else {
				scannables.push(new ClassPlusArgs(source));
			}
		}

		// Scan sources
		while (scannables.length > 0){

			// Create class instance (source)
			const [ scannable ] = scannables.splice(0, 1);
			const { klass, args } = scannable;
			const source = new klass(...args, this.preferCache);

			// Scan source
			let games = new Array();
			try {
				games = await source.scan();
			} catch (err){
				if (this.warn){
					console.warn(`Error while scanning ${klass.name} :`, err);
				}
			}
			this.games.push(...games);

			// Test if any awaiting class' dependency is met
			for (const qlass of awaiting){
				const game = games.find(game=>qlass.gameDependency.test(game));
				if (!game) continue;
				scannables.push(new ClassPlusArgs(qlass, [game]));
			}

		}

		return;

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
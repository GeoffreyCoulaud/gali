const sleep = require("../utils/sleep.js");
const Library = require("../library.js");
const { DEFAULT_PREFERENCES } = require("../utils/preferences.js");

/**
 * A class representing a known game
 * @property {string} name - The known game's exact name
 * @property {string} source - The known game's source
 */
class KnownGame{

	/**
	 * Create a known game
	 * @param {string} name - The game's name
	 * @param {string} source - The game's source
	 */
	constructor(name, source){
		this.name = name;
		this.source = source;
	}

	/**
	 * Search for the known game in a given library
	 * @param {Library} library - The game library to find the game in
	 * @returns {null|Game} - The corresponding game or null in case it's not present
	 */
	async findIn(library){
		for (const game of library.games){
			if (game.name === this.name && game.source === this.source){
				return game;
			}
		}
		return null;
	}

	toString(){
		return `${this.name} (${this.source})`;
	}

}

/**
 * Run the game start test
 */
async function testGameStart(){

	// Scan library
	const sources = DEFAULT_PREFERENCES.scan.enabledSources;
	const library = new Library(sources, true, true);
	await library.scan();
	await library.sort("name", 1);

	// Check presence of known games
	// (edit depending on your library)
	const knownGames = [
		new KnownGame("Extreme Tux Racer", "Desktop entries"),
		new KnownGame("Cemu", "Lutris"),
		/*
		new KnownGame("MARIO KART 8", "Cemu in Lutris"),
		new KnownGame("Next Up Hero", "Legendary"),
		new KnownGame("Next Up Hero", "Heroic"),
		new KnownGame("Sonic Mania", "Steam"),
		*/
	];
	const games = [];
	for (const knownGame of knownGames){
		const game = await knownGame.findIn(library);
		if (game) games.push(game);
		else console.log(`Couldn't find ${knownGame.toString()}`);
	}

	// Start, wait, kill
	const MILLIS_BEFORE_KILL = 15000;
	for (const game of games){
		console.log(`\nStarting ${game.name} (${game.source})`);
		game.processContainer.on("error", (error)=>{
			console.error(`Error emitted by process container : ${error}`);
		});
		await game.processContainer.start();
		await sleep(MILLIS_BEFORE_KILL);
		if (game.processContainer.isRunning){
			console.log(`Killing ${game.name} after ${MILLIS_BEFORE_KILL}ms`);
			game.processContainer.kill();
		} else {
			console.log("Game has already exited, not killing");
		}
	}

}
testGameStart();
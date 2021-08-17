const sleep = require("../utils/sleep.js");
const Library = require("../library.js");

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

}

/**
 * Run the game start test
 */
async function testGameStart(){

	// Scan library
	const library = new Library(Library.sources, true, true);
	await library.scan();
	await library.sort("name", 1);

	// Check presence of known games
	// (edit depending on your library)
	const knownGames = [
		new KnownGame("Cemu", "Lutris"),
		/*
		new KnownGame("Extreme Tux Racer", "Desktop entries"),
		new KnownGame("Next Up Hero", "Legendary"),
		new KnownGame("Next Up Hero", "Heroic"),
		new KnownGame("Sonic Mania", "Steam"),
		*/
	];
	const games = [];
	for (const knownGame of knownGames){
		const game = await knownGame.findIn(library);
		if (game) games.push(game);
	}

	// Start, wait, kill
	const MILLIS_BEFORE_KILL = 20000;
	for (const game of games){
		console.log(`\nStarting ${game.name} (${game.source})`);
		game.processContainer.on("error", (error)=>{
			console.error(`Error emitted by process container : ${error}`);
		});
		game.processContainer.start();
		await sleep(MILLIS_BEFORE_KILL);
		if (game.processContainer.isRunning){
			console.log(`Killing ${game.name} after ${MILLIS_BEFORE_KILL}ms`);
			game.processContainer.kill();
		} else {
			console.log("Game has already exited, not killing");
		}
	}

}

module.exports = testGameStart;
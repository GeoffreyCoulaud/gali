const { Game, StartOnlyGameProcessContainer, NoCommandError } = require("./common.js");
const { sync: commandExistsSync } = require("command-exists");
const { readFile } = require("fs/promises");
const { join: pathJoin } = require("path");
const { spawn } = require("child_process");
const { env } = require("process");

/**
 * A wrapper for legendary game process management.
 * Doesn't support stop and kill !
 * @property {string} appName - The epic games store app name, used to start the game
 */
class HeroicGameProcessContainer extends StartOnlyGameProcessContainer{
	
	/**
	 * Create a legendary game process container
	 * @param {string} appName - The epic games store app name 
	 */
	constructor(appName){
		super();
		this.appName = appName;
	}
	
	/**
	 * Start the game in a subprocess
	 */
	async start(){
		const command = "xdg-open";
		if (!commandExistsSync(command)){
			throw new NoCommandError("No xdg-open command found");
		}
		let args = [`heroic://launch/${this.appName}`];
		this.process = spawn(
			command, 
			args, 
			this.constructor.defaultSpawnOptions
		);
		this.process.unref();
		this._bindProcessEvents();
	}

}

/**
 * A class representing a Heroic launcher game
 */
class HeroicGame extends Game{

	static source = "Heroic";

	/**
	 * Create a Heroic launcher game
	 * @param {string} name - The game's displayed name
	 * @param {string} appName - The game's epic store app_name
	 * @param {boolean} isInstalled - Whether the game is installed or not
	 * @param {string} cover - A path or url to the game's cover
	 * @param {string} icon - A path or url to the game's icon
	 */
	constructor(name, appName, isInstalled, cover, icon){
		super(name, cover, icon);
		this.source = this.constructor.source;
		this.appName = appName;
		this.isInstalled = isInstalled;
		this.processContainer = new HeroicGameProcessContainer(appName);
	}

}

async function getHeroicGames(warn = false){

	// Read library.json file
	const USER_DIR = env["HOME"];
	const LIBRARY_FILE_PATH = pathJoin(USER_DIR, ".config/heroic/store/library.json");

	let library;
	try {
		const fileContents = await readFile(LIBRARY_FILE_PATH, "utf-8");
		library = JSON.parse(fileContents);
		library = library?.["library"];
	} catch (error){
		if (warn) console.warn(`Unable to read heroic library.json`);
		library = undefined;
	}

	// Build games
	let games = [];
	if (library){
		for (let entry of library){
			if (entry?.["is_game"]){
				games.push(new HeroicGame(
					entry.title, 
					entry.app_name, 
					entry.is_installed,
					entry.art_cover, 
					entry.art_square
				));
			}
		}
	}

	return games;

}

module.exports = {
	HeroicGameProcessContainer,
	getHeroicGames,
	HeroicGame,
}
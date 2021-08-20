const { Game, StartOnlyGameProcessContainer, NoCommandError, Source } = require("./common.js");
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

	/**
	 * Create a Heroic launcher game
	 * @param {string} name - The game's displayed name
	 * @param {string} appName - The game's epic store app_name
	 */
	constructor(name, appName){
		super(name);
		this.source = HeroicSource.name;
		this.processContainer = new HeroicGameProcessContainer(appName);
	}

}

/**
 * A class representing a Heroic Games Launcher source
 */
class HeroicSource extends Source{

	static name = "Heroic";
	preferCache = false;

	constructor(preferCache = false){
		super();
		this.preferCache = preferCache;
	}

	async scan(warn = false){

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
						entry.app_name
					));
				}
			}
		}
	
		return games;
	
	}

}

module.exports = {
	HeroicGameProcessContainer,
	HeroicSource,
	HeroicGame,
}
const common        = require("./common.js");
const child_process = require("child_process");
const fsp           = require("fs/promises");
const process       = require("process");

const HEROIC_SOURCE_NAME = "Heroic";

const USER_DIR = process.env["HOME"];
const LIBRARY_FILE_PATH = `${USER_DIR}/.config/heroic/store/library.json`;

/**
 * A wrapper for legendary game process management.
 * Doesn't support stop and kill !
 * @property {string} appName - The epic games store app name, used to start the game
 */
class HeroicGameProcessContainer extends common.StartOnlyGameProcessContainer{

	commandOptions = ["xdg-open"];

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
		const command = await this._selectCommand();
		const args = [`heroic://launch/${this.appName}`];
		this.process = child_process.spawn(
			command,
			args,
			this.constructor.defaultSpawnOptions
		);
		this.process.unref();
		this._bindProcessEvents();
		return;
	}

}

/**
 * A class representing a Heroic launcher game
 */
class HeroicGame extends common.Game{

	platform = "PC";
	source = HEROIC_SOURCE_NAME;

	/**
	 * Create a Heroic Games Launcher game
	 * @param {string} name - The game's displayed name
	 * @param {string} appName - The game's epic store app_name
	 */
	constructor(name, appName){
		super(name);
		this.processContainer = new HeroicGameProcessContainer(appName);
	}

}

/**
 * A class representing a Heroic Games Launcher source
 */
class HeroicSource extends common.Source{

	static name = HEROIC_SOURCE_NAME;
	preferCache = false;

	constructor(preferCache = false){
		super();
		this.preferCache = preferCache;
	}

	async scan(warn = false){

		// Read library.json file
		let library;
		try {
			const fileContents = await fsp.readFile(LIBRARY_FILE_PATH, "utf-8");
			library = JSON.parse(fileContents);
			library = library?.["library"];
		} catch (error){
			if (warn) console.warn("Unable to read heroic library.json");
			library = undefined;
		}

		// Build games
		const games = [];
		if (library){
			for (const entry of library){
				if (entry?.["is_game"]){
					const game = new HeroicGame(entry.title, entry.app_name);
					game.isInstalled = entry?.is_installed;
					games.push(game);
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
};
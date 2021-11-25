const common        = require("./common.js");
const child_process = require("child_process");
const process       = require("process");
const fsp           = require("fs/promises");

const LEGENDARY_SOURCE_NAME = "Legendary";

const USER_DIR = process.env["HOME"];
const INSTALLED_FILE_PATH = `${USER_DIR}/.config/legendary/installed.json`;

/**
 * A wrapper for legendary game process management.
 * Doesn't support stop and kill !
 * @property {string} appName - The epic games store app name, used to start the game
 */
class LegendaryGameProcessContainer extends common.StartOnlyGameProcessContainer{

	commandOptions = ["legendary"];

	/**
	 * Create a legendary game process container
	 * @param {string} appName - The epic games store app name
	 */
	constructor(appName){
		super();
		this.appName = appName;
	}

	// ! There is no way (AFAIK) to control a legendary game's life cycle from the launcher.

	/**
	 * Start the game in a subprocess
	 * @param {boolean} offline - Whether to start the game offline. Defaults to false.
	 */
	async start(offline = false){
		const command = this._selectCommand();
		const args = ["launch", this.appName];
		if (offline) args.splice(1, 0, "--offline");
		this.process = child_process.spawn(
			command,
			args,
			this.constructor.defaultSpawnOptions
		);
		this.process.unref();
		this._bindProcessEvents();
	}

}

/**
 * A class representing a legendary games launcher game
 * @property {string} appName - The game's epic games launcher app name
 * @property {LegendaryGameProcessContainer} processContainer - The game's process container
 */
class LegendaryGame extends common.Game{

	platform = "PC";
	source = LEGENDARY_SOURCE_NAME;
	isInstalled = true; // Legendary only exposes installed games

	/**
	 * Create a legendary games launcher game
	 * @param {string} appName - The game's app name
	 * @param {string} name  - The game's displayed name
	 */
	constructor(appName, name){
		super(name);
		this.appName = appName;
		this.processContainer = new LegendaryGameProcessContainer(this.appName);
	}

	/**
	 * Create a string representation of the game
	 * @returns {string} - A string representing the game
	 */
	toString(){
		return `${this.name} - ${this.source} - ${this.appName}`;
	}

}

/**
 * A class representing a Legendary Games Launcher source
 */
class LegendarySource extends common.Source{

	static name = LEGENDARY_SOURCE_NAME;
	preferCache = false;

	constructor(preferCache = false){
		super();
		this.preferCache = preferCache;
	}

	/**
	 * Get all legendary launcher games
	 * @param {boolean} warn - Whether to display additional warnings
	 * @returns {LegendaryGame[]} - An array of found games
	 * @todo support non installed games
	 */
	async scan(warn = false){

		// Read installed.json file
		let data;
		try {
			const fileContents = await fsp.readFile(INSTALLED_FILE_PATH, "utf-8");
			data = JSON.parse(fileContents);
		} catch (error){
			if (warn) console.warn(`Unable to read legendary installed.json : ${error}`);
			data = undefined;
		}

		// Build games
		const games = [];
		if (data){
			for (const key of Object.keys(data)){
				const gameData = data[key];
				const gameName = gameData?.app_name;
				const gameTitle = gameData?.title;
				if (gameName && gameTitle){
					const game = new LegendaryGame(gameData?.app_name, gameData?.title);
					games.push(game);
				}
			}
		}

		return games;
	}

}

module.exports = {
	LegendaryGameProcessContainer,
	LegendarySource,
	LegendaryGame,
};
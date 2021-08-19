const { StartOnlyGameProcessContainer, NoCommandError, Game } = require("./common.js");
const { sync: commandExistsSync } = require("command-exists");
const { join: pathJoin } = require("path");
const { readFile } = require("fs/promises");
const { spawn } = require("child_process");
const { env } = require("process");

/**
 * A wrapper for legendary game process management.
 * Doesn't support stop and kill !
 * @property {string} appName - The epic games store app name, used to start the game
 */
class LegendaryGameProcessContainer extends StartOnlyGameProcessContainer{
	/**
	 * Create a legendary game process container
	 * @param {string} appName - The epic games store app name 
	 */
	constructor(appName){
		super();
		this.appName = appName;
	}

	// ! There is no way (AFAIK) to control a legendary game's life cycle from the launcher.
	// TODO Try to launch directly from wine
	
	/**
	 * Start the game in a subprocess
	 * @param {boolean} offline - Whether to start the game offline. Defaults to false. 
	 */
	async start(offline = false){
		const legendaryCommand = "legendary";
		if (!commandExistsSync(legendaryCommand)){
			throw new NoCommandError("No legendary command found");
		}
		let args = ["launch", this.appName];
		if (offline) args.splice(1,0,"--offline");
		this.process = spawn(
			legendaryCommand, 
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
class LegendaryGame extends Game{
	
	static source = "Legendary";
	
	/**
	 * Create a legendary games launcher game
	 * @param {string} appName - The game's app name
	 * @param {string} name  - The game's displayed name
	 */
	constructor(appName, name){
		super(name);
		this.source = this.constructor.source;
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
 * Get all legendary launcher (also get heroic launcher) **installed** games
 * @param {boolean} warn - Whether to display additional warnings 
 * @returns {LegendaryGame[]} - An array of found games
 */
async function getLegendaryInstalledGames(warn = false){

	// Read installed.json file
	const USER_DIR = env["HOME"];
	const INSTALLED_FILE_PATH = pathJoin(USER_DIR, ".config/legendary/installed.json");
	
	let installed;
	try {
		const fileContents = await readFile(INSTALLED_FILE_PATH, "utf-8");
		installed = JSON.parse(fileContents);
	} catch (error){
		if (warn) console.warn(`Unable to read legendary installed.json : ${error}`);
		installed = undefined;
	}

	// Build games
	let installedGames = [];
	if (installed){
		for (let key of Object.keys(installed)){
			let gameData = installed[key];
			let game = new LegendaryGame(gameData?.app_name, gameData?.title);
			if (game.appName && game.name){
				installedGames.push(game);
			}
		}
	}

	return installedGames;
}

/**
 * Get all legendary launcher games
 * @param {boolean} warn - Whether to display additional warnings 
 * @returns {LegendaryGame[]} - An array of found games
 * @todo get also non installed games
 */
async function getLegendaryGames(warn = false){

	// ? Add support for non-installed games ?

	return getLegendaryInstalledGames(warn);

}

module.exports = {
	LegendaryGameProcessContainer,
	getLegendaryGames,
	LegendaryGame,
};
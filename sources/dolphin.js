const { EmulatedGame, GameProcessContainer, GameDir, getROMs, Source } = require("./common.js");
const { join: pathJoin, basename: pathBasename } = require("path");
const { config2js } = require("../utils/config.js");
const { readFile } = require("fs/promises");
const { spawn } = require("child_process");
const { env } = require("process");

const DOLPHIN_SOURCE_NAME = "Dolphin";

/**
 * A wrapper for dolphin game management
 * @property {string} romPath - The game's ROM path, used to invoke dolphin
 */
class DolphinGameProcessContainer extends GameProcessContainer{

	commandOptions = ["dolphin-emu"];

	/**
	 * Create a dolphin game process container.
	 * @param {string} romPath - The game's ROM path
	 */
	constructor(romPath){
		super();
		this.romPath = romPath;
	}

	/**
	 * Start the game in a subprocess
	 * @param {boolean} noUi - Whether to show dolphin's UI or only the game
	 */
	async start(noUi = false){
		const command = this._selectCommand();
		const args = ["-e", this.romPath];
		if (noUi) args.splice(0, 0, "-b");
		this.process = spawn(command, args, GameProcessContainer.defaultSpawnOptions);
		this._bindProcessEvents();
	}
}

/**
 * Class representing a dolphin game
 * @property {DolphinGameProcessContainer} processContainer - The game's process container
 */
class DolphinGame extends EmulatedGame{

	platform = "Nintendo - Wii / GameCube";
	source = DOLPHIN_SOURCE_NAME;

	/**
	 * Create a dolphin game
	 * @param {string} name - The game's displayed name
	 * @param {string} path - The game's ROM path
	 */
	constructor(name, path){
		super(name, path);
		this.processContainer = new DolphinGameProcessContainer(this.path);
	}
}

class DolphinSource extends Source{

	static name = DOLPHIN_SOURCE_NAME;
	preferCache = false;

	constructor(preferCache = false){
		super();
		this.preferCache = preferCache;
	}

	/**
	 * Get dolphin's config data
	 * @returns {config} - Dolphin's config data
	 * @private
	 */
	async _getConfig(){

		const USER_DIR = env["HOME"];
		const DOLPHIN_INSTALL_DIRS_PATH = pathJoin(USER_DIR, ".config/dolphin-emu/Dolphin.ini");
		const configFileContents = await readFile(DOLPHIN_INSTALL_DIRS_PATH, "utf-8");
		const config = config2js(configFileContents);

		// Check "General -> ISOPaths" value to be numeric
		const nDirs = parseInt(config["General"].get("ISOPaths"));
		if ( Number.isNaN(nDirs) ){
			throw new Error("Non numeric ISOPaths value in config file");
		}

		return config;

	}

	/**
	 * Get dolphin's cached games
	 * @returns {DolphinGame[]} - An array of found games
	 * @private
	 * @todo
	 */
	async _getCachedROMs(){
		// TODO Read dolphin gamelist cache
		// $HOME/.cache/dolphin-emu/gamelist.cache
	}

	/**
	 * Get dolphin's ROM dirs from its config data
	 * @param {object} config - Dolphin's config dara
	 * @returns {GameDir} - The game dirs extracted from dolphin's config
	 * @private
	 */
	async _getROMDirs(config){

		const dirs = [];

		// Get number of paths and options
		if (typeof config["General"] === "undefined") { return dirs; }
		const nDirs = parseInt(config["General"].get("ISOPaths"));
		const recursive = config["General"].get("RecursiveISOPaths").toString().toLowerCase() === "true";

		// Get paths
		for (let i = 0; i < nDirs; i++){
			const path = config["General"].get(`ISOPath${i}`);
			if (typeof path === "undefined"){ continue; }
			dirs.push(new GameDir(path, recursive));
		}

		return dirs;

	}

	/**
	 * Get dolphin ROMs from the given game dirs
	 * @param {GameDir[]} dirs - The game dirs to search ROMs into
	 * @returns {DolphinGame[]} - An array of found games
	 * @private
	 */
	async _getROMs(dirs){
		// TODO detect games console between GameCube and Wii
		const GAME_FILES_REGEX = /.+\.(c?iso|wbfs|gcm|gcz)/i;
		const gamePaths = await getROMs(dirs, GAME_FILES_REGEX);
		const games = gamePaths.map(path=>new DolphinGame(pathBasename(path), path));
		return games;
	}

	/**
	 * Get all dolphin games.
	 * @param {boolean} warn - Whether to display additional warnings
	 * @returns {DolphinGame[]} - An array of found games
	 */
	async scan(warn = false){

		// Get config
		let config;
		try {
			config = await this._getConfig();
		} catch (error) {
			if (warn) console.warn(`Unable to read dolphin config file : ${error}`);
		}

		// Get ROM dirs
		let romDirs = [];
		if (typeof config !== "undefined"){
			try {
				romDirs = await this._getROMDirs(config);
			} catch (error){
				if (warn) console.warn(`Unable to get dolphin ROM dirs : ${error}`);
			}
		}

		// Get ROM games
		let romGames = [];
		if (romDirs.length > 0){
			try {
				romGames = await this._getROMs(romDirs);
			} catch (error) {
				if (warn) console.warn(`Unable to get dolphin ROMs : ${error}`);
			}
		}

		return romGames;

	}


}

module.exports = {
	DolphinGameProcessContainer,
	DolphinSource,
	DolphinGame,
};
const config        = require("../utils/configFormats.js");
const common        = require("./common.js");
const child_process = require("child_process");
const fsp           = require("fs/promises");
const process       = require("process");
const path          = require("path");

const DOLPHIN_SOURCE_NAME = "Dolphin";

const USER_DIR = process.env["HOME"];
const DOLPHIN_INSTALL_DIRS_PATH = `${USER_DIR}/.config/dolphin-emu/Dolphin.ini`;
const GAME_FILES_REGEX = /.+\.(c?iso|wbfs|gcm|gcz)/i;

/**
 * A wrapper for dolphin game management
 * @property {string} romPath - The game's ROM path, used to invoke dolphin
 */
class DolphinGameProcessContainer extends common.GameProcessContainer{

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
		this.process = child_process.spawn(command, args, common.GameProcessContainer.defaultSpawnOptions);
		this._bindProcessEvents();
		return;
	}
}

/**
 * Class representing a dolphin game
 * @property {DolphinGameProcessContainer} processContainer - The game's process container
 */
class DolphinGame extends common.EmulatedGame{

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

class DolphinSource extends common.Source{

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

		const configFileContents = await fsp.readFile(DOLPHIN_INSTALL_DIRS_PATH, "utf-8");
		const configData = config.config2js(configFileContents);

		// Check "General -> ISOPaths" value to be numeric
		const nDirs = parseInt(configData["General"].get("ISOPaths"));
		if ( Number.isNaN(nDirs) ){
			throw new Error("Non numeric ISOPaths value in config file");
		}

		return configData;

	}

	/**
	 * Get dolphin's cached games
	 * @returns {DolphinGame[]} - An array of found games
	 * @see https://github.com/dolphin-emu/dolphin/blob/d5b917a6c2d25926c5aa057fdaf8fce5debb3182/Source/Core/UICommon/GameFile.h#L140
	 * @private
	 */
	async _getCachedROMs(){
		// TODO Read dolphin gamelist cache
		// Cache path : $HOME/.cache/dolphin-emu/gamelist.cache
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
			const dir = config["General"].get(`ISOPath${i}`);
			if (typeof dir === "undefined"){ continue; }
			dirs.push(new common.GameDir(dir, recursive));
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
		const gamePaths = await common.getROMs(dirs, GAME_FILES_REGEX);
		const games = [];
		for (const gamePath of gamePaths){
			const game = new DolphinGame(path.basename(gamePath), gamePath);
			game.isInstalled = true;
			games.push(game);
		}
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
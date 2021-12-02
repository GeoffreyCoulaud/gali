const config        = require("../utils/configFormats.js");
const emulation     = require("./emulation.js");
const common        = require("./common.js");
const child_process = require("child_process");
const fsp           = require("fs/promises");
const process       = require("process");
const path          = require("path");

const CITRA_SOURCE_NAME = "Citra";

const USER_DIR = process.env["HOME"];
const CITRA_CONFIG_PATH = `${USER_DIR}/.config/citra-emu/qt-config.ini`;
const GAME_FILES_REGEX = /.+\.(3ds|cci)/i;

/**
 * A wrapper for citra game process management
 * @property {string} romPath - The game's ROM path, used to invoke citra
 */
class CitraGameProcessContainer extends common.GameProcessContainer{

	commandOptions = ["citra", "citra-qt"];

	/**
	 * Create a citra game process container
	 * @param {string} romPath - The game's ROM path
	 */
	constructor(romPath){
		super();
		this.romPath = romPath;
	}

	/**
	 * Start the game in a subprocess
	 */
	async start(){
		const command = await this._selectCommand();
		this.process = child_process.spawn(
			command,
			[this.romPath],
			common.GameProcessContainer.defaultSpawnOptions
		);
		this._bindProcessEvents();
		return;
	}

}

/**
 * Represents a Citra (Nintendo 3DS emulator) game
 * @property {string} name - The game's displayed name
 * @property {string} path - The game's ROM path
 * @property {CitraGameProcessContainer} processContainer - The game's process container
 */
class CitraGame extends emulation.EmulationGame{

	platform = "Nintendo - 3DS";
	source = CITRA_SOURCE_NAME;

	/**
	 * Creat a citra game
	 * @param {string} name - The game's displayed name
	 * @param {string} path - The game's ROM path
	 */
	constructor(name, path){
		super(name, path);
		this.processContainer = new CitraGameProcessContainer(this.path);
	}

}

/**
 * A class representing a Citra source
 */
class CitraSource extends emulation.EmulationSource{

	static name = CITRA_SOURCE_NAME;
	preferCache = false;

	constructor(preferCache = false){
		super();
		this.preferCache = preferCache;
	}

	/**
	 * Get the citra config data from $HOME/.config/citra-emu/qt-config.ini
	 * Found in $HOME/.config/citra-emu/qt-config.ini
	 * Validates the config data before returning it.
	 * @returns {object} - An object containing citra's config
	 * @private
	 */
	async _getConfig(){

		const configFileContents = await fsp.readFile(CITRA_CONFIG_PATH, "utf-8");
		const configData = config.config2js(configFileContents);

		// Check "UI > Paths\Gamedirs\size" value in config to be numeric
		const nDirs = parseInt(configData["UI"].get("Paths\\gamedirs\\size"));
		if (Number.isNaN(nDirs)){
			throw Error("Non numeric Paths\\gamedirs\\size value in config file");
		}

		return configData;
	}

	/**
	 * Get citra's game dirs from its config data
	 * @param {object} configData - Citra's config data
	 * @returns {GameDir[]} - The game dirs extracted from citra's config
	 * @private
	 */
	async _getROMDirs(configData){

		const dirs = [];

		// Get number of paths
		if (typeof configData["UI"] === "undefined") { return dirs; }
		const nDirs = parseInt(configData["UI"].get("Paths\\gamedirs\\size"));

		// Get paths
		for (let i = 1; i <= nDirs; i++){
			const recursive = String(configData["UI"].get(`Paths\\gamedirs\\${i}\\deep_scan`)).toLowerCase() === "true";
			const path       = configData["UI"].get(`Paths\\gamedirs\\${i}\\path`);
			if (typeof path === "undefined"){ continue; }
			dirs.push(new common.GameDir(path, recursive));
		}

		return dirs;

	}

	/**
	 * Get citra ROM games from given game directories
	 * @param {GameDir[]} dirs - The directories in which to search for ROMs
	 * @returns {CitraGame[]} - An array of found games
	 * @private
	 */
	async _getROMGames(dirs){

		const gamePaths = await this._getROMs(dirs, GAME_FILES_REGEX);
		const games = [];
		for (const gamePath of gamePaths){
			const game = new CitraGame(path.basename(gamePath), gamePath);
			game.isInstalled = true;
			games.push(game);
		}
		return games;

	}

	/**
	 * Get citra installed games.
	 * @throws {NotImplementedError} - This is not yet supported
	 * @param {object} config - Citra's config data
	 * @private
	 * @todo
	 */
	async _getInstalledGames(configData){

		// TODO implement scanning for installed games
		throw new common.NotImplementedError("Scanning for installed citra games is not implemented");

	}

	/**
	 * Get all citra games
	 * @param {boolean} warn - Whether to display additional warnings
	 * @returns {CitraGame[]} - An array of found games
	 */
	async scan(warn = false){

		// Get config
		let configData;
		try {
			configData = await this._getConfig();
		} catch (error) {
			if (warn) console.warn(`Unable to read citra config file : ${error}`);
		}

		// Get ROM dirs
		let romDirs = [];
		if (typeof configData !== "undefined"){
			try {
				romDirs = await this._getROMDirs(configData);
			} catch (error){
				if (warn) console.warn(`Unable to get citra ROM dirs : ${error}`);
			}
		}

		// Get ROM games
		let romGames = [];
		if (romDirs.length > 0){
			try {
				romGames = await this._getROMGames(romDirs);
			} catch (error) {
				if (warn) console.warn(`Unable to get citra ROMs : ${error}`);
			}
		}

		// Get installed games
		let installedGames = [];
		if (typeof configData !== "undefined"){
			try {
				installedGames = await this._getInstalledGames(configData);
			} catch (error){
				if (warn) console.warn(`Unable to get citra installed games : ${error}`);
			}
		}

		return [...romGames, ...installedGames];

	}

}

module.exports = {
	CitraGameProcessContainer,
	CitraSource,
	CitraGame,
};
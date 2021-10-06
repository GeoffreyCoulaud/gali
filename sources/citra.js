const { GameDir, getROMs, EmulatedGame, GameProcessContainer, Source, NotImplementedError } = require("./common.js");
const { join: pathJoin, basename: pathBasename } = require("path");
const { config2js } = require("../utils/config.js");
const { readFile } = require("fs/promises");
const { spawn } = require("child_process");
const { env } = require("process");

/**
 * A wrapper for citra game process management
 * @property {string} romPath - The game's ROM path, used to invoke citra
 */
class CitraGameProcessContainer extends GameProcessContainer{

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
		const command = this._selectCommand();
		this.process = spawn(
			command,
			[this.romPath],
			GameProcessContainer.defaultSpawnOptions
		);
		this._bindProcessEvents();
	}

}

/**
 * Represents a Citra (Nintendo 3DS emulator) game
 * @property {string} name - The game's displayed name
 * @property {string} path - The game's ROM path
 * @property {CitraGameProcessContainer} processContainer - The game's process container
 */
class CitraGame extends EmulatedGame{

	platform = "Nintendo - 3DS";
	source = CitraSource.name;

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
class CitraSource extends Source{

	static name = "Citra";
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

		const USER_DIR = env["HOME"];
		const CITRA_CONFIG_PATH = pathJoin(USER_DIR, ".config/citra-emu/qt-config.ini");
		const configFileContents = await readFile(CITRA_CONFIG_PATH, "utf-8");
		const config = config2js(configFileContents);

		// Check "UI > Paths\Gamedirs\size" value in config to be numeric
		const nDirs = parseInt(config["UI"].get("Paths\\gamedirs\\size"));
		if (Number.isNaN(nDirs)){
			throw Error("Non numeric Paths\\gamedirs\\size value in config file");
		}

		return config;
	}

	/**
	 * Get citra's game dirs from its config data
	 * @param {object} config - Citra's config data
	 * @returns {GameDir[]} - The game dirs extracted from citra's config
	 * @private
	 */
	async _getROMDirs(config){

		const dirs = [];

		// Get number of paths
		if (typeof config["UI"] === "undefined") { return dirs; }
		const nDirs = parseInt(config["UI"].get("Paths\\gamedirs\\size"));

		// Get paths
		for (let i = 1; i <= nDirs; i++){
			const recursive = String(config["UI"].get(`Paths\\gamedirs\\${i}\\deep_scan`)).toLowerCase() === "true";
			const path       = config["UI"].get(`Paths\\gamedirs\\${i}\\path`);
			if (typeof path === "undefined"){ continue; }
			dirs.push(new GameDir(path, recursive));
		}

		return dirs;

	}

	/**
	 * Get citra ROM games from given game directories
	 * @param {GameDir[]} dirs - The directories in which to search for ROMs
	 * @returns {CitraGame[]} - An array of found games
	 * @private
	 */
	async _getROMs(dirs){

		const GAME_FILES_REGEX = /.+\.(3ds|cci)/i;
		const gamePaths = await getROMs(dirs, GAME_FILES_REGEX);
		const games = gamePaths.map(path=>new CitraGame(pathBasename(path), path));
		return games;

	}

	/**
	 * Get citra installed games.
	 * @throws {NotImplementedError} - This is not yet supported
	 * @param {object} config - Citra's config data
	 * @private
	 * @todo
	 */
	async _getInstalledGames(config){

		// TODO implement scanning for installed games
		throw new NotImplementedError("Scanning for installed citra games is not implemented");

	}

	/**
	 * Get all citra games
	 * @param {boolean} warn - Whether to display additional warnings
	 * @returns {CitraGame[]} - An array of found games
	 */
	async scan(warn = false){

		// Get config
		let config;
		try {
			config = await this._getConfig();
		} catch (error) {
			if (warn) console.warn(`Unable to read citra config file : ${error}`);
		}

		// Get ROM dirs
		let romDirs = [];
		if (typeof config !== "undefined"){
			try {
				romDirs = await this._getROMDirs(config);
			} catch (error){
				if (warn) console.warn(`Unable to get citra ROM dirs : ${error}`);
			}
		}

		// Get ROM games
		let romGames = [];
		if (romDirs.length > 0){
			try {
				romGames = await this._getROMs(romDirs);
			} catch (error) {
				if (warn) console.warn(`Unable to get citra ROMs : ${error}`);
			}
		}

		// Get installed games
		let installedGames = [];
		if (typeof config !== "undefined"){
			try {
				installedGames = await this._getInstalledGames(config);
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
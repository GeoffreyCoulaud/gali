const config        = require("../utils/configFormats.js");
const common        = require("./common.js");
const child_process = require("child_process");
const fsp           = require("fs/promises");
const process       = require("process");
const path          = require("path");

const YUZU_SOURCE_NAME = "Yuzu";

const USER_DIR = process.env["HOME"];
const YUZU_CONFIG_PATH = `${USER_DIR}/.config/yuzu/qt-config.ini`;
const GAME_FILES_REGEX = /.+\.(xci|nsp)/i;

/**
 * A wrapper for yuzu game process management
 * @property {string} romPath - The game's ROM path, used to invoke yuzu
 */
class YuzuGameProcessContainer extends common.GameProcessContainer{

	commandOptions = ["yuzu"];

	/**
	 * Create a yuzu game process container
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
		this.process = child_process.spawn(
			command,
			[this.romPath],
			common.GameProcessContainer.defaultSpawnOptions
		);
		this._bindProcessEvents();
		return;
	}

	/**
	 * Overwrite the inherited stop method to equal the inherited kill method.
	 * This is done because yuzu seems to trap SIGTERM and needs to get SIGKILL to terminate.
	 * @returns {boolean} - True on success, else false
	 */
	stop(){
		// For yuzu, SIGTERM doesn't work, use SIGKILL instead.
		return this.kill();
	}
}

/**
 * A class representing a yuzu game
 * @property {YuzuGameProcessContainer} processContainer - The game's process container
 */
class YuzuGame extends common.EmulatedGame{

	platform = "Nintendo - Switch";
	source = YUZU_SOURCE_NAME;

	/**
	 * Create a yuzu game
	 * @param {string} name - The game's displayed name
	 * @param {string} path - The game's ROM path
	 */
	constructor(name, path){
		super(name, path);
		this.processContainer = new YuzuGameProcessContainer(this.path);
	}

}

class YuzuSource extends common.Source{

	static name = YUZU_SOURCE_NAME;
	preferCache = false;

	constructor(preferCache = false){
		super();
		this.preferCache = preferCache;
	}

	/**
	 * Get yuzu's config data from its config file.
	 * Found in $HOME/.config/yuzu/qt-config.ini
	 * Validates the data before returning it.
	 * @returns {object} - Yuzu's config data
	 * @private
	 */
	async _getConfig(){

		const configFileContents = await fsp.readFile(YUZU_CONFIG_PATH, "utf-8");
		const configData = config.config2js(configFileContents);

		// Check "UI > Paths\Gamedirs\size" value in config to be numeric
		const nDirs = parseInt(configData["UI"].get("Paths\\gamedirs\\size"));
		if (Number.isNaN(nDirs)){
			throw Error("Non numeric Paths\\gamedirs\\size value in config file");
		}

		return configData;

	}

	/**
	 * Get yuzu's game dirs from its config data
	 * @param {object} configData - Yuzu's config data
	 * @returns {GameDir[]} - The game dirs extracted from yuzu's config
	 * @private
	 */
	async _getROMDirs(configData){

		// Read config
		const dirs = [];

		// Get number of paths
		if (typeof configData["UI"] === "undefined") { return dirs; }
		const nDirs = parseInt(configData["UI"].get("Paths\\gamedirs\\size"));

		// Get paths
		if (Number.isNaN(nDirs)){ return dirs; }
		for (let i = 1; i <= nDirs; i++){
			const recursive = String(configData["UI"].get(`Paths\\gamedirs\\${i}\\deep_scan`)).toLowerCase() === "true";
			const dirPath = configData["UI"].get(`Paths\\gamedirs\\${i}\\path`);
			if (typeof dirPath === "undefined"){ continue; }
			dirs.push(new common.GameDir(dirPath, recursive));
		}

		return dirs;

	}

	/**
	 * Get yuzu games from given game directories
	 * @param {GameDir[]} dirs - The dirs to scan for ROMs
	 * @returns {YuzuGame[]} - An array of found games
	 * @private
	 */
	async _getROMs(dirs){

		const roms = await common.getROMs(dirs, GAME_FILES_REGEX);
		const games = [];
		for (const rom of roms){
			const game = new YuzuGame(path.basename(rom), rom);
			game.isInstalled = true;
			games.push(game);
		}
		return games;

	}

	/**
	 * Get yuzu installed games.
	 * @throws {NotImplementedError} - Will throw a "Not implemented" error on every case, this is not yet supported
	 * @param {object} configData - Yuzu's config data
	 * @private
	 * @todo
	 */
	async _getInstalledGames(configData){

		// TODO implement scanning for installed games
		throw new common.NotImplementedError("Scanning for installed yuzu games is not implemented");

	}

	/**
	 * Get all yuzu games
	 * @param {boolean} warn - Whether to display additional warnings
	 * @returns {YuzuGame[]} - An array of found games
	 */
	async scan(warn = false){

		// Get config
		let configData;
		try {
			configData = await this._getConfig();
		} catch (error) {
			if (warn) console.warn(`Unable to read yuzu config file : ${error}`);
		}

		// Get ROM dirs
		let romDirs = [];
		if (typeof configData !== "undefined"){
			try {
				romDirs = await this._getROMDirs(configData);
			} catch (error){
				if (warn) console.warn(`Unable to get yuzu ROM dirs : ${error}`);
			}
		}

		// Get ROM games
		let romGames = [];
		if (romDirs.length > 0){
			try {
				romGames = await this._getROMs(romDirs);
			} catch (error) {
				if (warn) console.warn(`Unable to get yuzu ROMs : ${error}`);
			}
		}

		// Get installed games
		let installedGames = [];
		if (typeof configData !== "undefined"){
			try {
				installedGames = await this._getInstalledGames(configData);
			} catch (error){
				if (warn) console.warn(`Unable to get yuzu installed games : ${error}`);
			}
		}

		return [...romGames, ...installedGames];

	}

}

module.exports = {
	YuzuGameProcessContainer,
	YuzuSource,
	YuzuGame,
};
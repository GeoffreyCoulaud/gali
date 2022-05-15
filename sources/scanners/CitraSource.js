const config = require("../utils/configFormats.js");
const { EmulationSource } = require("./EmulationSource.js");
const common = require("./common.js");
const fsp = require("fs/promises");
const path = require("path");
const { CitraGame } = require("../games/CitraGame.js");

const USER_DIR = process.env["HOME"];
const CITRA_CONFIG_PATH = `${USER_DIR}/.config/citra-emu/qt-config.ini`;
const GAME_FILES_REGEX = /.+\.(3ds|cci)/i;

/**
 * A class representing a Citra source
 */
class CitraSource extends EmulationSource {

	preferCache = false;

	constructor(preferCache = false) {
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
	async _getConfig() {

		const configFileContents = await fsp.readFile(CITRA_CONFIG_PATH, "utf-8");
		const configData = config.config2js(configFileContents);

		// Check "UI > Paths\Gamedirs\size" value in config to be numeric
		const nDirs = parseInt(configData["UI"]["Paths\\gamedirs\\size"]);
		if (Number.isNaN(nDirs)) {
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
	async _getROMDirs(configData) {

		const dirs = [];

		// Get number of paths
		if (typeof configData["UI"] === "undefined") { return dirs; }
		const nDirs = parseInt(configData["UI"]["Paths\\gamedirs\\size"]);

		// Get paths
		for (let i = 1; i <= nDirs; i++) {
			const recursive = String(configData["UI"][`Paths\\gamedirs\\${i}\\deep_scan`]).toLowerCase() === "true";
			const path = configData["UI"][`Paths\\gamedirs\\${i}\\path`];
			if (typeof path === "undefined") { continue; }
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
	async _getROMGames(dirs) {

		const gamePaths = await this._getROMs(dirs, GAME_FILES_REGEX);
		const games = [];
		for (const gamePath of gamePaths) {
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
	async _getInstalledGames(configData) {

		// TODO implement scanning for installed games
		throw new common.NotImplementedError("Scanning for installed citra games is not implemented");

	}

	/**
	 * Get all citra games
	 * @param {boolean} warn - Whether to display additional warnings
	 * @returns {CitraGame[]} - An array of found games
	 */
	async scan(warn = false) {

		// Get config
		let configData;
		try {
			configData = await this._getConfig();
		} catch (error) {
			if (warn){
				console.warn(`Unable to read citra config file : ${error}`);
			}
		}

		// Get ROM dirs
		let romDirs = [];
		if (typeof configData !== "undefined") {
			try {
				romDirs = await this._getROMDirs(configData);
			} catch (error) {
				if (warn){
					console.warn(`Unable to get citra ROM dirs : ${error}`);
				}
			}
		}

		// Get ROM games
		let romGames = [];
		if (romDirs.length > 0) {
			try {
				romGames = await this._getROMGames(romDirs);
			} catch (error) {
				if (warn){
					console.warn(`Unable to get citra ROMs : ${error}`);
				}
			}
		}

		// Get installed games
		let installedGames = [];
		if (typeof configData !== "undefined") {
			try {
				installedGames = await this._getInstalledGames(configData);
			} catch (error) {
				if (warn) {
					console.warn(`Unable to get citra installed games : ${error}`);
				}
			}
		}

		return [...romGames, ...installedGames];

	}

}

module.exports = {
	CitraSource
};
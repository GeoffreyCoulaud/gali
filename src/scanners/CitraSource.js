const fsp = require("fs/promises");
const path = require("path");

const GameDir = require("./GameDir.js");
const config = require("../utils/configFormats.js");

const EmulationSource = require("./EmulationSource.js");
const CitraGame = require("../games/CitraGame.js");

const USER_DIR = process.env["HOME"];

class CitraSource extends EmulationSource {

	static name = "Citra";
	static gameClass = CitraGame;

	preferCache = false;

	romRegex = /.+\.(3ds|cci)/i;
	configPath = `${USER_DIR}/.config/citra-emu/qt-config.ini`;

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

		const configFileContents = await fsp.readFile(this.configPath, "utf-8");
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
	async _getROMGames(dirs) {

		const gamePaths = await this._getROMs(dirs, this.romRegex);
		const games = [];
		for (const gamePath of gamePaths) {
			const game = new this.constructor.gameClass(path.basename(gamePath), gamePath);
			game.isInstalled = true;
			games.push(game);
		}
		return games;

	}

	/**
	 * Get citra installed games.
	 * @param {object} config - Citra's config data
	 * @private
	 * @todo
	 */
	async _getInstalledGames(configData) {

		// TODO implement scanning for installed games
		console.warn("Scanning for installed citra games is not implemented");
		return new Array();

	}

	/**
	 * Get all citra games
	 * @returns {CitraGame[]} - An array of found games
	 */
	async scan() {
		const configData = await this._getConfig();
		const romDirs = await this._getROMDirs(configData);
		const romGames = await this._getROMGames(romDirs);
		const installedGames = await this._getInstalledGames(configData);
		return [...romGames, ...installedGames];
	}

}

module.exports = CitraSource;
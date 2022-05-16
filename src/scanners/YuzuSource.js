const fsp = require("fs/promises");
const path = require("path");

const { NotImplementedError } = require("../NotImplementedError.js");
const { GameDir } = require("./GameDir.js");
const config = require("../utils/configFormats.js");

const { SwitchEmulationSource } = require("./SwitchEmulationSource.js");
const { YuzuGame } = require("../games/YuzuGame");

const USER_DIR = process.env["HOME"];

/**
 * A class representing a Yuzu source
 */
class YuzuSource extends SwitchEmulationSource {

	static name = "Yuzu";
	static gameClass = YuzuGame;

	preferCache = false;

	romRegex = /.+\.(xci|nsp)/i;
	configPath = `${USER_DIR}/.config/yuzu/qt-config.ini`;

	constructor(preferCache = false) {
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
	 * Get yuzu's game dirs from its config data
	 * @param {object} configData - Yuzu's config data
	 * @returns {GameDir[]} - The game dirs extracted from yuzu's config
	 * @private
	 */
	async _getROMDirs(configData) {

		// Read config
		const dirs = [];

		// Get number of paths
		if (typeof configData["UI"] === "undefined") { return dirs; }
		const nDirs = parseInt(configData["UI"]["Paths\\gamedirs\\size"]);

		// Get paths
		if (Number.isNaN(nDirs)) { return dirs; }
		for (let i = 1; i <= nDirs; i++) {
			const recursive = String(configData["UI"][`Paths\\gamedirs\\${i}\\deep_scan`]).toLowerCase() === "true";
			const dirPath = configData["UI"][`Paths\\gamedirs\\${i}\\path`];
			if (typeof dirPath === "undefined") { continue; }
			dirs.push(new GameDir(dirPath, recursive));
		}

		return dirs;

	}

	/**
	 * Get yuzu games from given game directories
	 * @param {GameDir[]} dirs - The dirs to scan for ROMs
	 * @returns {YuzuGame[]} - An array of found games
	 * @private
	 */
	async _getROMGames(dirs) {

		const roms = await this._getROMs(dirs, this.romRegex);
		const games = [];
		for (const rom of roms) {
			const game = new this.constructor.gameClass(path.basename(rom), rom);
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
	async _getInstalledGames(configData) {

		// TODO implement scanning for installed games
		throw new NotImplementedError("Scanning for installed yuzu games is not implemented");

	}

	/**
	 * Get all yuzu games
	 * @param {boolean} warn - Whether to display additional warnings
	 * @returns {YuzuGame[]} - An array of found games
	 */
	async scan(warn = false) {

		// Get config
		let configData;
		try {
			configData = await this._getConfig();
		} catch (error) {
			if (warn){
				console.warn(`Unable to read yuzu config file : ${error}`);
			}
		}

		// Get ROM dirs
		let romDirs = [];
		if (typeof configData !== "undefined") {
			try {
				romDirs = await this._getROMDirs(configData);
			} catch (error) {
				if (warn){
					console.warn(`Unable to get yuzu ROM dirs : ${error}`);
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
					console.warn(`Unable to get yuzu ROMs : ${error}`);
				}
			}
		}

		// Get installed games
		let installedGames = [];
		if (typeof configData !== "undefined") {
			try {
				installedGames = await this._getInstalledGames(configData);
			} catch (error) {
				if (warn){
					console.warn(`Unable to get yuzu installed games : ${error}`);
				}
			}
		}

		return [...romGames, ...installedGames];

	}

}

module.exports = {
	YuzuSource
};
const fsp = require("fs/promises");
const path = require("path");

const { GameDir } = require("./GameDir.js");
const config = require("../utils/configFormats.js");

const { EmulationSource } = require("./EmulationSource.js");
const { DolphinGame } = require("../games/DolphinGame");

const USER_DIR = process.env["HOME"];

class DolphinSource extends EmulationSource {
	
	static name = "Dolphin";
	static gameClass = DolphinGame;
	
	preferCache = false;

	configPath = `${USER_DIR}/.config/dolphin-emu/Dolphin.ini`;
	romRegex = /.+\.(c?iso|wbfs|gcm|gcz)/i;

	constructor(preferCache = false) {
		super();
		this.preferCache = preferCache;
	}

	/**
	 * Get dolphin's config data
	 * @returns {config} - Dolphin's config data
	 * @private
	 */
	async _getConfig() {

		const configFileContents = await fsp.readFile(this.configPath, "utf-8");
		const configData = config.config2js(configFileContents);

		// Check "General -> ISOPaths" value to be numeric
		const nDirs = parseInt(configData["General"]["ISOPaths"]);
		if (Number.isNaN(nDirs)) {
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
	async _getCachedROMs() {
		// TODO Read dolphin gamelist cache
		// Cache path : $HOME/.cache/dolphin-emu/gamelist.cache
	}

	/**
	 * Get dolphin's ROM dirs from its config data
	 * @param {object} config - Dolphin's config dara
	 * @returns {GameDir} - The game dirs extracted from dolphin's config
	 * @private
	 */
	async _getROMDirs(config) {

		const dirs = [];

		// Get number of paths and options
		if (typeof config["General"] === "undefined") { return dirs; }
		const nDirs = parseInt(config["General"]["ISOPaths"]);
		const recursive = config["General"]["RecursiveISOPaths"].toString().toLowerCase() === "true";

		// Get paths
		for (let i = 0; i < nDirs; i++) {
			const dir = config["General"][`ISOPath${i}`];
			if (typeof dir === "undefined") { continue; }
			dirs.push(new GameDir(dir, recursive));
		}

		return dirs;

	}

	/**
	 * Get dolphin ROMs from the given game dirs
	 * @param {GameDir[]} dirs - The game dirs to search ROMs into
	 * @returns {DolphinGame[]} - An array of found games
	 * @private
	 */
	async _getROMGames(dirs) {
		// TODO detect games console between GameCube and Wii
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
	 * Get all dolphin games.
	 * @param {boolean} warn - Whether to display additional warnings
	 * @returns {DolphinGame[]} - An array of found games
	 */
	async scan(warn = false) {

		// Get config
		let config;
		try {
			config = await this._getConfig();
		} catch (error) {
			if (warn){
				console.warn(`Unable to read dolphin config file : ${error}`);
			}
		}

		// Get ROM dirs
		let romDirs = [];
		if (typeof config !== "undefined") {
			try {
				romDirs = await this._getROMDirs(config);
			} catch (error) {
				if (warn){
					console.warn(`Unable to get dolphin ROM dirs : ${error}`);
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
					console.warn(`Unable to get dolphin ROMs : ${error}`);
				}
			}
		}

		return romGames;

	}

}

module.exports = {
	DolphinSource
};
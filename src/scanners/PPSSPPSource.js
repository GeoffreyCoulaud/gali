const fsp = require("fs/promises");
const path = require("path");

const { GameDir } = require("./GameDir.js");
const config = require("../utils/configFormats.js");

const { EmulationSource } = require("./EmulationSource.js");
const { PPSSPPGame } = require("../games/PPSSPPGame");

const USER_DIR = process.env["HOME"];
const PPSSPP_INSTALL_DIRS_PATH = `${USER_DIR}/.config/ppsspp/PSP/SYSTEM/ppsspp.ini`;
const GAME_FILES_REGEX = /.+\.(iso|cso)/i;


class PPSSPPSource extends EmulationSource {

	static name = "PPSSPP";
	preferCache = false;

	constructor() {
		super();
	}

	/**
	 * Get ppsspp config data from it config file in $HOME/.config/ppsspp/PSP/SYSTEM/ppsspp.ini
	 * @returns {object} - The config data
	 */
	async _getConfig() {

		const configFileContents = await fsp.readFile(PPSSPP_INSTALL_DIRS_PATH, "utf-8");
		const configData = config.config2js(configFileContents);
		return configData;

	}

	/**
	 * Get ppsspp ROM dirs from its config data (pinned paths)
	 * @param {object} configData - ppsspp config data
	 * @returns {GameDir[]} - The game dirs extracted from ppsspp's config data
	 * @private
	 */
	async _getROMDirs(configData) {

		const dirs = [];
		const pathsObj = configData?.["PinnedPaths"];
		if (!pathsObj) {
			return dirs;
		}
		const paths = Object.values(pathsObj);
		for (const dirPath of paths) {
			dirs.push(new GameDir(dirPath, false));
		}

		return dirs;

	}

	/**
	 * Get all ppsspp ROMs in the specified game dirs
	 * @param {GameDir[]} dirs - The game dirs to scan for ROMs
	 * @returns {PPSSPPGame[]} - An array of found games
	 * @private
	 */
	async _getROMGames(dirs) {

		const gamePaths = await this._getROMs(dirs, GAME_FILES_REGEX);
		const games = [];
		for (const gamePath of gamePaths) {
			const game = new PPSSPPGame(path.basename(gamePath), gamePath);
			game.isInstalled = true;
			games.push(game);
		}

		return games;

	}

	/**
	 * Get all ppsspp games
	 * @param {boolean} warn - Whether to display additional warnings.
	 * @returns {PPSSPPGame[]} - An array of found games
	 */
	async scan(warn = false) {

		// Get config
		let configData;
		try {
			configData = await this._getConfig();
		} catch (error) {
			if (warn){
				console.warn(`Unable to get PPSSPP config : ${error}`);
			}
		}

		// Get rom dirs
		let romDirs = [];
		if (typeof configData !== "undefined") {
			try {
				romDirs = await this._getROMDirs(configData);
			} catch (error) {
				if (warn){
					console.warn(`Unable to get PPSSPP rom dirs : ${error}`);
				}
			}
		}

		// Get roms
		let romGames = [];
		if (romDirs.length > 0) {
			try {
				romGames = await this._getROMGames(romDirs);
			} catch (error) {
				if (warn){
					console.warn(`Unable to get PPSSPP roms : ${error}`);
				}
			}
		}

		return romGames;

	}

}

module.exports = {
	PPSSPPSource
};
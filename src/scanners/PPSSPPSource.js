const fsp = require("fs/promises");
const path = require("path");

const GameDir = require("./GameDir.js");
const config = require("../utils/configFormats.js");

const EmulationSource = require("./EmulationSource.js");
const PPSSPPGame = require("../games/PPSSPPGame");

const USER_DIR = process.env["HOME"];

class PPSSPPSource extends EmulationSource {

	static name = "PPSSPP";
	static gameClass = PPSSPPGame;

	preferCache = false;

	configPath = `${USER_DIR}/.config/ppsspp/PSP/SYSTEM/ppsspp.ini`;
	romRegex = /.+\.(iso|cso)/i;

	constructor() {
		super();
	}

	/**
	 * Get ppsspp config data from it config file in $HOME/.config/ppsspp/PSP/SYSTEM/ppsspp.ini
	 * @returns {object} - The config data
	 */
	async _getConfig() {

		const configFileContents = await fsp.readFile(this.configPath, "utf-8");
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
	 * Get all ppsspp games
	 * @returns {PPSSPPGame[]} - An array of found games
	 */
	async scan() {
		const config = await this._getConfig();
		const romDirs = await this._getROMDirs(config);
		const romGames = await this._getROMGames(romDirs);
		return romGames;
	}

}

module.exports = PPSSPPSource;
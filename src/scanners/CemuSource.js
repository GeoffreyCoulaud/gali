const fsp = require("fs/promises");
const YAML = require("yaml");
const path = require("path");
const fs = require("fs");

const GameDir = require("./GameDir.js");
const convertPath = require("../utils/convertPathPlatform.js");
const config = require("../utils/configFormats.js");

const WiiUEmulationSource = require("./WiiUEmulationSource.js");
const CemuGame = require("../games/CemuGame.js");

// TODO Remove dependency on lutris game
class CemuSource extends WiiUEmulationSource {

	static name = "Cemu in Lutris";
	static gameClass = CemuGame;

	preferCache = false;

	cemuLutrisGame = undefined;
	romRegex = /.+\.(wud|wux|wad|iso|rpx|elf)/i;

	constructor(cemuLutrisGame, preferCache = false) {
		super();
		this.cemuLutrisGame = cemuLutrisGame;
		this.preferCache = preferCache;
	}

	/**
	 * Get cemu's config data
	 * @param {string} cemuExePath - The path to cemu's executable
	 * @returns {object} - Cemu's config data
	 * @private
	 */
	async _getConfig(cemuExePath) {
		const configDir = path.dirname(cemuExePath);
		const configFilePath = `${configDir}/settings.xml`;
		const configFileContents = await fsp.readFile(configFilePath, "utf-8");
		const configData = await config.xml2js(configFileContents);
		return configData;
	}

	/**
	 * Get cemu's cached games from its config data
	 * @param {object} configData - Cemu's config data
	 * @param {string} prefix - Cemu's wine prefix absolute path
	 * @returns {CemuGame[]} - An array of found cached games
	 * @private
	 */
	async _getCachedROMs(configData, prefix) {

		// Search into config for cached games
		const games = [];

		const gameCache = configData?.content?.GameCache?.Entry;
		if (typeof gameCache === "undefined") {
			return;
		}
		for (const item of gameCache) {

			// Get game name
			const customName = item?.custom_name?.[0];
			const defaultName = item?.name?.[0];
			let name = undefined;
			for (let candidate of [customName, defaultName]) {
				if (typeof candidate !== "string") {
					continue;
				}
				candidate = candidate.trim();
				if (candidate.length > 0) {
					name = candidate;
					break;
				}
			}
			if (!name) {
				continue;
			}

			// Get game path
			const winePath = item?.path;
			if (!winePath) {
				continue;
			}

			// Build game
			const linuxPath = convertPath.wineToLinux(winePath, prefix);
			const isInstalled = fs.existsSync(linuxPath);
			const game = new this.constructor.gameClass(name, linuxPath);
			game.isInstalled = isInstalled;

			// Get more info
			if (isInstalled && path.extname(linuxPath) === ".rpx") {
				this._getRPXGameProps(game);
			}

			games.push(game);
		}

		return games;

	}

	/**
	 * Get cemu's game dirs from its config data
	 * @param {object} configData - Cemu's config data
	 * @param {string} prefix - Cemu's wine prefix absolute path
	 * @returns {GameDir[]} - The game dirs extracted from cemu's config
	 * @private
	 */
	async _getROMDirs(configData, prefix) {

		// Search into config for ROM dirs
		//const wPaths = configData?.content?.GamePaths?.[0]?.Entry;
		const wPaths = [];
		const entries = configData?.content?.GamePaths?.Entry;
		if (!entries) {
			return [];
		}
		if (Array.isArray(entries)) {
			wPaths.push(...entries);
		} else {
			wPaths.push(entries);
		}
		const lPaths = wPaths.map(wPath=>convertPath.wineToLinux(wPath, prefix));
		const gameDirs = lPaths.map(lPath=>new GameDir(lPath, true));
		return gameDirs;

	}

	/**
	 * Get cemu ROM games from given game directories
	 * @param {GameDir[]} dirs - The game dirs to scan for ROMs
	 * @param {boolean} warn - Whether to display additional warnings
	 * @returns {CemuGame[]} - An array of found games
	 * @private
	 */
	async _getROMGames(dirs, warn = false) {

		// Scan cemu dirs
		const gameRomPaths = await this._getROMs(dirs, this.romRegex, warn);

		// Convert found paths into cemu games
		const romGamesPromises = gameRomPaths.map(async (romPath)=>{

			// Get base info
			const basename = path.basename(romPath);
			const game = new this.constructor.gameClass(basename, romPath);
			game.isInstalled = true;

			// Precise game info
			const extname = path.extname(romPath).toLowerCase();
			if (extname === ".rpx") {
				await this._getRPXGameProps(game);
			}

			return game;
		});

		const romGames = await Promise.all(romGamesPromises);
		return romGames;
	}

	/**
	 * Get all cemu games
	 * @param {boolean} warn - Whether to display additional warnings
	 * @returns {CemuGame[]} - An array of found games
	 */
	async scan(warn = false) {

		// Read lutris config for cemu (to get cemu's exe path)
		const USER_DIR = process.env["HOME"];
		const lutrisConfigPath = path.join(USER_DIR, ".config/lutris/games", `${this.cemuLutrisGame.configPath}.yml`);
		let cemuExePath, cemuPrefixPath;
		try {
			const lutrisConfigContents = await fsp.readFile(lutrisConfigPath, "utf-8");
			const parsedLutrisConfig = YAML.parse(lutrisConfigContents);
			cemuExePath = parsedLutrisConfig.game.exe;
			cemuPrefixPath = parsedLutrisConfig.game.prefix;
		} catch (error) {
			if (warn){
				console.warn(`Unable to read lutris's game config file for cemu : ${error}`);
			}
		}

		// Read cemu's config
		let configData;
		if (typeof cemuExePath !== "undefined") {
			try {
				configData = await this._getConfig(cemuExePath);
			} catch (error) {
				if (warn){
					console.warn(`Unable to read cemu config file : ${error}`);
				}
			}
		}

		// If (scan) : scan cemu's game paths for games and ignore cemu's game cache
		// Else      : trust cemu's game cache
		let romGames = [];
		if (typeof configData !== "undefined" && typeof cemuPrefixPath !== "undefined") {

			if (!this.preferCache) {

				// Get cemu's ROM dirs
				let romDirs = [];
				try {
					romDirs = await this._getROMDirs(configData, cemuPrefixPath);
				} catch (error) {
					if (warn){
						console.warn(`Unable to get cemu ROM dirs : ${error}`);
					}
				}

				// Scan ROMDirs for ROMs
				if (romDirs.length > 0) {
					try {
						romGames = await this._getROMGames(romDirs, warn);
					} catch (error) {
						if (warn){
							console.warn(`Unable to get cemu ROMs : ${error}`);
						}
					}
				}

			} else {

				// Get cemu's cached ROM games
				try {
					romGames = await this._getCachedROMs(configData, cemuPrefixPath);
				} catch (error) {
					if (warn){
						console.warn(`Unable to get cemu cached ROMs : ${error}`);
					}
				}

			}
		}

		return romGames;

	}

}

module.exports = CemuSource;
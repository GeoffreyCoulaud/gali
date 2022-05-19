const fsp = require("fs/promises");
const YAML = require("yaml");
const path = require("path");
const fs = require("fs");

const GameDir = require("./GameDir.js");
const convertPath = require("../utils/convertPathPlatform.js");
const config = require("../utils/configFormats.js");

const { Dependency, PropCriteria, EqCriteria } = require("./Dependency.js");
const LutrisGame = require("../games/LutrisGame.js");

const WiiUEmulationSource = require("./WiiUEmulationSource.js");
const CemuGame = require("../games/CemuGame.js");

const USER_DIR = process.env["HOME"];

class CemuLutrisSource extends WiiUEmulationSource {

	static name = "Cemu (Lutris)";
	static gameClass = CemuGame;
	static gameDependency = new Dependency(
		LutrisGame,
		new PropCriteria("gameSlug", new EqCriteria("cemu"))
	)

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
	async _getCachedROMGames(configData, prefix) {

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
	async _getROMGames(dirs) {

		// Scan cemu dirs
		const gameRomPaths = await this._getROMs(dirs, this.romRegex);

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
	async scan() {

		// Read lutris config for cemu.
		// This is to get cemu's exe path.
		const lConfigPath = path.join(USER_DIR, ".config/lutris/games", `${this.cemuLutrisGame.configPath}.yml`);
		let lConfig = await fsp.readFile(lConfigPath, "utf-8");
		lConfig = YAML.parse(lConfig);
		const { cemuExePath, cemuPrefixPath } = lConfig.game;

		// Scan for games
		const configData = await this._getConfig(cemuExePath);
		let games;
		if (this.preferCache) {
			games = await this._getCachedROMGames(configData, cemuPrefixPath);
		} else {
			const romDirs = await this._getROMDirs(configData, cemuPrefixPath);
			games = await this._getROMGames(romDirs);
		}
		return games;

	}

}

module.exports = CemuLutrisSource;
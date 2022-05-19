const fsp = require("fs/promises");
const YAML = require("yaml");
const path = require("path");
const fs = require("fs");

const GameDir = require("./GameDir.js");
const convertPath = require("../utils/convertPathPlatform.js");
const { xml2js } = require("../utils/configFormats.js");

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

	cemuGame = undefined;
	preferCache = false;

	romRegex = /.+\.(wud|wux|wad|iso|rpx|elf)/i;

	constructor(cemuGame, preferCache = false) {
		super();
		this.cemuGame = cemuGame;
		this.preferCache = preferCache;
	}

	/**
	 * Get cemu's config data
	 * @param {string} exe - Absolute path to cemu's executable
	 * @returns {object} - Cemu's config data
	 * @private
	 */
	async _getConfig(exe) {
		const dir = path.dirname(exe);
		const _path = `${dir}/settings.xml`;
		let config = await fsp.readFile(_path, "utf-8");
		config = await xml2js(config);
		return config;
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
	 * @returns {CemuGame[]} - An array of found games
	 */
	async scan() {

		
		// Read lutris config for cemu.
		// This is to get cemu's exe path.
		const lConfigPath = `${USER_DIR}/.config/lutris/games/${this.cemuGame.configPath}.yml`;
		let lConfig = await fsp.readFile(lConfigPath, "utf-8");
		lConfig = YAML.parse(lConfig);
		const { exe, prefix } = lConfig.game;
		
		// Get cemu config
		let exePath = exe;
		if (exePath.startsWith("/")) exePath = exe;
		else                         exePath = `${prefix}/${exe}`;
		const config = await this._getConfig(exePath);

		// Scan for games
		let games = new Array();
		if (this.preferCache) {
			games = await this._getCachedROMGames(config, prefix);
		} else {
			const dirs = await this._getROMDirs(config, prefix);
			games = await this._getROMGames(dirs);
		}
		return games;

	}

}

module.exports = CemuLutrisSource;
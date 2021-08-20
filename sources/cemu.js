const { dirname: pathDirname, join: pathJoin, basename: pathBasename, resolve: pathResolve, extname: pathExtname } = require("path");
const { EmulatedGame, getROMs, GameProcessContainer, Source } = require("./common.js");
const { linuxToWine, wineToLinux } = require("../utils/convertPathPlatform.js");
const { getUserLocalePreference } = require("../utils/locale.js");
const { readFile, writeFile } = require("fs/promises");
const { Parser: XMLParser } = require("xml2js");
const { LutrisSource, LutrisGameProcessContainer } = require("./lutris.js");
const { GameDir } = require("./common.js");
const { spawn } = require("child_process");
const { env } = require("process");
const YAML = require("yaml");

/**
 * A wrapper for cemu game process management
 */
class CemuGameProcessContainer extends GameProcessContainer{

	/**
	 * Create a cemu game process container
	 * @param {string} name - The game's displayed name
	 * @param {string} path - A wine path to the game file
	 */
	constructor(name, path){
		super();
		this.name = name;
		this.path = path;
	}

	/**
	 * Get a start shell script for a cemu game
	 * @param {string} name - The game's name
	 * @param {string} path - The game's ROM path
	 * @param {string} cemuGameSlug - The lutris game slug for cemu
	 * @param {string} scriptBaseName - Name (with extension) for the output script file 
	 * @returns {string} - An absolute path to the script
	 */
	static async getStartScript(name, path, cemuGameSlug = "cemu", scriptBaseName = ""){

		// Create the base lutris start script for cemu
		if (!scriptBaseName) scriptBaseName = `lutris-${cemuGameSlug}-${name}.sh`;
		const scriptPath = await LutrisGameProcessContainer.getStartScript(cemuGameSlug, scriptBaseName);

		// Add the game path argument
		const fileContents = await readFile(scriptPath, "utf-8");
		let newFileContents = fileContents.trimEnd();
		newFileContents += ` --game "${path}"`;
		await writeFile(scriptPath, newFileContents, "utf-8");

		return scriptPath;

	}

	/**
	 * Start the game in a sub process.
	 * @param {string} cemuGameSlug - Optional, a specific lutris game slug for cemu.
	 */
	async start(cemuGameSlug = "cemu"){
		const scriptPath = await this.constructor.getStartScript(this.name, this.path, cemuGameSlug);
		this.process = spawn(
			"sh",
			[scriptPath],
			this.constructor.defaultSpawnOptions
		);
		this._bindProcessEvents();

	}

}

/**
 * A class representing a cemu (in lutris) game
 */
class CemuGame extends EmulatedGame{

	platform = "Nintendo - Wii U";
	source = CemuSource.name;

	constructor(name, path){
		super(name, path, CemuSource.name);
		this.processContainer = new CemuGameProcessContainer(this.name, this.path);
	}

	/**
	 * Create a string representation of the game
	 * @returns {string} - A string representing the game
	 */
	 toString(){
		return `${this.name} - ${this.source}`;
	}

}

/**
 * A class representing a Cemu source
 */
class CemuSource extends Source{
	
	static name = "Cemu in Lutris";
	cemuLutrisGame = undefined;
	preferCache = false;

	constructor(cemuLutrisGame, preferCache = false){
		super();
		this.cemuLutrisGame = cemuLutrisGame;
		this.preferCache = preferCache;
	}

	/**
	 * Get a game's name from its rpx ROM path
	 * @param {string} linuxGamePath - A linux path to a rpx Wii U game
	 * @returns {string} - The localized (if available) game name
	 * @todo generalize for all rpx metadata
	 */
	async getRPXGameName(linuxGamePath){

		// Read meta.xml
		let meta;
		try {
			const gameDir = pathDirname(linuxGamePath);
			const metaPath = pathResolve(pathJoin(gameDir, "..", "meta", "meta.xml"));
			const metaFileContents = await readFile(metaPath, "utf-8");
			const parser = new XMLParser();
			meta = await parser.parseStringPromise(metaFileContents);
		} catch (error){
			return name;
		}

		// Get user locale for game name
		const preferredLangs = await getUserLocalePreference(true);

		// Get longname lang key from available lang options
		const longnameLangOptions = Object.keys(meta?.menu).filter(key=>key.startsWith("longname_")).map(key=>key.replace("longname_", ""));
		let longnameKey;
		for (const lang of preferredLangs){
			if (longnameLangOptions.includes(lang)){
				longnameKey = `longname_${lang}`;
				break;
			}
		}

		// Get longname in config
		let longname = meta?.menu?.[longnameKey]?.[0]?.["_"];
		longname = longname.replaceAll("\n", " - ");

		return longname;

	}

	/**
	 * Get cemu's config data
	 * @param {string} cemuExePath - The path to cemu's executable
	 * @returns {object} - Cemu's config data
	 * @private
	 */
	async _getConfig(cemuExePath){

		const configDir = pathDirname(cemuExePath);
		const configFilePath = pathJoin(configDir, "settings.xml");
		const configFileContents = await readFile(configFilePath, "utf-8");
		const parser = new XMLParser();
		const config = await parser.parseStringPromise(configFileContents);
		return config;

	}

	/**
	 * Get cemu's cached games from its config data
	 * @param {object} config - Cemu's config data
	 * @returns {CemuGame[]} - An array of found cached games
	 * @private
	 */
	async _getCachedROMs(config){

		// Search into config for cached games
		const games = [];

		const gameCache = config?.content?.GameCache?.[0]?.Entry;
		if (typeof gameCache !== "undefined"){
			for (const game of gameCache){
				const customName = game?.custom_name?.[0];
				const defaultName = game?.name?.[0];
				const path = game?.path?.[0];
				let name;
				for (let candidate of [customName, defaultName]){
					if (typeof candidate !== "string"){ continue; }
					candidate = candidate.trim();
					if (candidate.length > 0){
						name = candidate;
						break;
					}
				}
				if (
					typeof name !== "undefined" &&
					typeof path !== "undefined"
				){
					games.push(new CemuGame(name, path));
				}
			}
		}

		return games;

	}

	/**
	 * Get cemu's game dirs from its config data
	 * @param {object} config - Cemu's config data
	 * @returns {GameDir[]} - The game dirs extracted from cemu's config
	 * @private
	 */
	async _getROMDirs(config){

		// Search into config for ROM dirs
		const wineGamePaths = config?.content?.GamePaths?.[0]?.Entry;

		// Convert wine paths into linux paths
		const linuxGamePaths = wineGamePaths.map(winePath=>wineToLinux(winePath));

		// Convert paths into gameDirs
		const gameDirs = linuxGamePaths.map(path=>new GameDir(path, true));
		return gameDirs;

	}

	/**
	 * Get cemu ROM games from given game directories
	 * @param {GameDir[]} dirs - The game dirs to scan for ROMs
	 * @param {boolean} warn - Whether to display additional warnings
	 * @returns {CemuGame[]} - An array of found games
	 * @private
	 */
	async _getROMs(dirs, warn = false){

		// Scan cemu dirs
		const GAME_FILES_REGEX = /.+\.(wud|wux|wad|iso|rpx|elf)/i;
		const gameRomPaths = await getROMs(dirs, GAME_FILES_REGEX, warn);

		// Convert found paths into cemu games
		const romGamesPromises = gameRomPaths.map(async linuxPath=>{
			// Get base info
			const winePath = linuxToWine(linuxPath);

			// Try to get game real name
			const basename = pathBasename(linuxPath);
			const extname = pathExtname(linuxPath).toLowerCase();
			let name = basename;
			if (extname === ".rpx"){
				const gameName = await this.getRPXGameName(linuxPath);
				if (typeof gameName !== "undefined"){
					name = gameName;
				}
			}

			// Build game
			return new CemuGame(name, winePath);
		});
		const romGames = await Promise.all(romGamesPromises);

		return romGames;

	}

	/**
	 * Get all cemu games
	 * @param {boolean} warn - Whether to display additional warnings
	 * @returns {CemuGame[]} - An array of found games
	 */
	async scan(warn = false){

		// Read lutris config for cemu (to get cemu's exe path)
		const USER_DIR = env["HOME"];
		const lutrisConfigPath = pathJoin(USER_DIR, ".config", "lutris", "games", `${this.cemuLutrisGame.configPath}.yml`);
		let cemuExePath;
		try {
			const lutrisConfigContents = await readFile(lutrisConfigPath, "utf-8");
			const parsedLutrisConfig = YAML.parse(lutrisConfigContents);
			cemuExePath = parsedLutrisConfig.game.exe;
		} catch (error) {
			if (warn) console.warn(`Unable to read lutris's game config file for cemu : ${error}`);
		}

		// Read cemu's config
		let config;
		if (typeof cemuExePath !== "undefined"){
			try {
				config = await this._getConfig(cemuExePath);
			} catch (error){
				if (warn) console.warn(`Unable to read cemu config file : ${error}`);
			}
		}

		// If (scan) : scan cemu's game paths for games and ignore cemu's game cache
		// Else      : trust cemu's game cache
		let romGames = [];
		if (typeof config !== "undefined"){

			if (!this.preferCache){

				// Get cemu's ROM dirs
				let romDirs;
				try {
					romDirs = await this._getROMDirs(config);
				} catch (error){
					if (warn) console.warn(`Unable to get cemu ROM dirs : ${error}`);
				}

				// Scan ROMDirs for ROMs
				if (romDirs.length > 0){
					try {
						romGames = await this._getROMs(romDirs, warn);
					} catch (error){
						if (warn) console.warn(`Unable to get cemu ROMs : ${error}`);
					}
				}

			} else {

				// Get cemu's cached ROM games
				try {
					romGames = await this._getCachedROMs(config);
				} catch (error){
					if (warn) console.warn(`Unable to get cemu cached ROMs : ${error}`);
				}

			}
		}

		return romGames;

	}

}

module.exports = {
	CemuGameProcessContainer,
	CemuSource,
	CemuGame,
};
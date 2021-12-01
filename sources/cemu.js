const convertPath   = require("../utils/convertPathPlatform.js");
const config        = require("../utils/configFormats.js");
const locale        = require("../utils/locale.js");
const common        = require("./common.js");
const lutris        = require("./lutris.js");
const child_process = require("child_process");
const fsp           = require("fs/promises");
const process       = require("process");
const YAML          = require("yaml");
const path          = require("path");
const fs            = require("fs");

const CEMU_SOURCE_NAME = "Cemu in Lutris";
const GAME_FILES_REGEX = /.+\.(wud|wux|wad|iso|rpx|elf)/i;

/**
 * Sanitize a string to be used in a filename
 * @param {string} str - The string to sanitize
 * @returns {string} - A string suitable for safe and clean filenames
 */
function sanitizeStringFilename(str){
	return String(str).toLowerCase().replaceAll(/[^a-z0-9_-]/g, "-");
}

/**
 * A wrapper for cemu game process management
 */
class CemuGameProcessContainer extends common.GameProcessContainer{

	commandOptions = ["sh", "zsh", "bash"];

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
		if (!scriptBaseName){
			const safeSlug = sanitizeStringFilename(cemuGameSlug);
			const safeName = sanitizeStringFilename(name);
			scriptBaseName = `lutris-${safeSlug}-${safeName}.sh`;
		}
		const scriptPath = await lutris.LutrisGameProcessContainer.getStartScript(cemuGameSlug, scriptBaseName);

		// Add the game path argument
		const winePath = convertPath.linuxToWine(path);
		const fileContents = await fsp.readFile(scriptPath, "utf-8");
		let newFileContents = fileContents.trimEnd();
		newFileContents += ` --game "${winePath}"`;
		await fsp.writeFile(scriptPath, newFileContents, "utf-8");

		return scriptPath;

	}

	/**
	 * Start the game in a sub process.
	 * @param {string} cemuGameSlug - Optional, a specific lutris game slug for cemu.
	 */
	async start(cemuGameSlug = "cemu"){
		const command = await this._selectCommand();
		const scriptPath = await this.constructor.getStartScript(this.name, this.path, cemuGameSlug);
		this.process = child_process.spawn(
			command,
			[scriptPath],
			this.constructor.defaultSpawnOptions
		);
		this._bindProcessEvents();
	}

}

/**
 * A class representing a cemu (in lutris) game
 */
class CemuGame extends common.EmulatedGame{

	platform = "Nintendo - Wii U";
	source = CEMU_SOURCE_NAME;

	constructor(name, path){
		super(name, path);
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
class CemuSource extends common.Source{

	static name = CEMU_SOURCE_NAME;
	cemuLutrisGame = undefined;
	preferCache = false;

	constructor(cemuLutrisGame, preferCache = false){
		super();
		this.cemuLutrisGame = cemuLutrisGame;
		this.preferCache = preferCache;
	}

	// --------------------------- RPX Roms methods ----------------------------

	/**
	 * Get a RPX game's meta.xml data
	 * @param {CemuGame} game - A game to get metadata from
	 * @returns {object|undefined} - The game's metadata
	 * @private
	 */
	async _getRPXGameMetadata(game){
		const filePath = path.resolve(`${game.path}/../../meta/meta.xml`);
		const fileContents = await fsp.readFile(filePath, "utf-8");
		const metadata = await config.xml2js(fileContents);
		return metadata;
	}

	/**
	 * Add a better name to a game
	 * @param {CemuGame} game - The game to add a longname to
	 * @param {object} metadata - The game's metadata
	 * @param {string[]} langs - An array of preferred language codes
	 * @private
	 */
	_getRPXGameLongname(game, metadata, langs){

		// Get longname lang key from available lang options
		const keys = Object.entries(metadata.menu)
			.filter(([key, value])=>key.startsWith("longname_") && value)
			.map(([key, value])=>key.replace("longname_", ""));

		// Select a longname according to user locale
		let longnameKey;
		for (const lang of langs){
			if (keys.includes(lang)){
				longnameKey = `longname_${lang}`;
				break;
			}
		}
		if (!longnameKey){
			return;
		}

		// Get longname in config
		let longname = metadata.menu[longnameKey];
		longname = config.xmlDecodeSpecialChars(longname);
		longname = longname.replaceAll("\n", " - ");
		game.name = longname;
	}

	/**
	 * Add images to a game
	 * @param {CemuGame} game - The game to add images to
	 * @private
	 */
	_getRPXGameImages(game){
		const gameMetaDir = path.resolve(`${game.path}/../../meta`);
		const images = {
			coverImage: `${gameMetaDir}/bootTvTex.tga`,
			iconImage: `${gameMetaDir}/iconTex.tga`,
		};
		for (const [key, value] of Object.entries(images)){
			const imageExists = fs.existsSync(value);
			if (imageExists){
				game[key] = value;
			}
		}
	}

	/**
	 * Optional step, Precise RPX game properties
	 * This will add a better name, iconImage and coverImage.
	 * @param {CemuGame} game - The game to add metadata to
	 * @private
	 */
	async _getRPXGameProps(game){
		const preferredLangs = locale.getUserLocalePreference(true);
		const metadata = await this._getRPXGameMetadata(game);
		this._getRPXGameLongname(game, metadata, preferredLangs);
		this._getRPXGameImages(game);
	}

	// --------------------------- General scanning ----------------------------

	/**
	 * Get cemu's config data
	 * @param {string} cemuExePath - The path to cemu's executable
	 * @returns {object} - Cemu's config data
	 * @private
	 */
	async _getConfig(cemuExePath){
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
	async _getCachedROMs(configData, prefix){

		// Search into config for cached games
		const games = [];

		const gameCache = configData?.content?.GameCache?.Entry;
		if (typeof gameCache === "undefined"){
			return;
		}
		for (const item of gameCache){

			// Get game name
			const customName = item?.custom_name?.[0];
			const defaultName = item?.name?.[0];
			let name = undefined;
			for (let candidate of [customName, defaultName]){
				if (typeof candidate !== "string"){
					continue;
				}
				candidate = candidate.trim();
				if (candidate.length > 0){
					name = candidate;
					break;
				}
			}
			if (!name){
				continue;
			}

			// Get game path
			const winePath = item?.path;
			if (!winePath){
				continue;
			}

			// Build game
			const linuxPath = convertPath.wineToLinux(winePath, prefix);
			const isInstalled = fs.existsSync(linuxPath);
			const game = new CemuGame(name, linuxPath);
			game.isInstalled = isInstalled;

			// Get more info
			if (isInstalled && path.extname(linuxPath) === ".rpx"){
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
	async _getROMDirs(configData, prefix){

		// Search into config for ROM dirs
		//const wPaths = configData?.content?.GamePaths?.[0]?.Entry;
		const wPaths = [];
		const entries = configData?.content?.GamePaths?.Entry;
		if (!entries){
			return [];
		}
		if (Array.isArray(entries)){
			wPaths.push(...entries);
		} else {
			wPaths.push(entries);
		}
		const lPaths = wPaths.map(wPath=>convertPath.wineToLinux(wPath, prefix));
		const gameDirs = lPaths.map(lPath=>new common.GameDir(lPath, true));
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
		const gameRomPaths = await common.getROMs(dirs, GAME_FILES_REGEX, warn);

		// Convert found paths into cemu games
		const romGamesPromises = gameRomPaths.map(async romPath=>{

			// Get base info
			const basename = path.basename(romPath);
			const game = new CemuGame(basename, romPath);
			game.isInstalled = true;

			// Precise game info
			const extname = path.extname(romPath).toLowerCase();
			if (extname === ".rpx"){
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
	async scan(warn = false){

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
			if (warn) console.warn(`Unable to read lutris's game config file for cemu : ${error}`);
		}

		// Read cemu's config
		let configData;
		if (typeof cemuExePath !== "undefined"){
			try {
				configData = await this._getConfig(cemuExePath);
			} catch (error){
				if (warn) console.warn(`Unable to read cemu config file : ${error}`);
			}
		}

		// If (scan) : scan cemu's game paths for games and ignore cemu's game cache
		// Else      : trust cemu's game cache
		let romGames = [];
		if (typeof configData !== "undefined" && typeof cemuPrefixPath !== "undefined"){

			if (!this.preferCache){

				// Get cemu's ROM dirs
				let romDirs = [];
				try {
					romDirs = await this._getROMDirs(configData, cemuPrefixPath);
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
					romGames = await this._getCachedROMs(configData, cemuPrefixPath);
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
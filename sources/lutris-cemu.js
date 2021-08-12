const { dirname: pathDirname, join: pathJoin, basename: pathBasename, resolve: pathResolve } = require("path");
const { linuxToWine, wineToLinux } = require("../utils/convertPathPlatform.js");
const { getUserLocalePreference } = require("../utils/locale.js");
const { EmulatedGame, getROMs } = require("./common.js");
const { Parser: XMLParser } = require("xml2js");
const { readFile } = require("fs/promises");
const { GameDir } = require("./common.js");
const { env } = require("process");
const YAML = require("yaml");

// TODO implement game process container

/**
 * A class representing a cemu (in lutris) game
 */
class CemuGame extends EmulatedGame{
	constructor(name, path){
		super(name, path, "Cemu in Lutris", "Nintendo - Wii U");
	}
}

/**
 * Get a game's name from its rpx ROM path
 * @param {string} linuxGamePath - A linux path to a rpx Wii U game
 * @returns {string} - The localized (if available) game name
 * @todo generalize for all rpx metadata
 */
async function getRPXGameName(linuxGamePath){

	let name;

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
	for (let lang of preferredLangs){
		if (longnameLangOptions.includes(lang)){
			longnameKey = `longname_${lang}`;
			break;
		}
	}
	
	// Get longname in config
	let longname = meta?.menu?.[longnameKey]?.[0]?.["_"];
	longname = longname.replaceAll("\n", " - ");
	name = longname;

	return name;

}

/**
 * Get cemu's config data
 * @param {string} cemuExePath - The path to cemu's executable
 * @returns {object} - Cemu's config data
 */
async function getCemuConfig(cemuExePath){

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
 */
async function getCemuCachedROMs(config){

	// Search into config for cached games
	let games = [];

	const gameCache = config?.content?.GameCache?.[0]?.Entry;
	if (typeof gameCache !== "undefined"){
		for (let game of gameCache){
			let customName = game?.custom_name?.[0];
			let defaultName = game?.name?.[0];
			let path = game?.path?.[0];
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
 */
async function getCemuROMDirs(config){

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
 */
async function getCemuROMs(dirs, warn = false){

	// Scan cemu dirs
	const GAME_FILES_REGEX = /.+\.(wud|wux|wad|iso|rpx|elf)/i;
	const gameRomPaths = await getROMs(dirs, GAME_FILES_REGEX, warn);

	// Convert found paths into cemu games
	let romGamesPromises = gameRomPaths.map(async linuxPath=>{
		// Get base info
		const winePath = linuxToWine(linuxPath);
		
		// Try to get game real name
		const basename = pathBasename(linuxPath);
		let name = basename;
		if (basename.endsWith("rpx")){
			const gameName = await getRPXGameName(linuxPath);
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
 * @param {LutrisGame} cemuLutrisGame - A reference to cemu in lutris
 * @param {boolean} preferCache - Whether to find games from cache of to scan. Defaults to false.
 * @param {boolean} warn - Whether to display additional warnings
 * @returns {CemuGame[]} - An array of found games
 */
async function getCemuGames(cemuLutrisGame, preferCache = false, warn = false){

	// Read lutris config for cemu (to get cemu's exe path)
	const USER_DIR = env["HOME"];
	const lutrisConfigPath = pathJoin(USER_DIR, ".config", "lutris", "games", `${cemuLutrisGame.configPath}.yml`);
	let cemuExePath; 
	try {
		let lutrisConfigContents = await readFile(lutrisConfigPath, "utf-8");
		let parsedLutrisConfig = YAML.parse(lutrisConfigContents);
		cemuExePath = parsedLutrisConfig.game.exe;
	} catch (error) {
		if (warn) console.warn(`Unable to read lutris's game config file for cemu : ${error}`);
	}

	// Read cemu's config
	let config;
	if (typeof cemuExePath !== "undefined"){
		try {
			config = await getCemuConfig(cemuExePath);
		} catch (error){
			if (warn) console.warn(`Unable to read cemu config file : ${error}`);
		}
	}

	// If (scan) : scan cemu's game paths for games and ignore cemu's game cache
	// Else      : trust cemu's game cache
	let romGames = [];
	if (typeof config !== "undefined"){
		
		if (!preferCache){
			
			// Get cemu's ROM dirs
			let romDirs;
			try {
				romDirs = await getCemuROMDirs(config);
			} catch (error){
				if (warn) console.warn(`Unable to get cemu ROM dirs : ${error}`);
			}

			// Scan ROMDirs for ROMs
			if (romDirs.length > 0){
				try {
					romGames = await getCemuROMs(romDirs, warn);
				} catch (error){
					if (warn) console.warn(`Unable to get cemu ROMs : ${error}`);
				}
			}

		} else {

			// Get cemu's cached ROM games
			try {
				romGames = await getCemuCachedROMs(config);
			} catch (error){
				if (warn) console.warn(`Unable to get cemu cached ROMs : ${error}`);
			}

		}
	}

	return romGames;

}

module.exports = {
	getCemuGames,
	CemuGame,
};
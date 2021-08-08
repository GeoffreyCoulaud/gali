import { dirname as pathDirname, join as pathJoin, basename as pathBasename, resolve as pathResolve } from "path";
import { EmulatedGame, getROMs } from "./common.js";
import { Parser as XMLParser } from "xml2js";
import { GameDir } from "./common.js";
import { promises as fsp } from "fs";
import { osLocale } from "os-locale";
import { env } from "process";
import YAML from "yaml";

/**
 * A class representing a cemu (in lutris) game
 */
export class CemuGame extends EmulatedGame{
	constructor(name, path){
		super(name, path, "Cemu in Lutris", "Nintendo - Wii U");
	}
}

/**
 * Convert an absolute (Z:\) wine path into a linux path.
 * Changes "\" into "/" and the "Z:\" into "/" (fs root).
 * @param {string} winePath - An absolute wine path (windows style)
 * @returns {string} - The same path converted into a linux path
 */
function winePathToLinux(winePath){

	if (typeof winePath !== "string"){
		throw new TypeError("path must be a string");
	}
	if (!winePath.startsWith("Z:\\")){
		throw new Error("path must be in the Z: drive");
	}

	let linuxPath = winePath.replace("Z:\\", "/");
	linuxPath = linuxPath.replaceAll("\\", "/");
	return linuxPath;

}

/**
 * Convert an absolute linux path into a wine path. 
 * Changes "/" into "\" and the (root fs) "/"  into "Z:\".
 * @param {string} linuxPath - An absolute linux path
 * @returns {string} - The same path converted into a wine path
 */
function linuxPathToWine(linuxPath){

	if (typeof linuxPath !== "string"){
		throw new TypeError("path must be a string");
	}
	if (!linuxPath.startsWith("/")){
		throw new Error("path must be absolute");
	}

	let winePath = linuxPath.replace("/", "Z:\\");
	winePath = winePath.replaceAll("/", "\\");
	return winePath;

}

/**
 * Get a game's name from its rpx ROM path
 * @param {string} linuxGamePath - A linux path to a rpx Wii U game
 * @returns {string} - The localized (if available) game name
 */
async function getRPXGameName(linuxGamePath){

	let name;

	// Read meta.xml
	let meta;
	try {
		const gameDir = pathDirname(linuxGamePath);
		const metaPath = pathResolve(pathJoin(gameDir, "..", "meta", "meta.xml"));
		const metaFileContents = await fsp.readFile(metaPath, "utf-8");
		const parser = new XMLParser();
		meta = await parser.parseStringPromise(metaFileContents);
	} catch (error){		
		return name;
	}
	
	// Get user locale for game name
	let preferredLangs = ["en", "ja"]; // Prevalence : system > english > japanese
	let userLang;
	try {
		userLang = (new Intl.locale(await osLocale())).language;
	} catch (error){}
	if (typeof userLang !== "undefined"){
		preferredLangs.splice(0, 0, userLang);
	}

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
	const configFileContents = await fsp.readFile(configFilePath, "utf-8");
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
	// TODO Find a way to not rely on Z: path
	const linuxGamePaths = wineGamePaths.map(winePath=>winePathToLinux(winePath)); 
	
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
		const winePath = linuxPathToWine(linuxPath);
		
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
export async function getCemuGames(cemuLutrisGame, preferCache = false, warn = false){

	// Read lutris config for cemu (to get cemu's exe path)
	const USER_DIR = env["HOME"];
	const lutrisConfigPath = pathJoin(USER_DIR, ".config", "lutris", "games", `${cemuLutrisGame.configPath}.yml`);
	let cemuExePath; 
	try {
		let lutrisConfigContents = await fsp.readFile(lutrisConfigPath, "utf-8");
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
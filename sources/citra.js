import { join as pathJoin, basename as pathBasename } from "path";
import { getROMs, EmulatedGame, GameProcessContainer } from "./common.js";
import config2js from "../utils/config2js.js";
import { GameDir } from "./common.js";
import { spawn } from "child_process";
import { promises as fsp } from "fs"
import { env } from "process";

/**
 * A wrapper for citra game process management
 * @property {string} romPath - The game's ROM path, used to invoke citra
 */
class CitraGameProcessContainer extends GameProcessContainer{
	/**
	 * Create a citra game process container
	 * @param {string} romPath - The game's ROM path
	 */
	constructor(romPath){
		super();
		this.romPath = romPath;
	}

	/**
	 * Start the game in a subprocess
	 * @todo Support "citra" and "citra-qt" commands
	 */
	start(){
		const citraCommand = "citra-qt"; // ? Could support "citra"
		this.process = spawn(citraCommand, [this.romPath], GameProcessContainer.defaultSpawnOptions);
		this._bindProcessEvents();
	}
}

/**
 * Represents a Citra (Nintendo 3DS emulator) game
 * @property {string} name - The game's displayed name
 * @property {string} path - The game's ROM path 
 * @property {CitraGameProcessContainer} processContainer - The game's process container
 */
export class CitraGame extends EmulatedGame{
	/**
	 * Creat a citra game
	 * @param {string} name - The game's displayed name 
	 * @param {string} path - The game's ROM path 
	 */
	constructor(name, path){
		super(name, path, "Citra", "Nintendo - 3DS");
		this.processContainer = new CitraGameProcessContainer(this.path);
	}
}

/**
 * Get the citra config data from $HOME/.config/citra-emu/qt-config.ini
 * Found in $HOME/.config/citra-emu/qt-config.ini
 * Validates the config data before returning it.
 * @returns {object} - An object containing citra's config
 */
async function getCitraConfig(){
	
	const USER_DIR = env["HOME"];
	const CITRA_CONFIG_PATH = pathJoin(USER_DIR, ".config", "citra-emu", "qt-config.ini");
	const configFileContents = await fsp.readFile(CITRA_CONFIG_PATH, "utf-8");
	const config = config2js(configFileContents);
	
	// Check "UI > Paths\Gamedirs\size" value in config to be numeric
	const nDirs = parseInt(config["UI"].get("Paths\\gamedirs\\size"));
	if (Number.isNaN(nDirs)){
		throw Error("Non numeric Paths\\gamedirs\\size value in config file")
	}

	return config;
}

/**
 * Get citra's game dirs from its config data 
 * @param {object} config - Citra's config data 
 * @returns {GameDir[]} - The game dirs extracted from citra's config
 */
async function getCitraROMDirs(config){

	let dirs = [];
	
	// Get number of paths
	if (typeof config["UI"] === "undefined") { return dirs; }
	const nDirs = parseInt(config["UI"].get("Paths\\gamedirs\\size"));
	
	// Get paths
	for (let i = 1; i <= nDirs; i++){
		let recursive = String(config["UI"].get(`Paths\\gamedirs\\${i}\\deep_scan`)).toLowerCase() === "true";
		let path       = config["UI"].get(`Paths\\gamedirs\\${i}\\path`);
		if (typeof path === "undefined"){ continue; }
		dirs.push(new GameDir(path, recursive));
	}
	
	return dirs;
	
}

/**
 * Get citra ROM games from given game directories
 * @param {GameDir[]} dirs - The directories in which to search for ROMs 
 * @returns {CitraGame[]} - An array of found games
 */
async function getCitraROMs(dirs){
	
	// TODO test with 3ds files. 
	const GAME_FILES_REGEX = /.+\.(3ds|cci)/i;
	const gamePaths = await getROMs(dirs, GAME_FILES_REGEX);
	const games = gamePaths.map(path => new CitraGame(pathBasename(path), path));
	return games;

}

/**
 * Get citra installed games.
 * @throws Will throw a "Not implemented" error on every case, this is not yet supported
 * @param {object} config - Citra's config data 
 * @todo
 */
async function getCitraInstalledGames(config){

	// TODO	
	throw new Error("Not implemented");

}

/**
 * Get all citra games
 * @param {boolean} warn - Whether to display additional warnings 
 * @returns {CitraGame[]} - An array of found games 
 */
export async function getCitraGames(warn = false){

	// Get config
	let config; 
	try {
		config = await getCitraConfig(warn);
	} catch (error) {
		if (warn) console.warn(`Unable to read citra config file : ${error}`);
	}

	// Get ROM dirs
	let romDirs = [];
	if (typeof config !== "undefined"){
		try {
			romDirs = await getCitraROMDirs(config);
		} catch (error){
			if (warn) console.warn(`Unable to get citra ROM dirs : ${error}`);
		}
	}

	// Get ROM games
	let romGames = [];
	if (romDirs.length > 0){
		try {
			romGames = await getCitraROMs(romDirs);
		} catch {
			if (warn) console.warn(`Unable to get citra ROMs : ${error}`);
		}
	}

	// Get installed games
	let installedGames = [];
	// TODO implement scanning for installed switch games
	/*if (typeof config !== "undefined"){
		try {
			installedGames = await getCitraInstalledGames();
		} catch (error){
			if (warn) console.warn(`Unable to get citra installed games : ${error}`);
		}
	}*/

	return [...romGames, ...installedGames];

}
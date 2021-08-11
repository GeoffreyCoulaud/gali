import { getROMs, EmulatedGame, GameProcessContainer, NoCommandError } from "./common.js";
import { join as pathJoin, basename as pathBasename } from "path";
import { sync as commandExistsSync } from "command-exists";
import config2js from "../utils/config2js.js";
import { readFile } from "fs/promises";
import { GameDir } from "./common.js";
import { spawn } from "child_process";
import { env } from "process";

/**
 * A wrapper for yuzu game process management
 * @property {string} romPath - The game's ROM path, used to invoke yuzu
 */
class YuzuGameProcessContainer extends GameProcessContainer{

	/**
	 * Create a yuzu game process container
	 * @param {string} romPath - The game's ROM path
	 */
	constructor(romPath){
		super();
		this.romPath = romPath;
	}

	/**
	 * Start the game in a subprocess
	 */
	start(){
		const yuzuCommand = "yuzu";
		if (!commandExistsSync(yuzuCommand)){
			throw new NoCommandError("No yuzu command found");
		}
		this.process = spawn(
			yuzuCommand, 
			[this.romPath], 
			GameProcessContainer.defaultSpawnOptions
		);
		this._bindProcessEvents();
	}

	/**
	 * Overwrite the inherited stop method to equal the inherited kill method.
	 * This is done because yuzu seems to trap SIGTERM and needs to get SIGKILL to terminate.
	 * @returns {boolean} - True on success, else false
	 */
	stop(){
		// For yuzu, SIGTERM doesn't work, use SIGKILL instead. 
		return this.kill();
	}
}

/**
 * A class representing a yuzu game
 * @property {YuzuGameProcessContainer} processContainer - The game's process container
 */
export class YuzuGame extends EmulatedGame{
	
	/**
	 * Create a yuzu game
	 * @param {string} name - The game's displayed name
	 * @param {string} path - The game's ROM path
	 */
	constructor(name, path){
		super(name, path, "Yuzu", "Nintendo - Switch");
		this.processContainer = new YuzuGameProcessContainer(this.path);
	}

}

/**
 * Get yuzu's config data from its config file.
 * Found in $HOME/.config/yuzu/qt-config.ini
 * Validates the data before returning it.
 * @returns {object} - Yuzu's config data
 */
async function getYuzuConfig(){

	const USER_DIR = env["HOME"];
	const YUZU_CONFIG_PATH = pathJoin(USER_DIR, ".config/yuzu/qt-config.ini");
	const configFileContents = await readFile(YUZU_CONFIG_PATH, "utf-8");
	const config = config2js(configFileContents);
	
	// Check "UI > Paths\Gamedirs\size" value in config to be numeric
	const nDirs = parseInt(config["UI"].get("Paths\\gamedirs\\size"));
	if (Number.isNaN(nDirs)){
		throw Error("Non numeric Paths\\gamedirs\\size value in config file")
	}

	return config;

}

/**
 * Get yuzu's game dirs from its config data
 * @param {object} config - Yuzu's config data 
 * @returns {GameDir[]} - The game dirs extracted from yuzu's config
 */
async function getYuzuROMDirs(config){

	// Read config
	let dirs = [];
	
	// Get number of paths
	if (typeof config["UI"] === "undefined") { return dirs; }
	const nDirs = parseInt(config["UI"].get("Paths\\gamedirs\\size"));
	
	// Get paths
	if (Number.isNaN(nDirs)){ return dirs; }
	for (let i = 1; i <= nDirs; i++){
		let recursive = String(config["UI"].get(`Paths\\gamedirs\\${i}\\deep_scan`)).toLowerCase() === "true";
		let path       = config["UI"].get(`Paths\\gamedirs\\${i}\\path`);
		if (typeof path === "undefined"){ continue; }
		dirs.push(new GameDir(path, recursive));
	}

	return dirs;

}

/**
 * Get yuzu games from given game directories
 * @param {GameDir[]} dirs - The dirs to scan for ROMs 
 * @returns {YuzuGame[]} - An array of found games
 */
async function getYuzuROMs(dirs){

	const GAME_FILES_REGEX = /.+\.(xci|nsp)/i;
	const gamePaths = await getROMs(dirs, GAME_FILES_REGEX);
	const games = gamePaths.map(path => new YuzuGame(pathBasename(path), path));
	return games;

}

/**
 * Get yuzu installed games.
 * @throws Will throw a "Not implemented" error on every case, this is not yet supported
 * @param {object} config - Yuzu's config data 
 * @todo
 */
async function getYuzuInstalledGames(config){
	
	// TODO
	throw new Error("Not implemented");

}

/**
 * Get all yuzu games
 * @param {boolean} warn - Whether to display additional warnings
 * @returns {YuzuGame[]} - An array of found games
 */
export async function getYuzuGames(warn = false){

	// Get config
	let config; 
	try {
		config = await getYuzuConfig();
	} catch (error) {
		if (warn) console.warn(`Unable to read yuzu config file : ${error}`);
	}

	// Get ROM dirs
	let romDirs = [];
	if (typeof config !== "undefined"){
		try {
			romDirs = await getYuzuROMDirs(config);
		} catch (error){
			if (warn) console.warn(`Unable to get yuzu ROM dirs : ${error}`);
		}
	}

	// Get ROM games
	let romGames = [];
	if (romDirs.length > 0){
		try {
			romGames = await getYuzuROMs(romDirs);
		} catch (error) {
			if (warn) console.warn(`Unable to get yuzu ROMs : ${error}`);
		}
	}

	// Get installed games
	let installedGames = [];
	// TODO implement scanning for installed CIAs
	/*if (typeof config !== "undefined"){
		try {
			installedGames = await getYuzuInstalledGames();
		} catch (error){
			if (warn) console.warn(`Unable to get yuzu installed games : ${error}`);
		}
	}*/

	return [...romGames, ...installedGames];

}
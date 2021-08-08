import { EmulatedGame, getROMs, GameProcessContainer } from "./common.js";
import { basename as pathBasename, join as pathJoin } from "path";
import config2obj from "../config2obj.js";
import { GameDir } from "./common.js";
import { spawn } from "child_process";
import { promises as fsp } from "fs";
import { env } from "process";

/**
 * A wrapper for ppsspp game process management
 * @property {string} romPath - The game's ROM path, used to invoke ppsspp
 */
class PPSSPPGameProcessContainer extends GameProcessContainer{
	
	/**
	 * Create a ppsspp game container
	 * @param {string} romPath - The game's ROM path 
	 */
	constructor(romPath){
		super();
		this.romPath = romPath;
	}
	
	/**
	 * Start the game in a subprocess
	 * @param {string} ppssppCommand - The ppsspp command to use. Default is "PPSSPPSDL", can also be "PPSSPPQT"
	 */
	start(ppssppCommand = "PPSSPPSDL"){
		this.process = spawn(ppssppCommand, [this.romPath], GameProcessContainer.defaultSpawnOptions);
		this._bindProcessEvents();
	}

}

/**
 * A class representing a ppsspp game
 * @property {PPSSPPGameProcessContainer} processContainer - The game's process container
 */
export class PPSSPPGame extends EmulatedGame{
	/**
	 * Create a ppsspp game
	 * @param {string} name - The game's displayed name 
	 * @param {string} path - The games' ROM path 
	 */
	constructor(name, path){
		super(name, path, "PPSSPP", "Sony - PlayStation Portable");
		this.processContainer = new PPSSPPGameProcessContainer(this.path);
	}
}

/**
 * Get ppsspp config data from it config file in $HOME/.config/ppsspp/PSP/SYSTEM/ppsspp.ini
 * @returns {object} - The config data
 */
async function getPPSSPPConfig(){

	const USER_DIR = env["HOME"];
	const PPSSPP_INSTALL_DIRS_PATH = pathJoin(USER_DIR, ".config", "ppsspp", "PSP", "SYSTEM", "ppsspp.ini");
	const configFileContents = await fsp.readFile(PPSSPP_INSTALL_DIRS_PATH, "utf-8"); 
	const config = config2obj(configFileContents);
	return config;

}

/**
 * Get ppsspp ROM dirs from its config data (pinned paths)
 * @param {object} config - ppsspp config data 
 * @returns {GameDir[]} - The game dirs extracted from ppsspp's config data
 */
async function getPPSSPPRomDirs(config){

	let dirs = [];
	const paths = config?.["PinnedPaths"].values();
	for (let path of paths){
		dirs.push(new GameDir(path, false));
	}

	return dirs;

}

/**
 * Get all ppsspp ROMs in the specified game dirs
 * @param {GameDir[]} dirs - The game dirs to scan for ROMs 
 * @returns {PPSSPPGame[]} - An array of found games
 */
async function getPPSSPPRoms(dirs){

	const GAME_FILES_REGEX = /.+\.(iso|cso)/i;
	const gamePaths = await getROMs(dirs, GAME_FILES_REGEX);
	const games = gamePaths.map(path => new PPSSPPGame(pathBasename(path), path));
	return games;

}

/**
 * Get all ppsspp games
 * @param {boolean} warn - Whether to display additional warnings. 
 * @returns {PPSSPPGame[]} - An array of found games
 */
export async function getPPSSPPGames(warn = false){

	// Get config
	let config;
	try {
		config = await getPPSSPPConfig();
	} catch (error){
		if (warn) console.warn(`Unable to get PPSSPP config : ${error}`);
	}

	// Get rom dirs
	let romDirs = [];
	if (typeof config !== "undefined"){
		try {
			romDirs = await getPPSSPPRomDirs(config); 
		} catch (error){
			if (warn) console.warn(`Unable to get PPSSPP rom dirs : ${error}`);
		}
	}

	// Get roms
	let romGames = [];
	if (romDirs.length > 0){
		try {
			romGames = await getPPSSPPRoms(romDirs);
		} catch (error){
			if (warn) console.warn(`Unable to get PPSSPP roms : ${error}`);
		}
	}

	return romGames;

}
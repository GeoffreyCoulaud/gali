const { GameDir, EmulatedGame, getROMs, GameProcessContainer, NoCommandError } = require("./common.js");
const { basename: pathBasename, join: pathJoin } = require("path");
const { sync: commandExistsSync } = require("command-exists");
const { config2js } = require("../utils/config.js");
const { readFile } = require("fs/promises");
const { spawn } = require("child_process");
const { env } = require("process");

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
	 */
	async start(){
		// Find the right command to use
		const commandOptions = ["PPSSPPSDL", "PPSSPPQT"];
		let ppssppCommand;
		for (const option of commandOptions){
			if (commandExistsSync(option)){
				ppssppCommand = option;
				break;
			}
		}
		if (!ppssppCommand){
			throw new NoCommandError("No ppsspp command found");
		}
		// Start the game
		this.process = spawn(
			ppssppCommand,
			[this.romPath],
			GameProcessContainer.defaultSpawnOptions
		);
		this._bindProcessEvents();
	}

}

/**
 * A class representing a ppsspp game
 * @property {PPSSPPGameProcessContainer} processContainer - The game's process container
 */
class PPSSPPGame extends EmulatedGame{

	static source = "PPSSPP";

	/**
	 * Create a ppsspp game
	 * @param {string} name - The game's displayed name
	 * @param {string} path - The games' ROM path
	 */
	constructor(name, path){
		super(name, path, "Sony - PlayStation Portable");
		this.processContainer = new PPSSPPGameProcessContainer(this.path);
		this.source = this.constructor.source;
	}
}

/**
 * Get ppsspp config data from it config file in $HOME/.config/ppsspp/PSP/SYSTEM/ppsspp.ini
 * @returns {object} - The config data
 */
async function getPPSSPPConfig(){

	const USER_DIR = env["HOME"];
	const PPSSPP_INSTALL_DIRS_PATH = pathJoin(USER_DIR, ".config/ppsspp/PSP/SYSTEM/ppsspp.ini");
	const configFileContents = await readFile(PPSSPP_INSTALL_DIRS_PATH, "utf-8");
	const config = config2js(configFileContents);
	return config;

}

/**
 * Get ppsspp ROM dirs from its config data (pinned paths)
 * @param {object} config - ppsspp config data
 * @returns {GameDir[]} - The game dirs extracted from ppsspp's config data
 */
async function getPPSSPPRomDirs(config){

	const dirs = [];
	const paths = config?.["PinnedPaths"].values();
	for (const path of paths){
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
	const games = gamePaths.map(path=>new PPSSPPGame(pathBasename(path), path));
	return games;

}

/**
 * Get all ppsspp games
 * @param {boolean} warn - Whether to display additional warnings.
 * @returns {PPSSPPGame[]} - An array of found games
 */
async function getPPSSPPGames(warn = false){

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

module.exports = {
	PPSSPPGameProcessContainer,
	getPPSSPPGames,
	PPSSPPGame,
};
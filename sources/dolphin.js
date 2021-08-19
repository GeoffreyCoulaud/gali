const { EmulatedGame, GameProcessContainer, GameDir, getROMs, NoCommandError } = require("./common.js");
const { join: pathJoin, basename: pathBasename } = require("path");
const { sync: commandExistsSync } = require("command-exists");
const { config2js } = require("../utils/config.js");
const { readFile } = require("fs/promises");
const { spawn } = require("child_process");
const { env } = require("process");

/**
 * A wrapper for dolphin game management
 * @property {string} romPath - The game's ROM path, used to invoke dolphin
 */
class DolphinGameProcessContainer extends GameProcessContainer{
	/**
	 * Create a dolphin game process container.
	 * @param {string} romPath - The game's ROM path
	 */
	constructor(romPath){
		super();
		this.romPath = romPath;
	}

	/**
	 * Start the game in a subprocess
	 * @param {boolean} noUi - Whether to show dolphin's UI or only the game
	 */
	async start(noUi = false){
		const dolphinCommand = "dolphin-emu";
		if (!commandExistsSync(dolphinCommand)){
			throw new NoCommandError("No dolphin command found");
		}
		const args = ["-e", this.romPath];
		if (noUi) args.splice(0, 0, "-b");
		this.process = spawn(dolphinCommand, args, GameProcessContainer.defaultSpawnOptions);
		this._bindProcessEvents();
	}
}

/**
 * Class representing a dolphin game
 * @property {DolphinGameProcessContainer} processContainer - The game's process container
 */
class DolphinGame extends EmulatedGame{

	static source = "Dolphin";

	/**
	 * Create a dolphin game
	 * @param {string} name - The game's displayed name
	 * @param {string} path - The game's ROM path
	 */
	constructor(name, path){
		super(name, path, "Nintendo - Wii / GameCube");
		this.source = this.constructor.source;
		this.processContainer = new DolphinGameProcessContainer(this.path);
	}
}

/**
 * Get dolphin's config data
 * @returns {config} - Dolphin's config data
 */
async function getDolphinConfig(){

	const USER_DIR = env["HOME"];
	const DOLPHIN_INSTALL_DIRS_PATH = pathJoin(USER_DIR, ".config/dolphin-emu/Dolphin.ini");
	const configFileContents = await readFile(DOLPHIN_INSTALL_DIRS_PATH, "utf-8");
	const config = config2js(configFileContents);

	// Check "General -> ISOPaths" value to be numeric
	const nDirs = parseInt(config["General"].get("ISOPaths"));
	if ( Number.isNaN(nDirs) ){
		throw new Error("Non numeric ISOPaths value in config file");
	}

	return config;

}

/**
 * Get dolphin's ROM dirs from its config data
 * @param {object} config - Dolphin's config dara
 * @returns {GameDir} - The game dirs extracted from dolphin's config
 */
async function getDolphinROMDirs(config){

	const dirs = [];

	// Get number of paths and options
	if (typeof config["General"] === "undefined") { return dirs; }
	const nDirs = parseInt(config["General"].get("ISOPaths"));
	const recursive = config["General"].get("RecursiveISOPaths").toString().toLowerCase() === "true";

	// Get paths
	for (let i = 0; i < nDirs; i++){
		const path = config["General"].get(`ISOPath${i}`);
		if (typeof path === "undefined"){ continue; }
		dirs.push(new GameDir(path, recursive));
	}

	return dirs;

}

/**
 * Get dolphin ROMs from the given game dirs
 * @param {GameDir[]} dirs - The game dirs to search ROMs into
 * @returns {DolphinGame[]} - An array of found games
 */
async function getDolphinROMs(dirs){

	// TODO detect games console between GameCube and Wii
	const GAME_FILES_REGEX = /.+\.(c?iso|wbfs|gcm|gcz)/i;
	const gamePaths = await getROMs(dirs, GAME_FILES_REGEX);
	const games = gamePaths.map(path=>new DolphinGame(pathBasename(path), path));
	return games;
}

/**
 * Get all dolphin games.
 * @param {boolean} warn - Whether to display additional warnings
 * @returns {DolphinGame[]} - An array of found games
 */
async function getDolphinGames(warn = false){

	// Get config
	let config;
	try {
		config = await getDolphinConfig();
	} catch (error) {
		if (warn) console.warn(`Unable to read dolphin config file : ${error}`);
	}

	// Get ROM dirs
	let romDirs = [];
	if (typeof config !== "undefined"){
		try {
			romDirs = await getDolphinROMDirs(config);
		} catch (error){
			if (warn) console.warn(`Unable to get dolphin ROM dirs : ${error}`);
		}
	}

	// Get ROM games
	let romGames = [];
	if (romDirs.length > 0){
		try {
			romGames = await getDolphinROMs(romDirs);
		} catch (error) {
			if (warn) console.warn(`Unable to get dolphin ROMs : ${error}`);
		}
	}

	return romGames;

}

module.exports = {
	DolphinGameProcessContainer,
	getDolphinGames,
	DolphinGame,
};
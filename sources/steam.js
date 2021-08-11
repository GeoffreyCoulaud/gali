import { Game, GameDir, GameProcessContainer, NoCommandError } from "./common.js";
import { sync as commandExistsSync } from "command-exists";
import { promises as fsp, existsSync } from "fs";
import { parse as parseVDF} from "vdf-parser";
import { join as pathJoin } from "path";
import { spawn } from "child_process";
import { env } from "process";

const USER_DIR = env["HOME"];

/**
 * A wrapper for steam game process management
 * @property {string} appId - A steam appid, used to invoke steam
 */
class SteamGameProcessContainer extends GameProcessContainer{
	
	/**
	 * Create a steam game process container
	 * @param {string} appId - A steam appid
	 */
	constructor(appId){
		super();
		this.appId = appId;
	}

	// ! There is no way (AFAIK) to control a steam game's life cycle.
	
	/**
	 * Start the game in a subprocess
	 */
	start(){
		const steamCommand = "steam";
		if (!commandExistsSync(steamCommand)){
			throw new NoCommandError("No steam command found");
		}
		this.process = spawn(
			steamCommand, 
			[`steam://rungameid/${this.appId}`], 
			GameProcessContainer.doNotWaitSpawnOptions
		);
		this.process.unref();
		this._bindProcessEvents();
	}
	
	/**
	 * Overwrite the inherited stop method to neutralize it
	 * @returns {boolean} - Always false
	 */
	stop(){
		console.warn("Stopping steam games is not supported, please use steam's UI");
		return false;
	}
	
	/**
	 * Overwrite the inherited kill method to neutralize it
	 * @returns {boolean} - Always false
	 */
	kill(){
		console.warn("Killing steam games is not supported, please use steam's UI");
		return false;
	}
}

/**
 * Class representing a steam game
 */
export class SteamGame extends Game{
	
	/**
	 * Create a steam game
	 * @param {string} appId - A steam appid
	 * @param {string} name - The game's displayed name
	 */
	constructor(appId, name){
		super(name);
		this.source = "Steam";
		this.appId = appId;
		this.processContainer = new SteamGameProcessContainer(this.appId);
	}

	/**
	 * Create a string representation of the game
	 * @returns {string} - A string representing the game
	 */
	toString(){
		return `${this.name} - ${this.source} - ${this.appId}`;
	}
}

/**
 * Get steam's config data about install dirs
 * @returns {object} - Steam's config data (install dirs)
 */
async function getSteamConfig(){

	const STEAM_INSTALL_DIRS_PATH =  pathJoin(USER_DIR, ".steam/root/config/libraryfolders.vdf");
	const fileContents = await fsp.readFile(STEAM_INSTALL_DIRS_PATH, {encoding: "utf-8"});
	const config = parseVDF(fileContents);

	// Validate
	if (typeof config.libraryfolders === "undefined"){
		throw "Invalid steam config : libraryfolders key undefined";
	}

	return config;

}

/**
 * Get steam install dirs from its config data
 * @param {object} config - Steam's config data
 * @returns {GameDir[]} - The game dirs extracted from Steam's config
 */
async function getSteamInstallDirs(config){
	let dirs = [];

	// Read default steam install directory
	const STEAM_DEFAULT_INSTALL_DIR = pathJoin(USER_DIR, ".steam/root");
	if (existsSync(STEAM_DEFAULT_INSTALL_DIR)){
		dirs.push(new GameDir(STEAM_DEFAULT_INSTALL_DIR));
	}

	// Read user specified steam install directories
	const libraryfolders = config.libraryfolders;
	let keys = Object.keys(libraryfolders);
	for (let i = 0; i < keys.length-1; i++){
		dirs.push(new GameDir(libraryfolders[keys[i]].path));
	}
	
	return dirs;
}

/**
 * Get all steam installed games
 * @param {GameDir[]} dirs - The steam game dirs to scan for game manifests
 * @returns {SteamGame[]} - An array of found games
 */
async function getSteamInstalledGames(dirs){
	
	const IGNORED_ENTRIES_REGEXES = [
		/^Steamworks.*/,
		/^(S|s)team ?(L|l)inux ?(R|r)untime.*/,
		/^Proton.*/
	];

	let games = [];

	for (let dir of dirs){

		// Get all games manifests of dir
		const manifestsDir = pathJoin(dir.path, "steamapps");
		let entries = [];
		try { entries = await fsp.readdir(manifestsDir); } 
		catch (err) { continue; }
		let manifests = entries.filter(string=>string.startsWith("appmanifest_") && string.endsWith(".acf"));

		// Get info from manifests
		for (let manifest of manifests){

			let manifestPath = pathJoin(manifestsDir, manifest);
			let manifestContent = await fsp.readFile(manifestPath, {encoding: "utf-8"});
			let manifestParsedContent = parseVDF(manifestContent);
			let game = new SteamGame(manifestParsedContent?.AppState?.appid, manifestParsedContent?.AppState?.name);

			// Ignore some non-games entries
			let ignored = false;
			if (typeof game.appId === "undefined" || typeof game.name === "undefined"){
				ignored = true;
			} else {
				for (let regex of IGNORED_ENTRIES_REGEXES){
					if (game.name.match(regex)){
						ignored = true;
						break;
					}
				}
			}
			if (!ignored){
				games.push(game);
			}

		}
	}
	
	return games;
}

/**
 * Get all steam games
 * @param {boolean} warn - Whether to display additional warnings
 * @returns {SteamGame[]} - An array of found games
 * @todo add support for non installed games
 */
export async function getSteamGames(warn = false){

	// Get config
	let config;
	try {
		config = await getSteamConfig();
	} catch (error){
		if (warn) console.warn(`Unable to get steam config : ${error}`);
	}

	// Get game dirs
	let dirs = [];
	if (typeof config !== "undefined"){
		try{
			dirs = await getSteamInstallDirs(config);
		} catch (error){
			if (warn) console.warn(`Unable to get steam install dirs : ${error}`);
		}
	}

	// Get games
	let games = [];
	if (dirs.length > 0){
		try {
			games = await getSteamInstalledGames(dirs);
		} catch (error){
			if (warn) console.warn(`Unable to get steam installed games : ${error}`);
		}
	}

	// ? Add support for non-installed games ?

	return games;

}
const { StartOnlyGameProcessContainer, GameDir, Game, Source } = require("./common.js");
const { readdir, readFile } = require("fs/promises");
const { parse: parseVDF} = require("vdf-parser");
const { join: pathJoin } = require("path");
const { spawn } = require("child_process");
const { existsSync } = require("fs");
const { env } = require("process");

const USER_DIR = env["HOME"];

const STEAM_SOURCE_NAME = "Steam";

/**
 * A wrapper for steam game process management
 * @property {string} appId - A steam appid, used to invoke steam
 */
class SteamGameProcessContainer extends StartOnlyGameProcessContainer{

	commandOptions = ["steam"];

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
	async start(){
		const command = this._selectCommand();
		this.process = spawn(
			command,
			[`steam://rungameid/${this.appId}`],
			this.constructor.defaultSpawnOptions
		);
		this.process.unref();
		this._bindProcessEvents();
	}

}

/**
 * Class representing a steam game
 */
class SteamGame extends Game{

	platform = "PC";
	source = STEAM_SOURCE_NAME;

	/**
	 * Create a steam game
	 * @param {string} appId - A steam appid
	 * @param {string} name - The game's displayed name
	 */
	constructor(appId, name){
		super(name);
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

class SteamSource extends Source{

	static name = STEAM_SOURCE_NAME;
	preferCache = false;

	constructor(preferCache = false){
		super();
		this.preferCache = preferCache;
	}

	/**
	 * Get steam's config data about install dirs
	 * @returns {object} - Steam's config data (install dirs)
	 * @private
	 */
	async _getConfig(){

		const STEAM_INSTALL_DIRS_PATH =  pathJoin(USER_DIR, ".steam/root/config/libraryfolders.vdf");
		const fileContents = await readFile(STEAM_INSTALL_DIRS_PATH, {encoding: "utf-8"});
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
	 * @private
	 */
	async _getDirs(config){
		const dirs = [];

		// Read default steam install directory
		const STEAM_DEFAULT_INSTALL_DIR = pathJoin(USER_DIR, ".steam/root");
		if (existsSync(STEAM_DEFAULT_INSTALL_DIR)){
			dirs.push(new GameDir(STEAM_DEFAULT_INSTALL_DIR));
		}

		// Read user specified steam install directories
		const libraryfolders = config.libraryfolders;
		const keys = Object.keys(libraryfolders);
		for (let i = 0; i < keys.length-1; i++){
			dirs.push(new GameDir(libraryfolders[keys[i]].path));
		}

		return dirs;
	}

	/**
	 * Get all steam installed games
	 * @param {GameDir[]} dirs - The steam game dirs to scan for game manifests
	 * @returns {SteamGame[]} - An array of found games
	 * @private
	 */
	async _getInstalledGames(dirs){

		const IGNORED_ENTRIES_REGEXES = [
			/^Steamworks.*/,
			/^(S|s)team ?(L|l)inux ?(R|r)untime.*/,
			/^Proton.*/
		];

		const games = [];

		for (const dir of dirs){

			// Get all games manifests of dir
			const manifestsDir = pathJoin(dir.path, "steamapps");
			let entries = [];
			try { entries = await readdir(manifestsDir); } catch (err) { continue; }
			const manifests = entries.filter(string=>string.startsWith("appmanifest_") && string.endsWith(".acf"));

			// Get info from manifests
			for (const manifest of manifests){

				const manifestPath = pathJoin(manifestsDir, manifest);
				const manifestContent = await readFile(manifestPath, {encoding: "utf-8"});
				const manifestParsedContent = parseVDF(manifestContent);
				const game = new SteamGame(manifestParsedContent?.AppState?.appid, manifestParsedContent?.AppState?.name);

				// Ignore some non-games entries
				let ignored = false;
				if (typeof game.appId === "undefined" || typeof game.name === "undefined"){
					ignored = true;
				} else {
					for (const regex of IGNORED_ENTRIES_REGEXES){
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
	async scan(warn = false){

		// Get config
		let config;
		try {
			config = await this._getConfig();
		} catch (error){
			if (warn) console.warn(`Unable to get steam config : ${error}`);
		}

		// Get game dirs
		let dirs = [];
		if (typeof config !== "undefined"){
			try{
				dirs = await this._getDirs(config);
			} catch (error){
				if (warn) console.warn(`Unable to get steam install dirs : ${error}`);
			}
		}

		// Get games
		let games = [];
		if (dirs.length > 0){
			try {
				games = await this._getInstalledGames(dirs);
			} catch (error){
				if (warn) console.warn(`Unable to get steam installed games : ${error}`);
			}
		}

		// ? Add support for non-installed games ?

		return games;

	}

}

module.exports = {
	SteamGameProcessContainer,
	SteamSource,
	SteamGame,
};
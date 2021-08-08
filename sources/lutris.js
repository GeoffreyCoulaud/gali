import { Game, GameProcessContainer } from "./common.js";
import { join as pathJoin } from "path";
import { spawn } from "child_process";
import { env } from "process";
import { open } from "sqlite";
import sqlite3 from "sqlite3";
import * as fs from "fs";
import YAML from "yaml";
const fsp = fs.promises;

const USER_DIR = env["HOME"];
const LUTRIS_DB_PATH = pathJoin(USER_DIR, ".local", "share", "lutris", "pga.db");

/** 
 * Deeply merge multiple objects
 * @param {object[]} objects - The objects to merge 
 * @returns {object} - A merged object
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign#warning_for_deep_clone
 */
function deepMergeObjects(objects){
	let merged = {};
	for (let object of objects){
		for (let key of Object.keys(object)){
			// If the key doesn't exist, simply copy.
			// If the key exists and is not an object, copy to overwrite it.
			// If the key exists and is an object, recurse into it.
			if (!merged.hasOwnProperty(key) || typeof merged[key] !== "object"){
				merged[key] = object[key];
			} else {
				merged[key] = deepMergeObjects([merged[key], object[key]]);
			}
		}
	}
	return merged;
}

/**
 * A wrapper for lutris game process management
 * @property {string} gameSlug - A lutris game slug, used to invoke lutris
 */
class LutrisGameProcessContainer extends GameProcessContainer{	
	
	/**
	 * Create a lutris game process container
	 * @param {string} gameSlug - A lutris game slug
	 */
	constructor(gameSlug){
		super();
		this.gameSlug = gameSlug;
	}

	// ! It is possible to manage lutris games's life cycle but it's clunky at best. 
	// (means parsing options, starting wine by yourself...)
	
	/**
	 * Start the game in a subprocess
	 */
	start(){
		console.warn("Using lutris command, process management unavailable");
		this.process = spawn("lutris", [`lutris://rungame/${this.game.gameSlug}`]); // Can't handle process life in lutris 
		this._bindProcessEvents();
	}

	/**
	 * Overwrite the inherited stop method to neutralize it
	 * @returns {boolean} - Always false
	 */
	stop(){
		console.warn("Stopping lutris games is not supported, please use lutris's UI");
		return false;
	}

	/**
	 * Overwrite the inherited kill method to neutralize it
	 * @returns {boolean} - Always false
	 */
	kill(){
		console.warn("Killing lutris games is not supported, please use lutris's UI");
		return false;
	}
} 

/**
 * A class representing a Lutris game
 * @property {string} gameSlug - A lutris game slug
 * @property {string} configPath - The game's config path
 * @property {string} runner - The game's runner
 * @property {LutrisGameProcessContainer} processContainer - The game's process container
 */
export class LutrisGame extends Game{
	
	/**
	 * Create a lutris game
	 * @param {string} gameSlug - A lutris game slug 
	 * @param {string} name - The game's displayed name
	 * @param {string} runner - The game's lutris runner
	 * @param {string} configPath - The games's config path
	 */
	constructor(gameSlug, name, runner, configPath){
		super(name);
		this.source = "Lutris";
		this.gameSlug = gameSlug;
		this.configPath = configPath;
		this.runner = runner;
		this.processContainer = new LutrisGameProcessContainer(this.gameSlug);
	}

	/**
	 * Create a string representation of the game
	 * @returns {string} - A string representing the game
	 */
	toString(){
		return `${this.name} - ${this.source} - ${this.gameSlug}`;
	}

	/**
	 * Get the game's config ath the specified level
	 * @param {string} level - A value within "game", "runner" or "system" 
	 * @returns {object} - The config data at the specified level
	 * @access protected
	 */
	async _getSpecificConfig(level){
		const paths = {
			game: pathJoin(USER_DIR, ".config", "lutris", "games", `${this.configPath}.yml`),
			runner: pathJoin(USER_DIR, ".config", "lutris", "runners", `${this.runner}.yml`),
			system: pathJoin(USER_DIR, ".config", "lutris", "system.yml"),
		}
		// Sanitize level + check file existence
		let config = new Object();
		if (!paths.hasOwnProperty(level)) return config;
		if (!fs.existsSync(paths[level])) return config;
		// Read file contents + parse yml
		try {
			const contents = await fsp.readFile(paths[level], "utf-8");
			config = YAML.parse(contents);
		} catch (error){
			return new Object();
		}
		return config;
	}

	/**
	 * Get full game config
	 * @returns {object} - The game's config data
	 */
	async getConfig(){
		// Get all config levels
		const levels = ["system", "runner", "game"];
		const configs = await Promise.all(levels.map(level=>this._getSpecificConfig(level)));
		// Merge all configs into one
		let mergedConfig = deepMergeObjects(configs);
		return mergedConfig;
	}
}

/**
 * Get all lutris installed games from its SQLite database
 * @param {boolean} warn - Whether to display additional warnings 
 * @returns {LutrisGame[]} - An array of found games
 */
async function getLutrisInstalledGames(warn = false){
	let games = [];
	
	// Open DB
	let db;
	try {
		db = await open({filename: LUTRIS_DB_PATH, driver: sqlite3.cached.Database});
	} catch(error){
		if (warn) console.warn(`Could not open lutris DB (${error})`);
		return games;
	}

	// Get games
	const DB_REQUEST_INSTALLED_GAMES = "SELECT name, slug, directory, configpath, service, service_id, runner FROM 'games' WHERE installed AND NOT hidden";
	const results = await db.all(DB_REQUEST_INSTALLED_GAMES);
	for (let row of results){
		// Validate every request row
		if (
			row.slug &&
			row.name &&
			row.directory &&
			row.configpath && 
			(
				row.runner || 
				row.service && row.service_id
			)
		){
			games.push(new LutrisGame(row.slug, row.name, row.runner, row.configpath));
		}
	}

	return games;
}

/**
 * Get all lutris games
 * @param {boolean} warn - Whether to display additional warnings 
 * @returns {LutrisGame[]} - A list of found games
 * @todo add support for non installed games
 */
export async function getLutrisGames(warn = false){

	// ? Add support for non-installed games ?
	
	return getLutrisInstalledGames(warn);

}
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

class LutrisGameProcessContainer extends GameProcessContainer{	
	constructor(gameSlug){
		super();
		this.gameSlug = gameSlug;
	}
	// ! It is possible to manage lutris games's life cycle but it's clunky at best. 
	// (means parsing options, starting wine by yourself...)
	start(){
		console.warn("Using lutris command, process management unavailable");
		this.process = spawn("lutris", [`lutris://rungame/${this.game.gameSlug}`]); // Can't handle process life in lutris 
		this._bindProcessEvents();
	}
	stop(){
		console.warn("Stopping lutris games is not supported, please use lutris's UI");
		return false;
	}
	kill(){
		console.warn("Killing lutris games is not supported, please use lutris's UI");
		return false;
	}
} 

export class LutrisGame extends Game{
	constructor(gameSlug, name, prefixPath, runner, service, serviceId, configPath){
		super(name);
		this.source = "Lutris";
		this.gameSlug = gameSlug;
		this.prefixPath = prefixPath;
		this.configPath = configPath;
		this.runner = runner;
		this.service = service;
		this.serviceId = serviceId;
		this.processContainer = new LutrisGameProcessContainer(this.gameSlug);
	}

	toString(){
		return `${this.name} - ${this.source} - ${this.gameSlug}`;
	}

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

	async getConfig(){
		// Get all config levels
		const levels = ["system", "runner", "game"];
		const configs = await Promise.all(levels.map(level=>this._getSpecificConfig(level)));
		// Merge all configs into one
		let mergedConfig = deepMergeObjects(configs);
		return mergedConfig;
	}
}

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
			games.push(new LutrisGame(row.slug, row.name, row.directory, row.runner, row.service, row.serviceId, row.configpath));
		}
	}

	return games;
}

export async function getLutrisGames(warn = false){

	// ? Add support for non-installed games ?
	
	return getLutrisInstalledGames(warn);

}
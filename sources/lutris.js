import { Game, GameProcessContainer } from "./common.js";
import { join as pathJoin } from "path";
import { spawn } from "child_process";
import { open } from 'sqlite'
import { env } from "process";
import sqlite3 from 'sqlite3'

const USER_DIR = env["HOME"];
const LUTRIS_DB_PATH = pathJoin(USER_DIR, ".local", "share", "lutris", "pga.db");

class LutrisGameProcessContainer extends GameProcessContainer{	
	constructor(gameSlug, runner = "wine", service = null, serviceId = null){
		super();
		this.gameSlug = gameSlug;
		this.runner = runner;
		this.service = service;
		this.serviceId = serviceId;
	}
	start(){
		if (!this.runner){
			// Service mode, includes : GOG, Humble Bundle, Steam
			this._startFromLutris();
		} else {
			// Depending on the runner, do something different 
			switch (this.runner){
				case "wine": 
					this._startFromWine();
					break;
				default: // Other non implemented runner, use lutris command line
					this._startFromLutris();
					break; 
			}
		}
		this._bindProcessEvents();
	}
	_startFromLutris(){
		console.warn("Using Lutris command, process management unavailable");
		this.process = spawn("lutris", [this.gameSlug]); // No need to wait, process life != game life 
	}
	_startFromWine(){
		// TODO start the game directly with wine
		throw new Error("Starting Lutris games via wine is not implemented");
	}
} 

export class LutrisGame extends Game{
	constructor(gameSlug, name, prefixPath, runner, service, serviceId, configPath = undefined){
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
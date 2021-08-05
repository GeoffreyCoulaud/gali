import { Game, GameDir, GameProcessContainer } from "./common.js";
import { promises as fsp, existsSync } from "fs";
import { parse as parseVDF} from "vdf-parser";
import { join as pathJoin } from "path";
import { spawn } from "child_process";
import { env } from "process";

const USER_DIR = env["HOME"];
const STEAM_INSTALL_DIRS_PATH =  pathJoin(USER_DIR, ".steam", "root", "config", "libraryfolders.vdf");
const STEAM_DEFAULT_INSTALL_DIR = pathJoin(USER_DIR, ".steam", "root");

class SteamGameProcessContainer extends GameProcessContainer{
	constructor(appId){
		super();
		this.appId = appId;
	}
	start(){
		this.process = spawn("steam" [`steam://rungameid/${this.appId}`]);
		this._bindProcessEvents();
	}
}

export class SteamGame extends Game{
	
	constructor(appId, name){
		super(name);
		this.source = "Steam";
		this.appId = appId;
		this.processContainer = new SteamGameProcessContainer(this.appId);
	}

	toString(){
		return `${this.name} - ${this.source} - ${this.appId}`;
	}
}

async function getSteamConfig(){

	const fileContents = await fsp.readFile(STEAM_INSTALL_DIRS_PATH, {encoding: "utf-8"});
	const config = parseVDF(fileContents);

	// Validate
	if (typeof config.libraryfolders === "undefined"){
		throw "Invalid steam config : libraryfolders key undefined";
	}

	return config;

}

async function getSteamInstallDirs(config){
	let dirs = [];

	// Read default steam install directory
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
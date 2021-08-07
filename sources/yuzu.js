import { getROMs, EmulatedGame, GameProcessContainer } from "./common.js";
import { join as pathJoin, basename as pathBasename } from "path";
import config2obj from "../config2obj.js";
import { GameDir } from "./common.js";
import { spawn } from "child_process";
import { promises as fsp } from "fs"
import { env } from "process";

class YuzuGameProcessContainer extends GameProcessContainer{
	constructor(romPath){
		super();
		this.romPath = romPath;
	}
	start(){
		this.process = spawn("yuzu", [this.romPath], GameProcessContainer.defaultSpawnOptions);
		this._bindProcessEvents();
	}
	stop(){
		// For yuzu, SIGTERM doesn't work, use SIGKILL instead. 
		return this.kill();
	}
}

export class YuzuGame extends EmulatedGame{
	constructor(name, path){
		super(name, path, "Yuzu", "Nintendo - Switch");
		this.processContainer = new YuzuGameProcessContainer(this.path);
	}
}

async function getYuzuConfig(){

	const USER_DIR = env["HOME"];
	const YUZU_CONFIG_PATH = pathJoin(USER_DIR, ".config", "yuzu", "qt-config.ini");
	const configFileContents = await fsp.readFile(YUZU_CONFIG_PATH, "utf-8");
	const config = config2obj(configFileContents);
	
	// Check "UI > Paths\Gamedirs\size" value in config to be numeric
	const nDirs = parseInt(config["UI"].get("Paths\\gamedirs\\size"));
	if (Number.isNaN(nDirs)){
		throw Error("Non numeric Paths\\gamedirs\\size value in config file")
	}

	return config;

}

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

async function getYuzuROMs(dirs){

	const GAME_FILES_REGEX = /.+\.(xci|nsp)/i;
	const gamePaths = await getROMs(dirs, GAME_FILES_REGEX);
	const games = gamePaths.map(path => new YuzuGame(pathBasename(path), path));
	return games;

}

async function getYuzuInstalledGames(config){
	
	// TODO
	throw "Not implemented";

}

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
	if (typeof config !== "undefined"){
		try {
			installedGames = await getYuzuInstalledGames();
		} catch (error){
			if (warn) console.warn(`Unable to get yuzu installed games : ${error}`);
		}
	}

	return [...romGames, ...installedGames];

}
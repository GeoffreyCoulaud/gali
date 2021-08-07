import { join as pathJoin, basename as pathBasename } from "path";
import { EmulatedGame, GameProcessContainer } from "./common.js";
import { GameDir } from "./common.js";
import config2obj from "../config2obj.js";
import { promises as fsp } from "fs";
import { getROMs } from "./common.js";
import { spawn } from "child_process";
import { env } from "process";

class DolphinGameProcessContainer extends GameProcessContainer{
	constructor(romPath){
		super();
		this.romPath = romPath;
	}
	start(noUi = false){
		let args = ["-e", this.romPath];
		if (noUi) args.splice(0, 0, "-b");
		this.process = spawn("dolphin-emu", args, GameProcessContainer.defaultSpawnOptions);
		this._bindProcessEvents();
	}
}

export class DolphinGame extends EmulatedGame{
	constructor(name, path){
		super(name, path, "Dolphin", "Nintendo - Wii / GameCube");
		this.processContainer = new DolphinGameProcessContainer(this.path);
	}
}

async function getDolphinConfig(){
	
	const USER_DIR = env["HOME"];
	const DOLPHIN_INSTALL_DIRS_PATH = pathJoin(USER_DIR, ".config", "dolphin-emu", "Dolphin.ini");
	const configFileContents = await fsp.readFile(DOLPHIN_INSTALL_DIRS_PATH, "utf-8"); 
	const config = config2obj(configFileContents);
	
	// Check "General -> ISOPaths" value to be numeric
	const nDirs = parseInt(config["General"].get("ISOPaths"));
	if ( Number.isNaN(nDirs) ){
		throw new Error("Non numeric ISOPaths value in config file");
	}

	return config;

}

async function getDolphinROMDirs(config){
	
	let dirs = [];

	// Get number of paths and options
	if (typeof config["General"] === "undefined") { return dirs; }
	const nDirs = parseInt(config["General"].get("ISOPaths"));
	const recursive = config["General"].get("RecursiveISOPaths").toString().toLowerCase() === "true";
	
	// Get paths
	for (let i = 0; i < nDirs; i++){
		let path = config["General"].get(`ISOPath${i}`);
		if (typeof path === "undefined"){ continue; }
		dirs.push(new GameDir(path, recursive));
	}

	return dirs;

}

async function getDolphinROMs(dirs){

	// TODO detect games console between GameCube and Wii
	const GAME_FILES_REGEX = /.+\.(c?iso|wbfs|gcm|gcz)/i;
	const gamePaths = await getROMs(dirs, GAME_FILES_REGEX);
	const games = gamePaths.map(path => new DolphinGame(pathBasename(path), path));
	return games;
}

export async function getDolphinGames(warn = false){

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
import { EmulatedGame, getROMs, GameProcessContainer } from "./common.js";
import { basename as pathBasename, join as pathJoin } from "path";
import config2obj from "../config2obj.js";
import { GameDir } from "./common.js";
import { spawn } from "child_process";
import { promises as fsp } from "fs";
import { env } from "process";

class PPSSPPGameProcessContainer extends GameProcessContainer{
	constructor(romPath){
		super();
		this.romPath = romPath;
	}
	start(ppssppCommand = "PPSSPPSDL"){
		this.process = spawn(ppssppCommand, [this.romPath], GameProcessContainer.defaultSpawnOptions);
		this._bindProcessEvents();
	}
}

export class PPSSPPGame extends EmulatedGame{
	constructor(name, path){
		super(name, path, "PPSSPP", "Sony - PlayStation Portable");
		this.processContainer = new PPSSPPGameProcessContainer(this.path);
	}
}

async function getPPSSPPConfig(){

	const USER_DIR = env["HOME"];
	const PPSSPP_INSTALL_DIRS_PATH = pathJoin(USER_DIR, ".config", "ppsspp", "PSP", "SYSTEM", "ppsspp.ini");
	const configFileContents = await fsp.readFile(PPSSPP_INSTALL_DIRS_PATH, "utf-8"); 
	const config = config2obj(configFileContents);
	return config;

}

async function getPPSSPPRomDirs(config){

	let dirs = [];
	const paths = config?.["PinnedPaths"].values();
	for (let path of paths){
		dirs.push(new GameDir(path, false));
	}

	return dirs;

}

async function getPPSSPPRoms(dirs){

	const GAME_FILES_REGEX = /.+\.(iso|cso)/i;
	const gamePaths = await getROMs(dirs, GAME_FILES_REGEX);
	const games = gamePaths.map(path => new PPSSPPGame(pathBasename(path), path));
	return games;

}

export async function getPPSSPPGames(warn = false){

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
import { join as pathJoin, basename as pathBasename } from "path";
import { getROMs, EmulatedGame } from "./generic.js";
import config2obj from "../config2obj.js";
import { GameDir } from "./generic.js";
import { promises as fsp } from "fs"
import { env } from "process";

export class CitraGame extends EmulatedGame{
	constructor(name, path){
		super(name, path, "Citra", "Nintendo - 3DS");
	}
}

async function getCitraConfig(){
	
	const USER_DIR = env["HOME"];
	const CITRA_CONFIG_PATH = pathJoin(USER_DIR, ".config", "citra-emu", "qt-config.ini");
	const configFileContents = await fsp.readFile(CITRA_CONFIG_PATH, "utf-8");
	const config = config2obj(configFileContents);
	
	// Check "UI > Paths\Gamedirs\size" value in config to be numeric
	const nDirs = parseInt(config["UI"].get("Paths\\gamedirs\\size"));
	if (Number.isNaN(nDirs)){
		throw Error("Non numeric Paths\\gamedirs\\size value in config file")
	}

	return config;
}

async function getCitraROMDirs(config){

	let dirs = [];
	
	// Get number of paths
	if (typeof config["UI"] === "undefined") { return dirs; }
	const nDirs = parseInt(config["UI"].get("Paths\\gamedirs\\size"));
	
	// Get paths
	for (let i = 1; i <= nDirs; i++){
		let recursive = String(config["UI"].get(`Paths\\gamedirs\\${i}\\deep_scan`)).toLowerCase() === "true";
		let path       = config["UI"].get(`Paths\\gamedirs\\${i}\\path`);
		if (typeof path === "undefined"){ continue; }
		dirs.push(new GameDir(path, recursive));
	}
	
	return dirs;
	
}

async function getCitraROMs(dirs){
	
	// TODO test with 3ds files. 
	const GAME_FILES_REGEX = /.+\.(3ds|cci)/i;
	const gamePaths = await getROMs(dirs, GAME_FILES_REGEX);
	const games = gamePaths.map(path => new CitraGame(pathBasename(path), path));
	return games;

}

async function getCitraInstalledGames(config){

	// TODO	
	throw "Not implemented";

}

export async function getCitraGames(warn = false){

	// Get config
	let config; 
	try {
		config = await getCitraConfig(warn);
	} catch (error) {
		if (warn) console.warn(`Unable to read citra config file : ${error}`);
	}

	// Get ROM dirs
	let romDirs = [];
	if (typeof config !== "undefined"){
		try {
			romDirs = await getCitraROMDirs(config);
		} catch (error){
			if (warn) console.warn(`Unable to get citra ROM dirs : ${error}`);
		}
	}

	// Get ROM games
	let romGames = [];
	if (romDirs.length > 0){
		try {
			romGames = await getCitraROMs(romDirs);
		} catch {
			if (warn) console.warn(`Unable to get citra ROMs : ${error}`);
		}
	}

	// Get installed games
	let installedGames = [];
	if (typeof config !== "undefined"){
		try {
			installedGames = await getCitraInstalledGames();
		} catch (error){
			if (warn) console.warn(`Unable to get citra installed games : ${error}`);
		}
	}

	return [...romGames, ...installedGames];

}
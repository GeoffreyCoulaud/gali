import { promises as fsp } from "fs";
import { join as pathJoin} from "path";
import { env } from "process";
import { readdirAsync } from "readdir-enhanced";
import { DolphinEmuGame, GameDir } from "../games.js";
import config2obj from "../config2obj.js";

const USER_DIR = env["HOME"];
const DOLPHIN_EMU_INSTALL_DIRS_PATH = pathJoin(USER_DIR, ".config", "dolphin-emu", "Dolphin.ini");

export async function getDolphinEmuInstallDirs(warn = false){

	let dirs = [];
	
	// Read dolphin config file
	let configFileContents;
	try{
		configFileContents = await fsp.readFile(DOLPHIN_EMU_INSTALL_DIRS_PATH, "utf-8");
	} catch (error){
		if (warn) console.warn(`Unable to read dolphin config file : ${error}`);
		return dirs;
	}
	
	// Parse config file lines 
	const parsedConfig = config2obj(configFileContents);
	
	// Get number of paths and options
	if (typeof parsedConfig["General"] === "undefined") { return dirs; }
	const nDirs = parseInt(parsedConfig["General"].get("ISOPaths"));
	const recursive = parsedConfig["General"].get("RecursiveISOPaths").toString().toLowerCase() === "true";
	
	// Get paths
	if (Number.isNaN(nDirs)){ return dirs; }
	for (let i = 0; i < nDirs; i++){
		let path = parsedConfig["General"].get(`ISOPath${i}`);
		if (typeof path === "undefined"){ continue; }
		dirs.push(new GameDir(path, recursive));
	}

	return dirs;

}

export async function getDolphinEmuInstalledGames(dirs, warn = false){

	// TODO detect games console between GameCube and Wii

	const GAME_FILES_REGEX = /.+\.(c?iso|wbfs|gcm|gcz)/i;
	let games = [];

	for (let dir of dirs){
		
		// Get all the files in dir recursively
		let files;
		try {
			files = await readdirAsync(dir.path, {filter: GAME_FILES_REGEX, deep: dir.recursive});
		} catch (error){
			if (warn) console.warn(`Skipping directory ${dir.path} (${error})`);
			continue;
		}

		// Filter to keep only game files
		if (files.length === 0) console.warn(`No game files in "${dir.path}"${dir.recursive ? " (recursively)" : ""}`);

		// Add games
		for (let file of files){
			let fileAbsPath = pathJoin(dir.path, file);
			games.push(new DolphinEmuGame(file, fileAbsPath));
		}

	}

	return games;

}
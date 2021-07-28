import { join as pathJoin } from "path";
import { YuzuGame, GameDir } from "../games.js";
import { promises as fsp } from "fs"
import { readdirAsync } from "readdir-enhanced";
import config2obj from "../config2obj.js";
import { env } from "process";

const USER_DIR = env["HOME"];
const YUZU_CONFIG_PATH = pathJoin(USER_DIR, ".config", "yuzu", "qt-config.ini");

export async function getYuzuInstallDirs(warn = false){

	// Read config
	let dirs = [];
	
	// Read dolphin config file
	let configFileContents;
	try{
		configFileContents = await fsp.readFile(YUZU_CONFIG_PATH, "utf-8");
	} catch (error){
		if (warn) console.warn(`Unable to read yuzu config file : ${error}`);
		return dirs;
	}
	
	// Parse config file lines 
	const parsedConfig = config2obj(configFileContents);
	
	// Get number of paths
	if (typeof parsedConfig["UI"] === "undefined") { return dirs; }
	const nDirs = parseInt(parsedConfig["UI"].get("Paths\\gamedirs\\size"));
	
	// Get paths
	if (Number.isNaN(nDirs)){ return dirs; }
	for (let i = 1; i <= nDirs; i++){
		let recursive = String(parsedConfig["UI"].get(`Paths\\gamedirs\\${i}\\deep_scan`)).toLowerCase() === "true";
		let path       = parsedConfig["UI"].get(`Paths\\gamedirs\\${i}\\path`);
		if (typeof path === "undefined"){ continue; }
		dirs.push(new GameDir(path, recursive));
	}

	return dirs;

}

export async function getYuzuInstalledGames(dirs, warn = false){

	const GAME_FILES_REGEX = /.+\.(xci|nsp)/i;
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
			games.push(new YuzuGame(file, fileAbsPath));
		}

	}

	return games;

}
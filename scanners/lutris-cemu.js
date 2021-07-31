import { dirname as pathDirname, join as pathJoin } from "path";
import { Parser as XMLParser } from "xml2js";
import { CemuGame } from "../games.js";
import { promises as fsp } from "fs";
import { env } from "process";
import YAML from "yaml";

// ? Scan games for use through cemu in lutris

async function getCemuConfig(cemuExePath){

	const configDir = pathDirname(cemuExePath);
	const configFilePath = pathJoin(configDir, "settings.xml");
	const configFileContents = await fsp.readFile(configFilePath, "utf-8");
	const parser = new XMLParser();
	const config = await parser.parseStringPromise(configFileContents);

	// TODO validate config

	return config;

}

async function getCemuROMDirs(config){

	// Search into config for game directories

}

async function getCemuCachedROMs(config){

	// Search into config for cached games
	let games = [];

	const gameCacheEntry = config?.content?.GameCache?.[0]?.Entry;
	if (typeof gameCacheEntry !== "undefined"){
		for (let game of gameCacheEntry){
			let customName = game?.custom_name?.[0];
			let defaultName = game?.name?.[0];
			let path = game?.path?.[0];
			let name;
			for (let candidate of [customName, defaultName]){
				if (typeof candidate !== "string"){ continue; }
				candidate = candidate.trim();
				if (candidate.length > 0){
					name = candidate;
					break;
				}
			}
			if (
				typeof name !== "undefined" &&
				typeof path !== "undefined" 
			){
				games.push(new CemuGame(name, path));
			}
		}
	}

	return games;

}

async function getCemuROMs(dirs){

	// Scan cemu dirs
	throw "Not implemented";

}

export async function getCemuGames(cemuLutrisGame, scan = true, warn = false){

	// Read lutris config for cemu (to get cemu's exe path)
	const USER_DIR = env["HOME"];
	const lutrisConfigPath = pathJoin(USER_DIR, ".config", "lutris", "games", `${cemuLutrisGame.configPath}.yml`);
	let cemuExePath; 
	try {
		let lutrisConfigContents = await fsp.readFile(lutrisConfigPath, "utf-8");
		let parsedLutrisConfig = YAML.parse(lutrisConfigContents);
		cemuExePath = parsedLutrisConfig.game.exe;
	} catch (error) {
		if (warn) console.warn(`Unable to read lutris's game config file for cemu : ${error}`);
	}

	// Read cemu's config
	let config;
	if (typeof cemuExePath !== "undefined"){
		try {
			config = await getCemuConfig(cemuExePath);
		} catch (error){
			if (warn) console.warn(`Unable to read cemu config file : ${error}`);
		}
	}

	// If (scan) : scan cemu's game paths for games and ignore cemu's game cache
	// Else      : trust cemu's game cache
	let romGames = [];
	if (typeof config !== "undefined"){
		
		if (scan){
			
			// Get cemu's ROM dirs
			let romDirs
			try {
				romDirs = getCemuROMDirs(config);
			} catch (error){
				if (warn) console.warn(`Unable to get cemu ROM dirs : ${error}`);
			}

			// Scan ROMDirs for ROMs
			if (romDirs.length > 0){
				try {
					romGames = getCemuROMs(romDirs);
				} catch (error){
					if (warn) console.warn(`Unable to get cemu ROMs : ${error}`);
				}
			}

		} else {

			// Get cemu's cached ROM games
			try {
				romGames = getCemuCachedROMs(config);
			} catch (error){
				if (warn) console.warn(`Unable to get cemu cached ROMs : ${error}`);
			}

		}
	}

	return romGames;

}
import { parse as parseVDF} from "vdf-parser";
import { promises as fsp, existsSync } from "fs";
import { join as pathJoin } from "path";
import { env } from "process";
import { GameDir, SteamGame } from "../games.js";

const USER_DIR = env["HOME"];
const STEAM_INSTALL_DIRS_PATH =  pathJoin(USER_DIR, ".steam", "root", "config", "libraryfolders.vdf");
const STEAM_DEFAULT_INSTALL_DIR = pathJoin(USER_DIR, ".steam", "root");

export async function getSteamInstallDirs(warn = false){
	let dirs = [];

	// Read default steam install directory
	if (existsSync(STEAM_DEFAULT_INSTALL_DIR)){
		dirs.push(new GameDir(STEAM_DEFAULT_INSTALL_DIR));
	}

	// Read user specified steam install directories
	let parsedContents;
	try {
		let fileContents = await fsp.readFile(STEAM_INSTALL_DIRS_PATH, {encoding: "utf-8"});
		parsedContents = parseVDF(fileContents);
	} catch (error){
		if (warn) console.warn("Error during read of user specified install directories file.");
		return dirs;
	}
	const libraryfolders = parsedContents.libraryfolders;
	
	// Get library folder path
	if (libraryfolders){
		let keys = Object.keys(libraryfolders);
		for (let i = 0; i < keys.length-1; i++){
			dirs.push(new GameDir(libraryfolders[keys[i]].path));
		}
	}

	return dirs;
}

export async function getSteamInstalledGames(dirs, warn = false){
	
	const IGNORED_ENTRIES_REGEXES = [
		/^Steamworks.*/,
		/^(S|s)team ?(L|l)inux ?(R|r)untime.*/,
		/^Proton.*/
	];

	let games = [];

	for (let dir of dirs){

		// Get all games manifests of dir
		const manifestsDir = pathJoin(dir.path, "steamapps");
		let entries;
		try {
			entries = await fsp.readdir(manifestsDir);
		} catch (err) {
			if (warn) console.warn(`Skipping directory ${manifestsDir} (${err})`);
			continue;
		}
		let manifests = entries.filter(string=>string.startsWith("appmanifest_") && string.endsWith(".acf"));

		// Get info from manifests
		for (let manifest of manifests){

			let manifestPath = pathJoin(manifestsDir, manifest);
			let manifestContent = await fsp.readFile(manifestPath, {encoding: "utf-8"});
			let manifestParsedContent = parseVDF(manifestContent);
			let game = new SteamGame(manifestParsedContent?.AppState?.appid, manifestParsedContent?.AppState?.name, dir.path);

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
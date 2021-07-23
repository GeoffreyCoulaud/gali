import * as VDF from "vdf-parser";
import * as fs from "fs";
import * as path from "path";
import { SteamGame } from "../games.js";
const fsp = fs.promises;

const USER_DIR = process.env["HOME"];
const STEAM_INSTALL_DIRS_PATH =  path.join(USER_DIR, ".steam", "root", "config", "libraryfolders.vdf");
const STEAM_DEFAULT_INSTALL_DIR = path.join(USER_DIR, ".steam", "root");

function isundef(thing){
	return typeof thing === "undefined";
}

export async function getSteamInstallDirs(){
	let dirs = [];

	// Read default steam install directory
	if (fs.existsSync(STEAM_DEFAULT_INSTALL_DIR)){
		dirs.push(STEAM_DEFAULT_INSTALL_DIR);
	}

	// Read user specified steam install directories
	let parsedContents;
	try {
		let fileContents = await fsp.readFile(STEAM_INSTALL_DIRS_PATH, {encoding: "utf-8"});
		parsedContents = VDF.parse(fileContents);
	} catch (error){
		console.warn("Error during read of user specified install directories file.");
	}
	const libraryfolders = parsedContents.libraryfolders;
	
	// Get library folder path
	if (libraryfolders){
		let keys = Object.keys(libraryfolders);
		for (let i = 0; i < keys.length-1; i++){
			dirs.push(libraryfolders[keys[i]].path);
		}
	}

	return dirs;
}

export async function getSteamInstalledGames(dirs){
	
	const IS_VERBOSE = process.env.includes("--verbose");
	const IGNORED_ENTRIES_REGEXES = [
		/^Steamworks.*/,
		/^(S|s)team ?(L|l)inux ?(R|r)untime.*/,
		/^Proton.*/
	];

	let games = [];

	for (let dir of dirs){
		const manifestsDir = path.join(dir, "steamapps");
		let entries;
		try {
			entries = await fsp.readdir(manifestsDir);
		} catch (err) {
			if (IS_VERBOSE) console.warn(`Skipping directory ${manifestsDir} (${err})`);
			continue;
		}
		if (IS_VERBOSE) console.log(`Reading manifests in ${manifestsDir}`);
		let manifests = entries.filter(string=>string.startsWith("appmanifest_") && string.endsWith(".acf"));
		for (let manifest of manifests){
			let manifestPath = path.join(manifestsDir, manifest);
			let manifestContent = await fsp.readFile(manifestPath, {encoding: "utf-8"});
			let manifestParsedContent = VDF.parse(manifestContent);
			let game = new SteamGame(manifestParsedContent?.AppState?.appid, manifestParsedContent?.AppState?.name, dir);
			// Ignore some non-games entries
			let ignored = false;
			if (isundef(game.appId) || isundef(game.name)){
				ignored = true;
			} else {
				for (let regex of IGNORED_ENTRIES_REGEXES){
					if (game.name.match(regex)){
						ignored = true;
						break;
					}
				}
			}
			if (ignored){
				if (IS_VERBOSE) console.warn(`\tIgnored game ${game.toString()}`);
			} else {
				games.push(game);
			}
		}
	}
	
	return games;
}
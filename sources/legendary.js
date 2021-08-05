import { join as pathJoin } from "path";
import { promises as fsp } from "fs";
import { Game } from "./generic.js";
import { env } from "process";

export class LegendaryGame extends Game{
	source = "Legendary";
	constructor(appName, name){
		super(name);
		this.appName = appName;
	}
	toString(){
		return `${this.name} - ${this.source} - ${this.appName}`;
	}
}

async function getLegendaryInstalledGames(warn = false){

	// Read installed.json file
	const USER_DIR = env["HOME"];
	const INSTALLED_FILE_PATH = pathJoin(USER_DIR, ".config", "legendary", "installed.json");
	
	let installed;
	try {
		const fileContents = await fsp.readFile(INSTALLED_FILE_PATH, "utf-8");
		installed = JSON.parse(fileContents);
	} catch (error){
		if (warn) console.warn(`Unable to read legendary installed.json : ${error}`);
	}

	// Build games
	let installedGames = [];
	if (installed){
		for (let key of Object.keys(installed)){
			let gameData = installed[key];
			let game = new LegendaryGame(gameData?.app_name, gameData?.title);
			if (game.appName && game.name){
				installedGames.push(game);
			}
		}
	}

	return installedGames;
}

export async function getLegendaryGames(warn = false){

	// ? Add support for non-installed games ?

	return getLegendaryInstalledGames(warn);

}
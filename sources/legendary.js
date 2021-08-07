import { Game, GameProcessContainer } from "./common.js";
import { join as pathJoin } from "path";
import { promises as fsp } from "fs";
import { spawn } from "child_process";
import { env } from "process";

class LegendaryGameProcessContainer extends GameProcessContainer{
	constructor(appName){
		super();
		this.appName = appName;
	}
	// ! There is no way (AFAIK) to control a legendary game's life cycle from the launcher.
	// TODO Try to launch directly from wine
	start(offline = false){
		let args = ["launch", this.appName];
		if (offline) args.splice(1,0,"--offline");
		this.process = spawn("legendary", args);
		this._bindProcessEvents();
	}
	stop(){
		console.warn("Stopping legendary games is not supported");
		return false;
	}
	kill(){
		console.warn("Killing legendary games is not supported");
		return false;
	}
}

export class LegendaryGame extends Game{
	source = "Legendary";
	constructor(appName, name){
		super(name);
		this.appName = appName;
		this.processContainer = new LegendaryGameProcessContainer(this.appName);
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
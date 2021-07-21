import { LutrisGame } from "./games.js";
import { exec } from "child_process";
import * as util from "util";
const execp = util.promisify(exec);

export async function getLutrisInstalledGames(){
	let games = [];
	// Execute a command to get lutris games
	let stdout, stderr;
	try {
		const result = await execp("lutris --list-games --json");
		({stdout, stderr} = result);
	} catch (error) {
		console.error(err);
		console.error(stderr);
		return games;
	}
	// Parse gotten JSON
	let parsedStdout;
	try {
		parsedStdout = JSON.parse(stdout);
	} catch (err){
		console.error(`Error while parsing JSON : ${err}`);
		return games;
	}
	// Make game list
	for (let game of parsedStdout){
		games.push(new LutrisGame(game?.slug, game?.name, game?.directory, game?.id));
	}
	return games;
}

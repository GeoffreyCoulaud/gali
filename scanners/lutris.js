import { LutrisGame } from "../games.js";
import { exec } from "child_process";
import * as util from "util";
const execp = util.promisify(exec);

export async function getLutrisInstalledGames(){
	let games = [];
	
	// Execute a command to get lutris games
	let stdout, stderr;
	const COMMAND = "lutris --list-games --json";
	try {
		const result = await execp(COMMAND);
		({stdout, stderr} = result);
	} catch (error) {
		console.warn(`Error while executing ${COMMAND} : ${err}`);
		console.warn(stderr);
		return games;
	}
	
	// Parse output JSON
	let parsedStdout;
	try {
		parsedStdout = JSON.parse(stdout);
	} catch (err){
		console.warn(`Error while parsing lutris JSON : ${err}`);
		return games;
	}
	
	// Make game list
	for (let game of parsedStdout){
		games.push(new LutrisGame(game?.slug, game?.name, game?.directory, game?.id));
	}
	
	return games;
}

const { GameProcessContainer, NoCommandError, Game } = require("./common.js");
const { bragUserLocalData } = require("../utils/directories.js");
const { sync: commandExistsSync } = require("command-exists");
const { spawn, execFile } = require("child_process");
const { join: pathJoin } = require("path");
const { env } = require("process");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");

const USER_DIR = env["HOME"];
const LUTRIS_DB_PATH = pathJoin(USER_DIR, ".local/share/lutris/pga.db");

/**
 * A promise version of the child_process execFile
 */
function execFilePromise(command, args = [], options = {}){
	return new Promise((resolve, reject)=>{
		execFile(command, args, options, (error, stdout, stderr)=>{
			if (error) reject(error);
			else resolve(stdout, stderr);
		});
	});
}

/**
 * Get a start shell script for a lutris game
 * @param {string} gameSlug - The lutris game's slug for which to get a start script
 * @param {string} scriptBaseName - Name (with extension) for the output script file
 * @returns {string} - An absolute path to the script
 */
async function getLutrisGameStartScript(gameSlug, scriptBaseName = ""){

	
	// Get the start script from lutris
	const lutrisCommand = "lutris";
	if (!commandExistsSync(lutrisCommand)){
		throw new NoCommandError("No lutris command found");
	}
	
	// Store the script
	if (!scriptBaseName) scriptBaseName = `lutris-${gameSlug}.sh`;
	const scriptPath = pathJoin(bragUserLocalData, "start-scripts", scriptBaseName);
	await execFilePromise(lutrisCommand, [gameSlug, "--output-script", scriptPath]);

	return scriptPath;

}

/**
 * A wrapper for lutris game process management
 * @property {string} gameSlug - A lutris game slug, used to invoke lutris
 */
class LutrisGameProcessContainer extends GameProcessContainer{

	/**
	 * Create a lutris game process container
	 * @param {string} gameSlug - A lutris game slug
	 */
	constructor(gameSlug){
		super();
		this.gameSlug = gameSlug;
	}

	/**
	 * Start the game in a subprocess
	 */
	async start(){
		const scriptPath = await getLutrisGameStartScript(this.gameSlug);
		this.process = spawn(
			"sh",
			[scriptPath],
			this.constructor.defaultSpawnOptions
		);
		this._bindProcessEvents();
	}

}

/**
 * A class representing a Lutris game
 * @property {string} gameSlug - A lutris game slug
 * @property {string} configPath - The game's config path
 * @property {string} runner - The game's runner
 * @property {LutrisGameProcessContainer} processContainer - The game's process container
 */
class LutrisGame extends Game{

	static source = "Lutris";

	/**
	 * Create a lutris game
	 * @param {string} gameSlug - A lutris game slug
	 * @param {string} name - The game's displayed name
	 * @param {string} runner - The game's lutris runner
	 * @param {string} configPath - The games's config path
	 */
	constructor(gameSlug, name, runner, configPath){
		super(name);
		this.source = this.constructor.source;
		this.gameSlug = gameSlug;
		this.configPath = configPath;
		this.runner = runner;
		this.processContainer = new LutrisGameProcessContainer(this.gameSlug);
	}

	/**
	 * Create a string representation of the game
	 * @returns {string} - A string representing the game
	 */
	toString(){
		return `${this.name} - ${this.source} - ${this.gameSlug}`;
	}

}

/**
 * Get all lutris installed games from its SQLite database
 * @param {boolean} warn - Whether to display additional warnings
 * @returns {LutrisGame[]} - An array of found games
 */
async function getLutrisInstalledGames(warn = false){
	const games = [];

	// Open DB
	let db;
	try {
		db = await open({filename: LUTRIS_DB_PATH, driver: sqlite3.cached.Database});
	} catch(error){
		if (warn) console.warn(`Could not open lutris DB (${error})`);
		return games;
	}

	// Get games
	const DB_REQUEST = "SELECT name, slug, directory, configpath, runner FROM 'games' WHERE installed AND NOT hidden";
	const results = await db.all(DB_REQUEST);
	for (const row of results){
		// Validate every request row
		if (
			row.slug &&
			row.name &&
			row.directory &&
			row.configpath &&
			row.runner
		){
			games.push(new LutrisGame(row.slug, row.name, row.runner, row.configpath));
		}
	}

	return games;
}

/**
 * Get all lutris games
 * @param {boolean} warn - Whether to display additional warnings
 * @returns {LutrisGame[]} - A list of found games
 * @todo add support for non installed games
 */
async function getLutrisGames(warn = false){

	// ? Add support for non-installed games ?

	return getLutrisInstalledGames(warn);

}

module.exports = {
	LutrisGameProcessContainer,
	getLutrisGameStartScript,
	getLutrisGames,
	LutrisGame,
};
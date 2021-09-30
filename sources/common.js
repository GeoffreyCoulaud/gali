const { sync: commandExistsSync } = require("command-exists");
const { readdirAsync } = require("readdir-enhanced");
const { EventEmitter } = require("events");
const { join: pathJoin } = require("path");
const { kill } = require("process");

class NoCommandError extends Error{}
class NotImplementedError extends Error{}

/**
 * A wrapper for game process management
 * @property {string[]} commandOptions - Commands that the process can launch, favorite first
 * @property {ChildProcess|undefined} process - A reference to the game process
 * @property {boolean} isRunning - Whether the game is running or not
 * @fires GameProcessContainer#spawn - Fired when the subprocess has spawned successfuly
 * @fires GameProcessContainer#exit  - Fired on subprocess exit. Passes code and signal to the handler.
 * @fires GameProcessContainer#error - Fired on subprocess spawn/stop error. Passes error message to the handler. 
 * @abstract
 */
class GameProcessContainer extends EventEmitter{
	
	/**
	 * Default spawn options to pass to child_process.spawn
	 */
	static defaultSpawnOptions = {
		detached: true,
	}

	/**
	 * Spawn options to pass to child_process.spawn.
	 * Usually, spawn is followed by unref, this is to allow parent to exit 
	 * before the subprocess. 
	 */
	static doNotWaitSpawnOptions = {
		detached: true,
		stdio: "ignore",
	}

	commandOptions = [];
	process = undefined;
	isRunning = false;

	/**
	 * Select a command from the command options.
	 * @throws {NoCommandError} on no available command found on the system
	 * @returns {string} The best command found in options
	 * @access protected
	 */
	_selectCommand(){
		let command;
		for (const option of this.commandOptions){
			if (commandExistsSync(option)){
				command = option;
				break;
			}
		}
		if (typeof command === "undefined"){
			throw new NoCommandError("No command found");
		} else {
			return command;
		}
	}

	/**
	 * Update isRunning on process events and bubble these events up.
	 * @access protected
	 */
	_bindProcessEvents(){
		this.process.on("spawn", ()=>{
			this.isRunning = true;
			this.emit("spawn");
		});
		this.process.on("error", (error)=>{
			this.isRunning = false;
			this.emit("error", error);
		});
		this.process.on("exit", (code, signal)=>{
			this.isRunning = false;
			this.emit("exit", code, signal);
		});
	}

	/**
	 * Send a signal to the game's subprocess
	 * @param {string} signal - kill signal to send to the game's subprocess 
	 * @param {boolean} wholeGroup - Whether to send the signal to the process PID only or also to its group
	 * @returns {boolean} - True on success, else false
	 */
	sendSignal(signal, wholeGroup = false){
		if (!this.process.pid){
			console.error(`Could not signal ${this.process.pid}${wholeGroup?"(group)":""} ${signal}`);
			return false;
		}
		try {
			let pidToKill = this.process.pid;
			if (wholeGroup) pidToKill *= -1; // negative PID means send to all process in group
			kill(pidToKill, signal);
		} catch (error){
			console.error(`Error while signaling ${this.process.pid}${wholeGroup?" (group)":""} ${signal} : ${error}`);
			return false;
		}
		return true;
	}
	
	/**
	 * Start the game in a subprocess.
	 * @throws {NoCommandError} - Can throw in case no known command was found to start the game.
	 * @abstract
	 */
	async start(){}

	/**
	 * Send the SIGKILL signal to the game's subprocess.
	 * Will do nothing if the game is not running.
	 * @returns {boolean} True on success, else false
	 */
	kill(){
		if (!this.isRunning){ return true; }
		const hasKilled = this.sendSignal("SIGKILL", true);
		if (hasKilled) this.isRunning = false;
		return hasKilled;
		
	}
	
	/**
	 * Send the SIGTERM signal to the game's subprocess.
	 * Will do nothing if the game is not running.
	 * @returns {boolean} True on success, else false
	 */
	stop(){
		if (!this.isRunning){ return true; }
		const hasStopped = this.sendSignal("SIGTERM", true);
		if (hasStopped) this.isRunning = false;
		return hasStopped;
	}

}

/**
 * A wrapper for game process management that doesn't handle stop and kill actions
 * @property {ChildProcess|undefined} process - A reference to the game process
 * @property {boolean} isRunning - Whether the game is running or not
 * @fires GameProcessContainer#spawn - Fired when the subprocess has spawned successfuly
 * @fires GameProcessContainer#exit  - Fired on subprocess exit. Passes code and signal to the handler.
 * @fires GameProcessContainer#error - Fired on subprocess spawn/stop error. Passes error message to the handler. 
 * @abstract
 */
class StartOnlyGameProcessContainer extends GameProcessContainer{

	static defaultSpawnOptions = GameProcessContainer.doNotWaitSpawnOptions;

	/**
	 * Overwrite the inherited stop method to neutralize it
	 * @returns {boolean} - Always false
	 */
	stop(){
		console.warn(`${this.constructor} does not implement stopping`);
		return false;
	}

	/**
	 * Overwrite the inherited kill method to neutralize it
	 * @returns {boolean} - Always false
	 */
	kill(){
		console.warn(`${this.constructor} does not implement killing`);
		return false;
	}

}

/**
 * Class representing a game directory
 */
 class GameDir {
	/**
	 * Create a game directory
	 * @param {string} path - The local path corresponding to the directory 
	 * @param {boolean} recursive - Whether to search games into the directory subdirs 
	 */
	constructor(path, recursive = false) {
		this.path = path;
		this.recursive = recursive;
	}
}

/**
 * Class representing a generic game.
 * You're not supposed to use it directly, instead use a descendent of this class. 
 * 
 * @property {string} source - The games's provenance in the system
 * @property {string} name - The game's displayed (localized) name
 * @property {string} platform - The game's original platform
 * @property {boolean} isInstalled - Whether the game is currently installed or not 
 * @property {string} boxArtImage - URI to the game's box art
 * @property {string} coverImage - URI to the game's cover
 * @property {string} iconImage - URI to the game's icon
 * 
 * @abstract
 */
class Game{
	
	// Game metadata props
	source = undefined;
	name = undefined;
	platform = undefined;
	isInstalled = true;
	
	// Images props
	boxArtImage = undefined; 
	coverImage = undefined;
	iconImage = undefined;

	// Game lifecycle
	processContainer = undefined;
	
	/**
	 * Create a game
	 * @param {string} name - The game's display name 
	 */
	constructor(name){
		this.name = name;
	}
}

/**
 * Class representing an emulated game.
 * You're not supposed to use it directly, instead use a descendent of this class.
 * 
 * @property {string} path - The game's path to be started with an emulator
 * 
 * @abstract
 */
class EmulatedGame extends Game{
	/**
	 * Create an emulated game
	 * @param {string} name - The game's displayed name 
	 * @param {string} path - The game's path
	 */
	constructor(name, path){
		super(name);
		this.path = path;
	}

	/**
	 * Get a string representing the game
	 * @returns {string} - A string representing the game
	 */
	toString(){
		return `${this.name} - ${this.source} (${this.platform})`;
	}
}

/**
 * Get the ROMs (emulation games) inside of some game dirs
 * @param {GameDir} dirs - The game dirs to scan
 * @param {RegExp} filesRegex - The regular expression to match rom files against 
 * @param {boolean} warn - Whether to display additional warnings 
 * @returns {string[]} - A list of path to game ROMs 
 */
async function getROMs(dirs, filesRegex, warn = false){
	let paths = [];

	// Get roms
	for (let dir of dirs){
		
		// Get all the files in dir recursively
		let filePaths;
		try {
			filePaths = await readdirAsync(dir.path, {filter: filesRegex, deep: dir.recursive});
		} catch (error){
			if (warn) console.warn(`Skipping directory ${dir.path} (${error})`);
			continue;
		}

		// Add games
		for (let file of filePaths){
			let fileAbsPath = pathJoin(dir.path, file);
			paths.push(fileAbsPath);
		}

	}

	return paths;

}

/**
 * A class representing a source of games.
 * This is not supposed to be used directly, use one of the derived classes.
 * @property {string} name - The displayed name for this source
 * @property {Class} gameClass - The class for games of this source
 * @property {boolean} preferCache - Whether the source should prefer cached options when scanning
 * @abstract
 */
class Source{

	gameClass = undefined;
	preferCache = false;
	name = undefined;

	/**
	 * Scan for games of this class.
	 * @param {boolean} warn - Whether to display additional warnings
	 * @returns {Game[]} - An array of found games
	 * @virtual
	 * @async
	 */
	async scan(warn = false){}

}

module.exports = {
	StartOnlyGameProcessContainer,
	GameProcessContainer,
	NotImplementedError,
	NoCommandError,
	EmulatedGame,
	GameDir,
	getROMs,
	Source,
	Game,
};
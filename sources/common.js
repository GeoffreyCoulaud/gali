import { readdirAsync } from "readdir-enhanced";
import { join as pathJoin } from "path";
import { EventEmitter } from "events";
import { kill } from "process";

export class NoCommandError extends Error{}

/**
 * A wrapper for game process management
 * @property {ChildProcess|undefined} process - A reference to the game process
 * @property {boolean} isRunning - Whether the game is running or not
 * @fires GameProcessContainer#spawn - Fired when the subprocess has spawned successfuly
 * @fires GameProcessContainer#exit  - Fired on subprocess exit. Passes code and signal to the handler.
 * @fires GameProcessContainer#error - Fired on subprocess spawn/stop error. Passes error message to the handler. 
 */
export class GameProcessContainer extends EventEmitter{
	
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

	process = undefined;
	isRunning = false;

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
	start(){}

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

export class StartOnlyGameProcessContainer extends GameProcessContainer{

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
 * Class representing a generic game.
 * You're not supposed to use it directly, instead use a descendent of this class. 
 */
export class Game{
	source = "Unknown";
	
	processContainer = new GameProcessContainer();
	isRunning = false;
	
	/**
	 * Create a game
	 * @param {string} name - The game's display name 
	 */
	constructor(name){
		this.name = name;
	}
}

/**
 * Class representing a game directory
 */
export class GameDir {
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
 * Class representing an emulated game.
 * You're not supposed to use it directly, instead use a descendent of this class.
 */
export class EmulatedGame extends Game{
	/**
	 * Create an emulated game
	 * @param {string} name - The game's displayed name 
	 * @param {string} path - The game's path
	 * @param {string} source - The game's source, generally the emulator's name 
	 * @param {string} console - The game's original console
	 */
	constructor(name, path, source = "Unknown", console = "Unknown"){
		super(name);
		this.path = path;
		this.source = source;
		this.console = console;
	}

	/**
	 * Get a string representing the game
	 * @returns {string} - A string representing the game
	 */
	toString(){
		return `${this.name} - ${this.source} (${this.console})`;
	}
}

/**
 * Get the ROMs (emulation games) inside of some game dirs
 * @param {GameDir} dirs - The game dirs to scan
 * @param {RegExp} filesRegex - The regular expression to match rom files against 
 * @param {boolean} warn - Whether to display additional warnings 
 * @returns {string[]} - A list of path to game ROMs 
 */
export async function getROMs(dirs, filesRegex, warn = false){
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
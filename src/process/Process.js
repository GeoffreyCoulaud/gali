const process = require("process");
const events = require("events");

const NoCommandError = require("../NoCommandError.js");
const commandExists = require("../utils/commandExists.js");

/**
 * A wrapper for game process management
 * @property {string[]} commandOptions - Commands that the process can launch, favorite first
 * @property {ChildProcess|undefined} process - A reference to the game process
 * @property {boolean} isRunning - Whether the game is running or not
 * @fires Process#spawn - Fired when the subprocess has spawned successfuly
 * @fires Process#exit  - Fired on subprocess exit. Passes code and signal to the handler.
 * @fires Process#error - Fired on subprocess spawn/stop error. Passes error message to the handler.
 * @abstract
 */
class Process extends events.EventEmitter {

	/**
	 * Default spawn options to pass to child_process.spawn
	 */
	static defaultSpawnOptions = {
		detached: true,
	};

	commandOptions = [];
	process = undefined;
	isRunning = false;
	isKillable = true;
	isStoppable = true;

	/**
	 * Select a command from the command options.
	 * @throws {NoCommandError} on no available command found on the system
	 * @returns {string} The best command found in options
	 * @access protected
	 */
	async _selectCommand() {
		let command;
		for (const option of this.commandOptions) {
			if (await commandExists(option)) {
				command = option;
				break;
			}
		}
		if (typeof command === "undefined") {
			throw new NoCommandError("No command found");
		} else {
			return command;
		}
	}

	/**
	 * Update isRunning on process events and bubble these events up.
	 * @access protected
	 */
	_bindProcessEvents() {
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
	sendSignal(signal, wholeGroup = false) {
		if (!this.process.pid) {
			console.error(`Could not signal ${this.process.pid}${wholeGroup ? "(group)" : ""} ${signal}`);
			return false;
		}
		try {
			let pidToKill = this.process.pid;
			if (wholeGroup){
				pidToKill *= -1; // negative PID means send to all process in group
			}
			process.kill(pidToKill, signal);
		} catch (error) {
			console.error(`Error while signaling ${this.process.pid}${wholeGroup ? " (group)" : ""} ${signal} : ${error}`);
			return false;
		}
		return true;
	}

	/**
	 * Start the game in a subprocess.
	 * @throws {NoCommandError} - Can throw in case no known command was found to start the game.
	 * @abstract
	 */
	async start() { }

	/**
	 * Send the SIGKILL signal to the game's subprocess.
	 * Will do nothing if the game is not running.
	 * @returns {boolean} True on success, else false
	 */
	kill() {
		if (!this.isRunning) { return true; }
		const hasKilled = this.sendSignal("SIGKILL", true);
		if (hasKilled){
			this.isRunning = false;
		}
		return hasKilled;
	}

	/**
	 * Send the SIGTERM signal to the game's subprocess.
	 * Will do nothing if the game is not running.
	 * @returns {boolean} True on success, else false
	 */
	stop() {
		if (!this.isRunning) { return true; }
		const hasStopped = this.sendSignal("SIGTERM", true);
		if (hasStopped){
			this.isRunning = false;
		}
		return hasStopped;
	}

}

module.exports = Process;
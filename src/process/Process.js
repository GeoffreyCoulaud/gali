const child_process = require("child_process");
const process = require("process");
const events = require("events");

/**
 * A wrapper for game process management
 * @property {string} command - The command that will be used for the game startup
 * @property {object} spawnOptions - The child process spawn options
 * @property {ChildProcess|undefined} process - A reference to the game process
 * @property {boolean} isRunning - Whether the game is running or not
 * @property {boolean} isKillable - Whether the game is killable
 * @property {boolean} isStoppable - Whether the game is stoppable
 * @fires Process#spawn - Fired when the subprocess has spawned successfuly
 * @fires Process#exit  - Fired on subprocess exit. Passes code and signal to the handler.
 * @fires Process#error - Fired on subprocess spawn/stop error. Passes error message to the handler.
 * @abstract
 */
class Process extends events.EventEmitter {

	command      = undefined;
	args         = [];
	spawnOptions = { detached: true };

	process      = undefined;
	isRunning    = false;
	isKillable   = true;
	isStoppable  = true;

	/**
	 * Update isRunning on process events and bubble these events up.
	 * @access protected
	 */
	_bindProcessEvents () {
		this.process.on("spawn", (...args)=>{
			this.isRunning = true;
			this.emit("spawn", ...args);
		});
		this.process.on("error", (...args)=>{
			this.isRunning = false;
			this.emit("error", ...args);
		});
		this.process.on("exit", (...args)=>{
			this.isRunning = false;
			this.emit("exit", ...args);
		});
	}

	/**
	 * Send a signal to the game's subprocess
	 * @param {string} signal - kill signal to send to the game's subprocess
	 * @param {boolean} wholeGroup - Whether to send the signal to the process PID only or also to its group
	 * @returns {boolean} - True on success, else false
	 */
	sendSignal (signal, wholeGroup = false) {
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
	 */
	async start() {
		
		// Spawn a child process
		this.process = child_process.spawn(
			this.command,
			this.args,
			this.spawnOptions
		);

		// If we can't control it, don't wait for it
		if (
			!this.isStoppable && 
			!this.isKillable
		){
			this.process.unref();
		}

		// Bind events emitted by subprocess to this
		this._bindProcessEvents();

		return;
	}

	/**
	 * Send the SIGKILL signal to the game's subprocess.
	 * Will do nothing if the game is not running.
	 * @returns {boolean} True on success, else false
	 */
	kill () {
		if (!this.isKillable) {
			console.warn(`${this.constructor.name} can't be killed`);
			return false;
		}
		if (!this.isRunning) {
			return true;
		}
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
	stop () {
		if (!this.isStoppable) {
			console.warn(`${this.constructor.name} can't be stopped`);
			return false;
		}
		if (!this.isRunning) {
			return true;
		}
		const hasStopped = this.sendSignal("SIGTERM", true);
		if (hasStopped){
			this.isRunning = false;
		}
		return hasStopped;
	}

}

module.exports = Process;
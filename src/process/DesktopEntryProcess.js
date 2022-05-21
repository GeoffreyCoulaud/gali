const child_process = require("child_process");

const xdg = require("../utils/xdg.js");

const Process = require("./Process.js");

/**
 * A wrapper for desktop entry game process management
 * @property {string} exec - The exec value of the desktop entry file,
 *                           used to start the game in a subprocess.
 */
class DesktopEntryProcess extends Process {

	/**
	 * Create a desktop entry game process container
	 * @param {string} exec - The desktop entry's exec field value
	 */
	constructor(exec) {
		super();
		this.spawnArgs = xdg.splitDesktopExec(exec);
		this.spawnCommand = this.spawnArgs.shift();
	}

	/**
	 * Start the game in a subprocess.
	 * The exec value of the desktop entry will be used, this is litteraly
	 * arbitrary code execution, beware !
	 */
	async start() {
		this.process = child_process.spawn(
			this.spawnCommand,
			this.spawnArgs,
			this.spawnOptions
		);
		this._bindProcessEvents();
		return;
	}

}

module.exports = DesktopEntryProcess;
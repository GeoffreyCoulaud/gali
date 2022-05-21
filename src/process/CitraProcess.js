const child_process = require("child_process");

const Process = require("./Process.js");

/**
 * A wrapper for citra game process management
 * @property {string} romPath - The game's ROM path, used to invoke citra
 */
class CitraProcess extends Process {

	command = "citra-qt";

	/**
	 * Create a citra game process container
	 * @param {string} romPath - The game's ROM path
	 */
	constructor(romPath) {
		super();
		this.romPath = romPath;
	}

	/**
	 * Start the game in a subprocess
	 */
	async start() {
		this.process = child_process.spawn(
			this.command,
			[this.romPath],
			this.spawnOptions
		);
		this._bindProcessEvents();
		return;
	}

}

module.exports = CitraProcess;
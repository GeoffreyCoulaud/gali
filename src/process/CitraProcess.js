const child_process = require("child_process");

const Process = require("./Process.js");

/**
 * A wrapper for citra game process management
 * @property {string} romPath - The game's ROM path, used to invoke citra
 */
class CitraProcess extends Process {

	commandOptions = ["citra", "citra-qt"];

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
		const command = await this._selectCommand();
		this.process = child_process.spawn(
			command,
			[this.romPath],
			this.constructor.defaultSpawnOptions
		);
		this._bindProcessEvents();
		return;
	}

}

module.exports = CitraProcess;
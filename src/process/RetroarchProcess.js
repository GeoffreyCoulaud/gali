const child_process = require("child_process");

const Process = require("./Process.js");

/**
 * A wrapper for retroarch game process management
 * @property {string} romPath - The game's ROM path, used to invoke retroarch
 * @property {string} corePath - The games's libretro core path, used to invoke retroarch
 */
class RetroarchProcess extends Process {

	command = "retroarch";

	/**
	 * Create a retroarch game process container
	 * @param {string} romPath The game's ROM path
	 * @param {string} corePath The game's libretro core path
	 */
	constructor(romPath, corePath) {
		super();
		this.romPath = romPath;
		this.corePath = corePath;
	}

	/**
	 * Start the game in a subprocess
	 */
	async start() {
		this.process = child_process.spawn(
			this.command,
			["--libretro", this.corePath, this.romPath],
			this.spawnOptions
		);
		this._bindProcessEvents();
		return;
	}
}

module.exports = RetroarchProcess;
const child_process = require("child_process");

const Process = require("./Process.js");

/**
 * A wrapper for dolphin game management
 * @property {string} romPath - The game's ROM path, used to invoke dolphin
 */
class DolphinProcess extends Process {

	commandOptions = ["dolphin-emu"];

	/**
	 * Create a dolphin game process container.
	 * @param {string} romPath - The game's ROM path
	 */
	constructor(romPath) {
		super();
		this.romPath = romPath;
	}

	/**
	 * Start the game in a subprocess
	 * @param {boolean} noUi - Whether to show dolphin's UI or only the game
	 */
	async start(noUi = false) {
		const command = await this._selectCommand();
		const args = ["-e", this.romPath];
		if (noUi){
			args.splice(0, 0, "-b");
		}
		this.process = child_process.spawn(
			command,
			args,
			this.constructor.defaultSpawnOptions
		);
		this._bindProcessEvents();
		return;
	}
}

module.exports = DolphinProcess;
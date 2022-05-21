const child_process = require("child_process");

const StartOnlyProcess = require("./StartOnlyProcess.js");

/**
 * A wrapper for legendary game process management.
 * Doesn't support stop and kill !
 * @property {string} appName - The epic games store app name, used to start the game
 */
class HeroicProcess extends StartOnlyProcess {

	command = "xdg-open";

	/**
	 * Create a legendary game process container
	 * @param {string} appName - The epic games store app name
	 */
	constructor(appName) {
		super();
		this.appName = appName;
	}

	/**
	 * Start the game in a subprocess
	 */
	async start() {
		const args = [`heroic://launch/${this.appName}`];
		this.process = child_process.spawn(
			this.command,
			args,
			this.spawnOptions
		);
		this.process.unref();
		this._bindProcessEvents();
		return;
	}

}

module.exports = HeroicProcess;
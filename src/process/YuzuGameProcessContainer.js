const child_process = require("child_process");

const { GameProcessContainer } = require("./GameProcessContainer.js");

/**
 * A wrapper for yuzu game process management
 * @property {string} romPath - The game's ROM path, used to invoke yuzu
 */
class YuzuGameProcessContainer extends GameProcessContainer {

	commandOptions = ["yuzu"];

	/**
	 * Create a yuzu game process container
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

	/**
	 * Overwrite the inherited stop method to equal the inherited kill method.
	 * This is done because yuzu seems to trap SIGTERM and needs to get SIGKILL to terminate.
	 * @returns {boolean} - True on success, else false
	 */
	stop() {
		// For yuzu, SIGTERM doesn't work, use SIGKILL instead.
		return this.kill();
	}
}

module.exports = {
	YuzuGameProcessContainer
};
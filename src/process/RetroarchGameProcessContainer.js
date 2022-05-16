const child_process = require("child_process");

const { GameProcessContainer } = require("./GameProcessContainer.js");

/**
 * A wrapper for retroarch game process management
 * @property {string} romPath - The game's ROM path, used to invoke retroarch
 * @property {string} corePath - The games's libretro core path, used to invoke retroarch
 */
class RetroarchGameProcessContainer extends GameProcessContainer {

	commandOptions = ["retroarch"];

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
		const command = await this._selectCommand();
		this.process = child_process.spawn(
			command,
			["--libretro", this.corePath, this.romPath],
			this.constructor.defaultSpawnOptions
		);
		this._bindProcessEvents();
		return;
	}
}

module.exports = {
	RetroarchGameProcessContainer
};
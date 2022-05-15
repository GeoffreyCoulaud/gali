const { EmulationGame } = require("./EmulationGame.js");

/**
 * A class representing a retroarch game
 * @property {string} corePath - The game's libretro core path
 * @property {RetroarchGameProcessContainer} processContainer - The game's process container
 */
class RetroarchGame extends EmulationGame {

	/**
	 * Create a retroarch game
	 * @param {string} name - The game's displayed name
	 * @param {string} path - The game's ROM path
	 * @param {string} corePath - The game's libretro core path
	 * @param {string} platform - The game's original platform
	 * @param {boolean} isInstalled - Whether the game is installed (found on disk)
	 */
	constructor(name, path, corePath, platform, isInstalled = false) {
		super(name, path);
		this.platform = platform;
		this.corePath = corePath;
		this.isInstalled = isInstalled;
	}

}

module.exports = {
	RetroarchGame
};
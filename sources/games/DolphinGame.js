const { EmulationGame } = require("./EmulationGame.js");

/**
 * Class representing a dolphin game
 * @property {DolphinGameProcessContainer} processContainer - The game's process container
 */
class DolphinGame extends EmulationGame {

	platform = "Nintendo - Wii / GameCube";

	/**
	 * Create a dolphin game
	 * @param {string} name - The game's displayed name
	 * @param {string} path - The game's ROM path
	 */
	constructor(name, path) {
		super(name, path);
	}
}

module.exports = {
	DolphinGame
};
const { EmulationGame } = require("./EmulationGame.js");

/**
 * A class representing a ppsspp game
 * @property {PPSSPPGameProcessContainer} processContainer - The game's process container
 */
class PPSSPPGame extends EmulationGame {

	platform = "Sony - PlayStation Portable";

	/**
	 * Create a ppsspp game
	 * @param {string} name - The game's displayed name
	 * @param {string} path - The games' ROM path
	 */
	constructor(name, path) {
		super(name, path);
	}
}

module.exports = {
	PPSSPPGame
};
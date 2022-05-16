const { SwitchEmulationGame } = require("./SwitchEmulationGame.js");

/**
 * A class representing a yuzu game
 * @property {YuzuGameProcessContainer} processContainer - The game's process container
 */
class YuzuGame extends SwitchEmulationGame {

	/**
	 * Create a yuzu game
	 * @param {string} name - The game's displayed name
	 * @param {string} path - The game's ROM path
	 */
	constructor(name, path) {
		super(name, path);
	}
}

module.exports = {
	YuzuGame
};
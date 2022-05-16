const { SwitchEmulationGame } = require("./SwitchEmulationGame.js");
const { YuzuProcess } = require("../process/YuzuProcess.js");

class YuzuGame extends SwitchEmulationGame {

	static processClass = YuzuProcess;

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
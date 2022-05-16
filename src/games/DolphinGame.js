const { EmulationGame } = require("./EmulationGame.js");
const { DolphinProcess } = require("../process/DolphinProcess.js");

class DolphinGame extends EmulationGame {
	
	static processClass = DolphinProcess;

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
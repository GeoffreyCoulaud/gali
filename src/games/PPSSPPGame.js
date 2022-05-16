const { EmulationGame } = require("./EmulationGame.js");
const { PPSSPPProcess } = require("../process/PPSSPPProcess.js");

class PPSSPPGame extends EmulationGame {

	static processClass = PPSSPPProcess;
	
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
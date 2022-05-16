const { EmulationGame } = require("./EmulationGame.js");

/**
 * Represents a Citra (Nintendo 3DS emulator) game
 * @property {string} name - The game's displayed name
 * @property {string} path - The game's ROM path
 * @property {CitraGameProcessContainer} processContainer - The game's process container
 */
class CitraGame extends EmulationGame{

	platform = "Nintendo - 3DS";

	/**
	 * Creat a citra game
	 * @param {string} name - The game's displayed name
	 * @param {string} path - The game's ROM path
	 */
	constructor(name, path){
		super(name, path);
	}
}

module.exports = {
	CitraGame,
};
const { EmulationGame } = require("./EmulationGame.js");
const { CitraProcess } = require("../process/CitraProcess.js");

class CitraGame extends EmulationGame{

	static processClass = CitraProcess;
	
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
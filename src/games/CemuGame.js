const { WiiUEmulationGame } = require("./WiiUEmulationGame.js");

/**
 * A class representing a cemu (in lutris) game
 */
class CemuGame extends WiiUEmulationGame{
	constructor(name, path){
		super(name, path);
	}
}

module.exports = {
	CemuGame
};
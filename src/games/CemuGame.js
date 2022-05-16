const WiiUEmulationGame = require("./WiiUEmulationGame.js");
const CemuProcess = require("../process/CemuProcess.js");

class CemuGame extends WiiUEmulationGame{

	static processClass = CemuProcess;

	constructor(name, path){
		super(name, path);
	}
}

module.exports = CemuGame;
const { RetroarchGame } = require("./RetroarchGame.js");
const { RetroarchFlatpakProcess } = require("../process/RetroarchFlatpakProcess.js");

class RetroarchFlatpakGame extends RetroarchGame{

	static processClass = RetroarchFlatpakProcess;

}

module.exports = {
	RetroarchFlatpakGame
};
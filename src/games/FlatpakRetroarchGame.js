const { RetroarchGame } = require("./RetroarchGame.js");
const { FlatpakRetroarchProcess } = require("../process/FlatpakRetroarchProcess.js");

class FlatpakRetroarchGame extends RetroarchGame{

	static processClass = FlatpakRetroarchProcess;

}

module.exports = {
	FlatpakRetroarchGame
};
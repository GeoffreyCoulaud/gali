const { CitraGame } = require("./CitraGame.js");
const { FlatpakCitraProcess } = require("../process/FlatpakCitraProcess.js");

class FlatpakCitraGame extends CitraGame{

	static processClass = FlatpakCitraProcess;

}

module.exports = {
	FlatpakCitraGame
};
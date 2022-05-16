const { CitraGame } = require("./CitraGame.js");
const { CitraFlatpakProcess } = require("../process/CitraFlatpakProcess.js");

class CitraFlatpakGame extends CitraGame{

	static processClass = CitraFlatpakProcess;

}

module.exports = {
	CitraFlatpakGame
};
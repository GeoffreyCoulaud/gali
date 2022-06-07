const DolphinGame = require("./DolphinGame.js");
const DolphinFlatpakProcess = require("../process/DolphinFlatpakProcess.js");

class DolphinFlatpakGame extends DolphinGame{

	static processClass = DolphinFlatpakProcess;

}

module.exports = DolphinFlatpakGame;
const { DolphinGame } = require("./DolphinGame.js");
const { FlatpakDolphinProcess } = require("../process/FlatpakDolphinProcess.js");

class FlatpakDolphinGame extends DolphinGame{

	static processClass = FlatpakDolphinProcess;

}

module.exports = {
	FlatpakDolphinGame
};
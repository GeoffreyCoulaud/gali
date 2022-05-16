const { PPSSPPGame } = require("./PPSSPPGame.js");
const { FlatpakPPSSPPProcess } = require("../process/FlatpakPPSSPPProcess.js");

class FlatpakPPSSPPGame extends PPSSPPGame{

	static processClass = FlatpakPPSSPPProcess;

}

module.exports = {
	FlatpakPPSSPPGame
};
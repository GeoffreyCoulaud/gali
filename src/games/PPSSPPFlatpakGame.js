const { PPSSPPGame } = require("./PPSSPPGame.js");
const { PPSSPPFlatpakProcess } = require("../process/PPSSPPFlatpakProcess.js");

class PPSSPPFlatpakGame extends PPSSPPGame{

	static processClass = PPSSPPFlatpakProcess;

}

module.exports = {
	PPSSPPFlatpakGame
};
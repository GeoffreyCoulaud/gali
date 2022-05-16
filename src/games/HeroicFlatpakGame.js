const { HeroicGame } = require("./HeroicGame.js");
const { HeroicFlatpakProcess } = require("../process/HeroicFlatpakProcess.js");

class HeroicFlatpakGame extends HeroicGame{

	static processClass = HeroicFlatpakProcess;

}

module.exports = {
	HeroicFlatpakGame
};
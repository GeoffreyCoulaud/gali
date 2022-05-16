const { HeroicGame } = require("./HeroicGame.js");
const { FlatpakHeroicProcess } = require("../process/FlatpakHeroicProcess.js");

class FlatpakHeroicGame extends HeroicGame{

	static processClass = FlatpakHeroicProcess;

}

module.exports = {
	FlatpakHeroicGame
};
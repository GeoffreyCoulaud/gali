const { YuzuGame } = require("./YuzuGame.js");
const { FlatpakYuzuProcess } = require("../process/FlatpakYuzuProcess.js");

class FlatpakYuzuGame extends YuzuGame{

	static processClass = FlatpakYuzuProcess;

}

module.exports = {
	FlatpakYuzuGame
};
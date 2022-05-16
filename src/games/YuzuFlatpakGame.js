const { YuzuGame } = require("./YuzuGame.js");
const { YuzuFlatpakProcess } = require("../process/YuzuFlatpakProcess.js");

class YuzuFlatpakGame extends YuzuGame{

	static processClass = YuzuFlatpakProcess;

}

module.exports = {
	YuzuFlatpakGame
};
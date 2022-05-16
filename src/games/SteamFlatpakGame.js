const { SteamGame } = require("./SteamGame.js");
const { SteamFlatpakProcess } = require("../process/SteamFlatpakProcess.js");

class SteamFlatpakGame extends SteamGame{

	static processClass = SteamFlatpakProcess;

}

module.exports = {
	SteamFlatpakGame
};
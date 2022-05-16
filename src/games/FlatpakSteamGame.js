const { SteamGame } = require("./SteamGame.js");
const { FlatpakSteamProcess } = require("../process/FlatpakSteamProcess.js");

class FlatpakSteamGame extends SteamGame{

	static processClass = FlatpakSteamProcess;

}

module.exports = {
	FlatpakSteamGame
};
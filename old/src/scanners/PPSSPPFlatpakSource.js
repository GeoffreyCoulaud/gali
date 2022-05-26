const PPSSPPSource = require("./PPSSPPSource.js");
const PPSSPPFlatpakGame = require("../games/PPSSPPFlatpakGame.js");

const USER_DIR = process.env["HOME"];

class PPSSPPFlatpakSource extends PPSSPPSource{

	static name = "PPSSPP (Flatpak)";
	static gameClass = PPSSPPFlatpakGame;

	configPath = `${USER_DIR}/.var/app/org.ppsspp.PPSSPP/config/ppsspp/PSP/SYSTEM/ppsspp.ini`;

}

module.exports = PPSSPPFlatpakSource;
const DolphinSource = require("./DolphinSource.js");
const DolphinFlatpakGame = require("../games/DolphinFlatpakGame.js");

const USER_DIR = process.env["HOME"];

class DolphinFlatpakSource extends DolphinSource{

	static name = "Dolphin (Flatpak)";
	static gameClass = DolphinFlatpakGame;

	configPath = `${USER_DIR}/.var/app/org.DolphinEmu.dolphin-emu/config/dolphin-emu/Dolphin.ini`;

}

module.exports = DolphinFlatpakSource;
const CitraSource = require("./CitraSource.js");
const CitraFlatpakGame = require("../games/CitraFlatpakGame.js");

const USER_DIR = process.env["HOME"];

class CitraFlatpakSource extends CitraSource{

	static name = "Citra (Flatpak)";
	static gameClass = CitraFlatpakGame;

	configPath = `${USER_DIR}/.var/app/org.citra_emu.citra/config/citra-emu/qt-config.ini`;

}

module.exports = CitraFlatpakSource;
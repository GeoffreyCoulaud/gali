const { CitraSource } = require("./CitraSource.js");
const { FlatpakCitraGame } = require("../games/FlatpakCitraGame.js");

const USER_DIR = process.env["HOME"];

class FlatpakCitraSource extends CitraSource{

	static name = "Citra (Flatpak)";
	static gameClass = FlatpakCitraGame;

	configPath = `${USER_DIR}/.var/app/org.citra_emu.citra/config/citra-emu/qt-config.ini`;

}

module.exports = {
	FlatpakCitraSource
};
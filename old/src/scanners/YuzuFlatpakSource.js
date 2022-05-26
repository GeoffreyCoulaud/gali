const YuzuSource = require("./YuzuSource.js");
const YuzuFlatpakGame = require("../games/YuzuFlatpakGame.js");

const USER_DIR = process.env["HOME"];

class YuzuFlatpakSource extends YuzuSource{

	static name = "Yuzu (Flatpak)";
	static gameClass = YuzuFlatpakGame;

	configPath = `${USER_DIR}/.var/app/org.yuzu_emu.yuzu/config/yuzu/qt-config.ini`;

}

module.exports = YuzuFlatpakSource;
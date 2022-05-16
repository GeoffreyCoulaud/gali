const RetroarchSource = require("./RetroarchSource.js");
const RetroarchFlatpakGame = require("../games/RetroarchFlatpakGame.js");

const USER_DIR = process.env["HOME"];

class RetroarchFlatpakSource extends RetroarchSource{

	static name = "Retroarch (Flatpak)";
	static gameClass = RetroarchFlatpakGame;

	configPath = `${USER_DIR}/.var/app/org.libretro.RetroArch/config/retroarch/playlists`;

}

module.exports = RetroarchFlatpakSource;
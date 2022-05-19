const SteamSource = require("./SteamSource.js");
const SteamFlatpakGame = require("../games/SteamFlatpakGame.js");

const USER_DIR = process.env["HOME"];

class SteamFlatpakSource extends SteamSource{

	static name = "Steam (Flatpak)";
	static gameClass = SteamFlatpakGame;

	steamDir = `${USER_DIR}/.var/app/com.valvesoftware.Steam/.local/share/Steam`;

}

module.exports = SteamFlatpakSource;
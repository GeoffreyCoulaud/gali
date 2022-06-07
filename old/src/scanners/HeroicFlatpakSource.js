const HeroicSource = require("./HeroicSource.js");
const HeroicFlatpakGame = require("../games/HeroicFlatpakGame.js");

const USER_DIR = process.env["HOME"];

class HeroicFlatpakSource extends HeroicSource{

	static name = "Heroic (Flatpak)";
	static gameClass = HeroicFlatpakGame;

	configPath = `${USER_DIR}/.var/app/com.heroicgameslauncher.hgl/config/heroic/store/library.json`;

}

module.exports = HeroicFlatpakSource;
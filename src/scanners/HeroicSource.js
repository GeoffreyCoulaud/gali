const fsp = require("fs/promises");

const { Source } = require("./Source.js");
const { HeroicGame } = require("../games/HeroicGame");

const USER_DIR = process.env["HOME"];

class HeroicSource extends Source {
	
	static name = "Heroic";
	
	LIBRARY_FILE_PATH = `${USER_DIR}/.config/heroic/store/library.json`;
	
	preferCache = false;

	constructor(preferCache = false) {
		super();
		this.preferCache = preferCache;
	}

	async scan(warn = false) {

		// Read library.json file
		let library;
		try {
			const fileContents = await fsp.readFile(this.LIBRARY_FILE_PATH, "utf-8");
			library = JSON.parse(fileContents);
			library = library?.["library"];
		} catch (error) {
			if (warn){
				console.warn(`Unable to read heroic library.json : ${error}`);
			}
			library = undefined;
		}

		// Build games
		const games = [];
		if (library) {
			for (const entry of library) {
				if (entry?.["is_game"]) {
					const game = new HeroicGame(entry.title, entry.app_name);
					game.isInstalled = entry?.is_installed;
					games.push(game);
				}
			}
		}

		return games;

	}

}

module.exports = {
	HeroicSource
};
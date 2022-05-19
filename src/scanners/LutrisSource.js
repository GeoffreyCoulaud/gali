const sqlite3 = require("sqlite3");
const sqlite = require("sqlite");
const fs = require("fs");

const Source = require("./Source.js");
const LutrisGame = require("../games/LutrisGame");

const USER_DIR = process.env["HOME"];

class LutrisSource extends Source {

	static name = "Lutris";
	static gameClass = LutrisGame;

	preferCache = false;

	dbPath = `${USER_DIR}/.local/share/lutris/pga.db`;
	bannerPath = `${USER_DIR}/.local/share/lutris/banners`;
	iconPath = `${USER_DIR}/.local/share/icons/hicolor/128x128/apps`;
	databaseRequest = `
		SELECT 
			name, slug, configpath, installed 
		FROM
			'games' 
		WHERE 
			NOT hidden
			AND name IS NOT NULL 
			AND slug IS NOT NULL
			AND configPath IS NOT NULL
		;
	`;

	constructor(preferCache = false) {
		super();
		this.preferCache = preferCache;
	}

	/**
	 * Optional step, add images to a game
	 * @param {LutrisGame} game - The game to get image for
	 */
	_getGameImages(game) {
		const images = {
			coverImage: `${this.bannerPath}/${game.gameSlug}.jpg`,
			iconImage: `${this.iconPath}/lutris_${game.gameSlug}.png`,
		};
		for (const [key, value] of Object.entries(images)) {
			const imageExists = fs.existsSync(value);
			if (imageExists) {
				game[key] = value;
			}
		}
	}

	/**
	 * Get all Lutris games
	 * @returns {LutrisGame[]} - An array of found games
	 */
	async scan() {

		// Open DB
		const db = await sqlite.open({
			filename: this.dbPath,
			driver: sqlite3.cached.Database
		});

		// Get games
		const games = [];
		const results = await db.all(this.databaseRequest);
		for (const row of results) {
			const game = new this.constructor.gameClass(
				row.slug,
				row.name,
				row.configpath,
				row.installed
			);
			this._getGameImages(game);
			games.push(game);
		}
		return games;

	}

}

module.exports = LutrisSource;
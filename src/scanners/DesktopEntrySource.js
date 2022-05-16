const fsp = require("fs/promises");
const fs = require("fs");

const { GameDir } = require("./GameDir.js");
const config = require("../utils/configFormats.js");
const deepReaddir = require("../utils/deepReaddir.js");
const locale = require("../utils/locale.js");
const xdg = require("../utils/xdg.js");

const { DesktopEntryGame } = require("../games/DesktopEntryGame");
const { Source } = require("./Source.js");

class DesktopEntrySource extends Source {

	static name = "Desktop Entries";
	preferCache = false;

	constructor(preferCache = false) {
		super();
		this.preferCache = preferCache;
	}

	/**
	 * Get all desktop entries according to the freedesktop spec
	 * @returns {string[]} - An array of paths to desktop entries
	 * @private
	 */
	async _getDesktopEntries() {

		const USER_DIR = process.env["HOME"];
		const XDG_DATA_DIR = process.env["XDG_DATA_HOME"] ?? `${USER_DIR}/.local/share/applications`;
		const dirs = [
			new GameDir(XDG_DATA_DIR, true),
			new GameDir("/usr/share/applications", true),
			new GameDir("/usr/local/share/applications", true),
		];

		// Find all .desktop files in dirs
		const filesRegex = /.+\.desktop/;
		const paths = [];
		for (const dir of dirs) {
			let filePaths;
			try {
				filePaths = await deepReaddir(dir.path, Infinity, (p)=>filesRegex.test(p));
			} catch (error) { continue; }
			for (const filePath of filePaths) {
				paths.push(filePath);
			}
		}

		return paths;

	}

	/**
	 * Filter function to apply to all desktop entries.
	 * Returns true if the entry is a game (with exceptions), else false.
	 * @param {Object} data - An object containing desktop entry data
	 * @returns {boolean} - True if the entry is kept, else false.
	 * @private
	 */
	_filter(data) {

		const EXCLUDED_NAMES = [
			"Citra", "Yuzu", "Dolphin Emulator", "Dolphin Triforce Emulator",
			"Heroic Games Launcher", "Lutris", "Pegasus", "PPSSPP (Qt)",
			"PPSSPP (SDL)", "Steam (Runtime)", "Steam (Native)", "yuzu",
			"RetroArch"
		];

		const EXCLUDED_EXEC_STARTS = [
			"lutris", "steam", "xdg-open heroic://"
		];

		// Filter out hidden desktop entries
		const isHidden = String(data["Hidden"]).toLowerCase() === "true";
		const noDisplay = String(data["NoDisplay"]).toLowerCase() === "true";
		if (isHidden || noDisplay){
			return false;
		}

		// Filter out non game desktop entries
		let categories = data["Categories"];
		if (typeof categories === "undefined"){
			return false;
		}
		categories = categories.split(";").filter(str=>str.length > 0);
		if (!categories.includes("Game")){
			return false;
		}

		// Filter out explicitly excluded names
		const name = data["Name"];
		if (EXCLUDED_NAMES.includes(name)){
			return false;
		}

		// Filter out excluded exec starts
		const exec = data["Exec"];
		for (const EXCLUDED_EXEC_START of EXCLUDED_EXEC_STARTS) {
			if (exec.startsWith(EXCLUDED_EXEC_START)) {
				return false;
			}
		}

		// If game doesn't match any filter out condition, keep it
		return true;

	}

	/**
	 * Get a desktop entry's localized name according to user preference.
	 * Falls back to the regular name if none is found.
	 * @param {Object} data - An object containing desktop entry data
	 * @param {string[]} preferredLangs - The user's preferred languages
	 * @returns {string} - A name
	 * @private
	 */
	_getLocalizedName(data, preferredLangs) {

		let name = String(data["Name"]);
		for (const lang of preferredLangs) {
			const localizedName = data[`Name[${lang}]`];
			if (localizedName) {
				name = String(localizedName);
				break;
			}
		}

		return name;

	}

	/**
	 * Optional step, adding images to a game
	 * @param {DesktopEntryGame} game - The game to add images to
	 * @param {string} icon - The desktop entry icon field
	 * @param {string} themeName - The name of the user's xdg icon theme
	 * @param {Object[]} themes - An arry of cached xdg icon themes
	 */
	async _getGameImages(game, icon, themeName, themes) {
		let p;
		if (!icon) {
			return;
		} else if (icon.startsWith("/") && fs.existsSync(icon)) {
			p = icon;
		} else {
			const size = 512;
			const scale = 1;
			try {
				p = await xdg.getIcon(icon, size, scale, themeName, themes);
			} catch (error) {
				p = undefined;
			}
		}
		game.iconImage = p;
	}

	/**
	 * Get all games that have a desktop entry
	 * @param {boolean} warn - Whether to display additional warnings
	 * @returns {DesktopEntryGame[]} - An array of found games
	 */
	async scan(warn = false) {

		// Get entries paths
		const paths = await this._getDesktopEntries(warn);

		// Read XDG icon themes
		let themes;
		try {
			themes = await xdg.getIconThemes();
		} catch (error) {
			themes = [];
		}

		// TODO Get user XDG icon theme name
		const userThemeName = "hicolor";

		// Read each of the entries to decide of its fate
		const preferredLangs = await locale.getUserLocalePreference(true);
		const games = [];
		for (const gamePath of paths) {

			// Get desktop entry data
			const contents = await fsp.readFile(gamePath, "utf-8");
			let data = config.desktop2js(contents);
			data = data?.["Desktop Entry"];
			if (!data){
				continue;
			}

			// Filter entry by its data
			if (!this._filter(data)){
				continue;
			}

			// Build game
			const name = this._getLocalizedName(data, preferredLangs);
			const exec = data["Exec"];
			const icon = data["Icon"];
			const game = new DesktopEntryGame(name, exec);
			await this._getGameImages(game, icon, userThemeName, themes);

			games.push(game);

		}

		return games;
	}

}

module.exports = {
	DesktopEntrySource
};
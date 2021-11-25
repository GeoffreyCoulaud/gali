const config        = require("../utils/configFormats.js");
const locale        = require("../utils/locale.js");
const xdg           = require("../utils/xdg.js");
const common        = require("./common.js");
const readdirpp     = require("readdir-enhanced"); // ? reimplement
const child_process = require("child_process");
const fsp           = require("fs/promises");
const process       = require("process");

const DESKTOP_ENTRIES_SOURCE_NAME = "Desktop entries";

/**
 * A wrapper for desktop entry game process management
 * @property {string} exec - The exec value of the desktop entry file,
 *                           used to start the game in a subprocess.
 */
class DesktopEntryGameProcessContainer extends common.GameProcessContainer{

	/**
	 * Create a desktop entry game process container
	 * @param {string} exec - The desktop entry's exec field value
	 */
	constructor(exec){
		super();
		this.spawnArgs = xdg.splitDesktopExec(exec);
		this.spawnCommand = this.spawnArgs.shift();
	}

	/**
	 * Start the game in a subprocess.
	 * The exec value of the desktop entry will be used, this is litteraly
	 * arbitrary code execution, beware !
	 */
	async start(){
		this.process = child_process.spawn(
			this.spawnCommand,
			this.spawnArgs,
			common.GameProcessContainer.defaultSpawnOptions
		);
		this._bindProcessEvents();
	}

}

/**
 * A class representing a game found via its desktop entry
 */
class DesktopEntryGame extends common.Game{

	platform = "PC";
	source = DESKTOP_ENTRIES_SOURCE_NAME;
	isInstalled = true; // All desktop entries games are considered installed

	/**
	 * Create a desktop entry game
	 * @param {string} name - The game's displayed name
	 * @param {string} exec - The exec field of the game's desktop file
	 */
	constructor(name, exec){
		super(name);
		this.processContainer = new DesktopEntryGameProcessContainer(exec);
	}

	toString(){
		return `${this.name} - ${this.source}`;
	}

}

/**
 * A class representing a Desktop Entries source
 */
class DesktopEntrySource extends common.Source{

	static name = DESKTOP_ENTRIES_SOURCE_NAME;
	preferCache = false;

	constructor(preferCache = false){
		super();
		this.preferCache = preferCache;
	}

	/**
	 * Get all desktop entries according to the freedesktop spec
	 * @returns {string[]} - An array of paths to desktop entries
	 * @private
	 */
	async _getDesktopEntries(){

		const USER_DIR = process.env["HOME"];
		const XDG_DATA_DIR = process.env["XDG_DATA_HOME"] ?? `${USER_DIR}/.local/share/applications`;
		const dirs = [
			new common.GameDir(XDG_DATA_DIR, true),
			new common.GameDir("/usr/share/applications", true),
			new common.GameDir("/usr/local/share/applications", true),
		];

		// Find all .desktop files in dirs
		const filesRegex = /.+\.desktop/;
		const paths = [];
		for (const dir of dirs){
			let filePaths;
			try {
				filePaths = await readdirpp.readdirAsync(dir.path, {filter: filesRegex, deep: dir.recursive});
			} catch (error){ continue; }
			for (const file of filePaths){
				const fileAbsPath = `${dir.path}/${file}`;
				paths.push(fileAbsPath);
			}
		}

		return paths;

	}

	/**
	 * Filter function to apply to all desktop entries.
	 * Returns true if the entry is a game (with exceptions), else false.
	 * @param {Map} data - A map of desktop entry key and values
	 * @returns {boolean} - True if the entry is kept, else false.
	 * @private
	 */
	_filter(data){

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
		const isHidden = String(data.get("Hidden")).toLowerCase() === "true";
		const noDisplay = String(data.get("NoDisplay")).toLowerCase() === "true";
		if (isHidden || noDisplay) return false;

		// Filter out non game desktop entries
		let categories = data.get("Categories");
		if (typeof categories === "undefined") return false;
		categories = categories.split(";").filter(str=>str.length > 0);
		if (!categories.includes("Game")) return false;

		// Filter out explicitly excluded names
		const name = data.get("Name");
		if (EXCLUDED_NAMES.includes(name)) return false;

		// Filter out excluded exec starts
		const exec = data.get("Exec");
		for (const EXCLUDED_EXEC_START of EXCLUDED_EXEC_STARTS){
			if (exec.startsWith(EXCLUDED_EXEC_START)){
				return false;
			}
		}

		// If game doesn't match any filter out condition, keep it
		return true;

	}

	/**
	 * Get a desktop entry's localized name according to user preference.
	 * Falls back to the regular name if none is found.
	 * @param {Map} data - A map of desktop entry key and values
	 * @param {string[]} preferredLangs - The user's preferred languages
	 * @returns {string} - A name
	 * @private
	 */
	_getLocalizedName(data, preferredLangs){

		let name = data.get("Name");
		for (const lang of preferredLangs){
			const localizedName = data.get(`Name[${lang}]`);
			if (localizedName){
				name = localizedName;
				break;
			}
		}

		return name;

	}

	/**
	 * Get all games that have a desktop entry
	 * @param {boolean} warn - Whether to display additional warnings
	 * @returns {DesktopEntryGame[]} - An array of found games
	 */
	async scan(warn = false){

		// Get entries paths
		const paths = await this._getDesktopEntries(warn);

		// Read each of the entries to decide of its fate
		const preferredLangs = await locale.getUserLocalePreference(true);
		const games = [];
		for (const gamePath of paths){

			// Get desktop entry data
			const contents = await fsp.readFile(gamePath, "utf-8");
			let data = config.desktop2js(contents);
			data = data?.["Desktop Entry"];
			if (!data) continue;

			// Filter entry by its data
			if (!this._filter(data)) continue;

			// Get needed fields
			const name = this._getLocalizedName(data, preferredLangs);
			const exec = data.get("Exec");

			// Add game
			games.push(new DesktopEntryGame(name, exec));

		}

		return games;
	}

}

module.exports = {
	DesktopEntryGameProcessContainer,
	DesktopEntrySource,
	DesktopEntryGame,
};
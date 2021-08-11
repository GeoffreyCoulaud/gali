import { Game, GameDir, GameProcessContainer, NoCommandError } from "./common.js";
import { join as pathJoin, basename as pathBasename } from "path";
import { getUserLocalePreference } from "../utils/locale.js";
import { splitDesktopExec } from "../utils/xdg.js";
import { readdirAsync } from "readdir-enhanced";
import desktop2js from "../utils/desktop2js.js";
import { readFile } from "fs/promises";
import { spawn } from "child_process";
import { env } from "process";

/**
 * A wrapper for desktop entry game process management
 * @property {string} exec - The exec value of the desktop entry file, 
 *                           used to start the game in a subprocess.
 */
class DesktopEntryGameProcessContainer extends GameProcessContainer{

	/**
	 * Create a desktop entry game process container
	 * @param {string} exec - The desktop entry's exec field value
	 */
	constructor(exec){
		super();
		this.spawnArgs = splitDesktopExec(exec);
		this.spawnCommand = this.spawnArgs.shift();
	}

	/**
	 * Start the game in a subprocess.
	 * The exec value of the desktop entry will be used, this is litteraly
	 * arbitrary code execution, beware !
	 */
	start(){
		this.process = spawn(
			this.spawnCommand,
			this.spawnArgs, 
			GameProcessContainer.defaultSpawnOptions
		);
		this._bindProcessEvents();
	}

}

/**
 * A class representing a game found via its desktop entry
 */
class DesktopEntryGame extends Game{

	/**
	 * Create a desktop entry game
	 * @param {string} name - The game's displayed name
	 * @param {string} icon - A desktop file icon
	 * @param {string} exec - The exec field of the game's desktop file
	 */
	constructor(name, icon, exec){
		super(name);
		this.icon = icon;
		this.source = "Desktop entries"; // ? Use a better source name ?
		this.processContainer = new DesktopEntryGameProcessContainer(exec);
	}

	toString(){
		return `${this.name} - ${this.source}`;
	}

}

/**
 * Get all desktop entries according to the freedesktop spec
 * @returns {string[]} - An array of paths to desktop entries
 */
async function getDesktopEntries(){

	const USER_DIR = env["HOME"];
	const XDG_DATA_DIR = env["XDG_DATA_HOME"] ?? pathJoin(USER_DIR, ".local/share/applications");
	const dirs = [
		new GameDir(XDG_DATA_DIR, true),
		new GameDir("/usr/share/applications", true),
		new GameDir("/usr/local/share/applications", true),
	];

	// Find all .desktop files in dirs
	const filesRegex = /.+\.desktop/;
	let paths = [];
	for (let dir of dirs){
		let filePaths;
		try {
			filePaths = await readdirAsync(dir.path, {filter: filesRegex, deep: dir.recursive});
		} catch (error){ continue; }
		for (let file of filePaths){
			let fileAbsPath = pathJoin(dir.path, file);
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
 */
function filterDesktopEntries(data){

	const EXCLUDED_NAMES = [
		"Citra", "Yuzu", "Dolphin Emulator", "Heroic Games Launcher", "Lutris", 
		"Pegasus", "PPSSPP (Qt)", "PPSSPP (SDL)", "Steam (Runtime)", 
		"Steam (Native)", "yuzu", "RetroArch"
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
	let name = data.get("Name");
	if (EXCLUDED_NAMES.includes(name)) return false;
	
	// Filter out excluded exec starts
	let exec = data.get("Exec");
	for (let EXCLUDED_EXEC_START of EXCLUDED_EXEC_STARTS){
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
 */
function getDesktopEntryLocalizedName(data, preferredLangs){

	let name = data.get("Name");
	for (let lang of preferredLangs){
		let localizedName = data.get(`Name[${lang}]`);
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
export async function getDesktopEntryGames(warn = false){
	
	// Get entries paths
	const paths = await getDesktopEntries();

	// Read each of the entries to decide of its fate
	const preferredLangs = await getUserLocalePreference(true);
	let games = [];
	for (let path of paths){
		
		// Get desktop entry data
		const contents = await readFile(path, "utf-8");
		let data = desktop2js(contents);
		data = data?.["Desktop Entry"];
		if (!data) continue;

		// Filter entry by its data
		if (!filterDesktopEntries(data)) continue;
		
		// Get needed fields
		let name = getDesktopEntryLocalizedName(data, preferredLangs);
		let icon = data.get("Icon");
		let exec = data.get("Exec");
		
		// Add game
		games.push(new DesktopEntryGame(name, icon, exec));

	}

	return games;
}
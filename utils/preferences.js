const { writeFileSync, readFileSync, mkdirSync } = require("fs");
const { existsSync } = require("fs");
const { env } = require("process");

const { CemuSource } = require("../sources/cemu.js");
const { CitraSource } = require("../sources/citra.js");
const { DesktopEntrySource } = require("../sources/desktop-entries.js");
const { DolphinSource } = require("../sources/dolphin.js");
const { HeroicSource } = require("../sources/heroic.js");
const { LegendarySource } = require("../sources/legendary.js");
const { LutrisSource } = require("../sources/lutris.js");
const { PPSSPPSource } = require("../sources/ppsspp.js");
const { RetroarchSource } = require("../sources/retroarch.js");
const { SteamSource } = require("../sources/steam.js");
const { YuzuSource } = require("../sources/yuzu.js");

const CONFIG_DIR = (env["XDG_CONFIG_DIR"] ?? (env["HOME"] + "/.config")) + "/brag";
const CONFIG_FILENAME = "preferences.json";
const CONFIG_PATH = `${CONFIG_DIR}/${CONFIG_FILENAME}`;

const DEFAULT_PREFERRED_SHELL_COMMAND = ["sh", "zsh", "bash"];
const DEFAULT_PREFERENCES = {
	"scan": {
		"warnings": false,
		"preferCache": false,
		"enabledSources": [
			CemuSource.name,
			CitraSource.name,
			DesktopEntrySource.name,
			DolphinSource.name,
			HeroicSource.name,
			LegendarySource.name,
			LutrisSource.name,
			PPSSPPSource.name,
			RetroarchSource.name,
			SteamSource.name,
			YuzuSource.name,
		],
	},
	"start": {
		"preferredCommands": {
			[CemuSource.name]: DEFAULT_PREFERRED_SHELL_COMMAND,
			[CitraSource.name]: [
				"citra",
				"citra-qt",
			],
			[DesktopEntrySource.name]: DEFAULT_PREFERRED_SHELL_COMMAND,
			[DolphinSource.name]: [
				"dolphin-emu",
			],
			[HeroicSource.name]: [
				"xdg-open",
			],
			[LegendarySource.name]: [
				"legendary",
			],
			[LutrisSource.name]: DEFAULT_PREFERRED_SHELL_COMMAND,
			[PPSSPPSource.name]: [
				"PPSSPPSDL",
				"PPSSPPQt",
			],
			[RetroarchSource.name]: [
				"retroarch",
			],
			[SteamSource.name]: [
				"steam",
			],
			[YuzuSource.name]: [
				"yuzu"
			],
		}
	}
};

/**
 * Check if the user has a config file
 */
function doesUserFileExist(){
	return existsSync(CONFIG_PATH);
}

/**
 * Create a default config file for the current user.
 * This will also create the needed directories before.
 * @throws {Error} - On write fail
 */
function createUserFile(){
	if (!existsSync(CONFIG_DIR)) mkdirSync(CONFIG_DIR, {recursive: true});
	return writeFileSync(CONFIG_PATH, JSON.stringify(DEFAULT_PREFERENCES), "utf-8");
}

/**
 * (UNSAFE) Get config data from a user file.
 * Beware, this will throw on unreadable file or invalid json
 * @throws {SyntaxError} - On invalid JSON
 * @throws {Error} - On unreadable file
 * @returns {object} - Parsed user data
 */
function readUserFile(){
	const contents = readFileSync(CONFIG_PATH, "utf-8");
	const parsed = JSON.parse(contents);
	return parsed;
}

/**
 * Get user preferences safely
 * - Creates a default file (and dir) if missing
 * - Falls back on default preferences on invalid file
 * @returns {object} - A preference object
 */
function readUserFileSafe(){

	let prefs;
	if (!doesUserFileExist()){
		console.log(`Created default config file "${CONFIG_PATH}`);
		createUserFile();
		prefs = DEFAULT_PREFERENCES;
	} else {
		try {
			prefs = readUserFile();
		} catch (error){
			console.error(`Invalid config file, delete or edit "${CONFIG_PATH}"`);
			console.error("\tError : ", error.toString());
			prefs = DEFAULT_PREFERENCES;
		}
	}
	return prefs;

}

module.exports = {

	CONFIG_DIR,
	CONFIG_FILENAME,
	CONFIG_PATH,
	DEFAULT_PREFERENCES,

	doesUserFileExist,
	createUserFile,
	readUserFile,
	readUserFileSafe,

};
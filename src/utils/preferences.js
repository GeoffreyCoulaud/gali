const ad  = require("./appDirectories.js");
const fsp = require("fs/promises");
const fs  = require("fs");

const { DesktopEntrySource } = require("../scanners/DesktopEntrySource.js");
const { LegendarySource }    = require("../scanners/LegendarySource.js");
const { RetroarchSource }    = require("../scanners/RetroarchSource.js");
const { DolphinSource }      = require("../scanners/DolphinSource.js");
const { HeroicSource }       = require("../scanners/HeroicSource.js");
const { LutrisSource }       = require("../scanners/LutrisSource.js");
const { PPSSPPSource }       = require("../scanners/PPSSPPSource.js");
const { CitraSource }        = require("../scanners/CitraSource.js");
const { SteamSource }        = require("../scanners/SteamSource.js");
const { CemuSource }         = require("../scanners/CemuSource.js");
const { YuzuSource }         = require("../scanners/YuzuSource.js");

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
 * Check if the user has a brag config file
 * @returns {boolean} - True if exists, else false
 */
function userFileExistsSync(){
	return fs.existsSync(ad.BRAG_CONFIG_PATH);
}

/**
 * Checks if the user has a brag config dir
 * @returns {boolean} - True if exists, else false
 */
function userDirExistsSync(){
	return fs.existsSync(ad.BRAG_CONFIG_DIR);
}

/**
 * Create a default config file for the current user.
 * This will also create the needed directories before.
 * @throws {Error} - On write fail
 */
async function createUserFile(){
	if (!userDirExistsSync()){
		await fsp.mkdir(ad.BRAG_CONFIG_DIR, {recursive: true});
	}
	await fsp.writeFile(
		ad.BRAG_CONFIG_PATH,
		JSON.stringify(DEFAULT_PREFERENCES, null, "\t"),
		"utf-8"
	);
}

/**
 * (UNSAFE) Get config data from a user file.
 * Beware, this will throw on unreadable file or invalid json
 * @throws {SyntaxError} - On invalid JSON
 * @throws {Error} - On unreadable file
 * @returns {object} - Parsed user data
 */
async function readUserFile(){
	const contents = await fsp.readFile(ad.BRAG_CONFIG_PATH, "utf-8");
	const parsed = JSON.parse(contents);
	return parsed;
}

/**
 * Get user preferences safely
 * - Creates a default file (and dir) if missing
 * - Falls back on default preferences on invalid file
 * @returns {object} - A preference object
 */
async function readUserFileSafe(){

	let prefs;
	if (!userFileExistsSync()){
		console.log(`Created default config file "${ad.BRAG_CONFIG_PATH}`);
		await createUserFile();
		prefs = DEFAULT_PREFERENCES;
	} else {
		try {
			prefs = await readUserFile();
		} catch (error){
			console.error(`Invalid config file, delete or edit "${ad.BRAG_CONFIG_PATH}"`);
			console.error("\tError : ", error.toString());
			prefs = DEFAULT_PREFERENCES;
		}
	}
	return prefs;

}

module.exports = {
	DEFAULT_PREFERENCES,
	userFileExistsSync,
	userDirExistsSync,
	createUserFile,
	readUserFile,
	readUserFileSafe,
};
const process = require("process");
const fsp = require("fs/promises");
const fs = require("fs");

const { DesktopEntrySource } = require("../sources/desktop-entries.js");
const { LegendarySource }    = require("../sources/legendary.js");
const { RetroarchSource }    = require("../sources/retroarch.js");
const { DolphinSource }      = require("../sources/dolphin.js");
const { HeroicSource }       = require("../sources/heroic.js");
const { LutrisSource }       = require("../sources/lutris.js");
const { PPSSPPSource }       = require("../sources/ppsspp.js");
const { CitraSource }        = require("../sources/citra.js");
const { SteamSource }        = require("../sources/steam.js");
const { CemuSource }         = require("../sources/cemu.js");
const { YuzuSource }         = require("../sources/yuzu.js");

const CONFIG_FILENAME = "preferences.json";
const CONFIG_DIR = (process.env["XDG_CONFIG_DIR"] ?? (process.env["HOME"] + "/.config")) + "/brag";
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
function userFileExistsSync(){
	return fs.existsSync(CONFIG_PATH);
}

/**
 * Create a default config file for the current user.
 * This will also create the needed directories before.
 * @throws {Error} - On write fail
 */
function createUserFileSync(){
	if (!fs.existsSync(CONFIG_DIR)) fs.mkdirSync(CONFIG_DIR, {recursive: true});
	return fs.writeFileSync(CONFIG_PATH, JSON.stringify(DEFAULT_PREFERENCES, null, "\t"), "utf-8");
}

async function createUserFile(){
	if (!fs.existsSync(CONFIG_DIR)){
		await fsp.mkdir(CONFIG_DIR, {recursive: true});
	}
	await fsp.writeFile(
		CONFIG_PATH,
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
function readUserFileSync(){
	const contents = fs.readFileSync(CONFIG_PATH, "utf-8");
	const parsed = JSON.parse(contents);
	return parsed;
}

async function readUserFile(){
	const contents = await fsp.readFile(CONFIG_PATH, "utf-8");
	const parsed = JSON.parse(contents);
	return parsed;
}

/**
 * Get user preferences safely
 * - Creates a default file (and dir) if missing
 * - Falls back on default preferences on invalid file
 * @returns {object} - A preference object
 */
function readUserFileSafeSync(){

	let prefs;
	if (!userFileExistsSync()){
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

async function readUserFileSafe(){

	let prefs;
	if (!userFileExistsSync()){
		console.log(`Created default config file "${CONFIG_PATH}`);
		await createUserFile();
		prefs = DEFAULT_PREFERENCES;
	} else {
		try {
			prefs = await readUserFile();
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

	userFileExistsSync,

	createUserFile,
	readUserFile,
	readUserFileSafe,

	createUserFileSync,
	readUserFileSync,
	readUserFileSafeSync,

};
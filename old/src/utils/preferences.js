const ad  = require("./appDirectories.js");
const fsp = require("fs/promises");
const fs  = require("fs");

const all = require("../scanners/all.js");

const DEFAULT_PREFERENCES = {
	"scan": {
		"warnings": false,
		"preferCache": false,
		"enabledSources": Object.values(all).map(k=>k.name),
	}
};

/**
 * Check if the user has a gali config file
 * @returns {boolean} - True if exists, else false
 */
function userFileExistsSync(){
	return fs.existsSync(ad.APP_CONFIG_PATH);
}

/**
 * Checks if the user has a gali config dir
 * @returns {boolean} - True if exists, else false
 */
function userDirExistsSync(){
	return fs.existsSync(ad.APP_CONFIG_DIR);
}

/**
 * Create a default config file for the current user.
 * This will also create the needed directories before.
 * @throws {Error} - On write fail
 */
async function createUserFile(){
	if (!userDirExistsSync()){
		await fsp.mkdir(ad.APP_CONFIG_DIR, {recursive: true});
	}
	await fsp.writeFile(
		ad.APP_CONFIG_PATH,
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
	const contents = await fsp.readFile(ad.APP_CONFIG_PATH, "utf-8");
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
		console.log(`Created default config file "${ad.APP_CONFIG_PATH}`);
		await createUserFile();
		prefs = DEFAULT_PREFERENCES;
	} else {
		try {
			prefs = await readUserFile();
		} catch (error){
			console.error(`Invalid config file, delete or edit "${ad.APP_CONFIG_PATH}"`);
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
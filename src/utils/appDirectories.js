const fsp     = require("fs/promises");
const fs      = require("fs");
const process = require("process");

const USER_DIR               = process.env["HOME"];
const USER_CONFIG_DIR        = process.env["XDG_CONFIG_DIR"] ?? `${USER_DIR}/.config`;
const USER_DATA_DIR          = `${USER_DIR}/.local/share`;

const APP_CONFIG_DIR        = `${USER_CONFIG_DIR}/gali`;
const APP_CONFIG_FILENAME   = "preferences.json";
const APP_CONFIG_PATH       = `${APP_CONFIG_DIR}/${APP_CONFIG_FILENAME}`;
const APP_DATA_DIR          = `${USER_DATA_DIR}/gali`;
const APP_START_SCRIPTS_DIR = `${APP_DATA_DIR}/start-scripts`;

async function createAppDirs(){
	const dirs = [
		APP_DATA_DIR,
		APP_CONFIG_DIR,
		APP_START_SCRIPTS_DIR,
	];
	for (const key of Object.keys(dirs)){
		const dirPath = dirs[key];
		if (dirPath && !fs.existsSync(dirPath)){
			await fsp.mkdir(dirPath);
		}
	}
}

module.exports = {
	APP_DATA_DIR,
	APP_START_SCRIPTS_DIR,
	APP_CONFIG_DIR,
	APP_CONFIG_FILENAME,
	APP_CONFIG_PATH,
	createAppDirs,
};
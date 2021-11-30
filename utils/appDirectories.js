const fsp     = require("fs/promises");
const fs      = require("fs");
const process = require("process");

const USER_DIR               = process.env["HOME"];
const USER_CONFIG_DIR        = process.env["XDG_CONFIG_DIR"] ?? `${USER_DIR}/.config`;
const USER_DATA_DIR          = `${USER_DIR}/.local/share`;

const BRAG_CONFIG_DIR        = `${USER_CONFIG_DIR}/brag`;
const BRAG_CONFIG_FILENAME   = "preferences.json";
const BRAG_CONFIG_PATH       = `${BRAG_CONFIG_DIR}/${BRAG_CONFIG_FILENAME}`;
const BRAG_DATA_DIR          = `${USER_DATA_DIR}/brag`;
const BRAG_START_SCRIPTS_DIR = `${BRAG_DATA_DIR}/start-scripts`;

async function createBragDirs(){
	const dirs = [
		BRAG_DATA_DIR,
		BRAG_CONFIG_DIR,
		BRAG_START_SCRIPTS_DIR,
	];
	for (const key of Object.keys(dirs)){
		const dirPath = dirs[key];
		if (dirPath && !fs.existsSync(dirPath)){
			await fsp.mkdir(dirPath);
		}
	}
}

module.exports = {
	BRAG_DATA_DIR,
	BRAG_START_SCRIPTS_DIR,
	BRAG_CONFIG_DIR,
	BRAG_CONFIG_FILENAME,
	BRAG_CONFIG_PATH,
	createBragDirs,
};
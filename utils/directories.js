const fsp     = require("fs/promises");
const fs      = require("fs");
const process = require("process");

const USER_DIR = process.env["HOME"];
const bragUserConfig       = `${USER_DIR}/.config/brag`;
const bragUserLocalData    = `${USER_DIR}/.local/share/brag`;
const bragUserStartScripts = `${bragUserLocalData}/start-scripts`;

async function createBragDirs(){
	const dirs = [
		bragUserLocalData,
		bragUserConfig,
		bragUserStartScripts,
	];
	for (const key of Object.keys(dirs)){
		const dirPath = dirs[key];
		if (dirPath && !fs.existsSync(dirPath)){
			await fsp.mkdir(dirPath);
		}
	}
}

module.exports = {
	createBragDirs,
	bragUserLocalData,
	bragUserConfig,
};
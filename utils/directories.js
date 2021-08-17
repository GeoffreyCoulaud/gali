const { join: pathJoin } = require("path");
const { mkdir } = require("fs/promises");
const { existsSync } = require("fs");
const { env } = require("process");

const USER_DIR = env["HOME"];
const bragUserLocalData = pathJoin(USER_DIR, ".local/share/brag");
const bragUserConfig = pathJoin(USER_DIR, ".config/brag");

async function createBragDirs(){
	const dirs = [
		bragUserLocalData,
		bragUserConfig,
		pathJoin(bragUserLocalData, "start-scripts"),
	];
	for (const key of Object.keys(dirs)){
		const path = dirs[key];
		if (path && !existsSync(path)){
			await mkdir(path);
		}
	}

}

module.exports = {
	createBragDirs,
	bragUserLocalData,
	bragUserConfig,
};
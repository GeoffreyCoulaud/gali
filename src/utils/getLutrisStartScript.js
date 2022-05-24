/**
* Get a start script for a lutris game
* @param {string} gameSlug - The lutris game's slug for which to get a start script
* @param {string} scriptBaseName - Name (with extension) for the output script file
* @returns {string} - An absolute path to the script
*/
async function getLutrisStartScript(gameSlug, scriptBaseName = "") {
	if (!scriptBaseName) scriptBaseName = `lutris-${gameSlug}.sh`;
	const scriptPath = `${ad.APP_START_SCRIPTS_DIR}/${scriptBaseName}`;
	await execFilePromise("lutris", [gameSlug, "--output-script", scriptPath]);
	return scriptPath;
}

module.exports = getLutrisStartScript;
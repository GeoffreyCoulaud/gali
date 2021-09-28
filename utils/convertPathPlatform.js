const { resolve: pathResolve } = require("path");

// TODO test paths outside Z:

/**
 * Convert an absolute wine path into a linux path.
 * Needs a prefix path given for paths outside of Z:
 * @param {string} winePath - Absolute wine path (windows style)
 * @param {string|undefined} prefixPath - Optional, absolute path to relevant prefix
 * @returns {string} - The same path converted into a linux path
 */
function wineToLinux(winePath, prefixPath){

	if (typeof winePath !== "string"){
		throw new TypeError("path must be a string");
	}

	const driveLetterRegex = /^(?<driveLetter>[A-Z]):\\(?<rest>.*)/;
	let drivePath;

	if (!prefixPath){

		// If no prefix is given, path must be in Z drive
		if (!winePath.startsWith("Z:\\")){
			throw new Error("path must be in the Z: drive");
		}
		drivePath = "/";

	} else {

		// Prefix exists, accept other drives
		const driveLetterMatch = winePath.match(driveLetterRegex);
		if (!driveLetterMatch) {
			throw new Error("Path doesn't match format");
		}
		const driveLetter = driveLetterMatch.groups?.driveLetter;
		if (!driveLetter){
			throw new Error("Path doesn't start with a drive letter");
		}
		drivePath = `${prefixPath}/dosdevices/${driveLetter.toLowerCase()}:`;
		drivePath = pathResolve(drivePath);

	}

	let linuxPath = winePath.replace(/^([A-Z]:\\)/, drivePath);
	linuxPath = linuxPath.replaceAll("\\", "/");
	return linuxPath;

}

/**
 * Convert an absolute linux path into a wine path.
 * Changes "/" into "\" and the (root fs) "/"  into "Z:\".
 * @param {string} linuxPath - An absolute linux path
 * @returns {string} - The same path converted into a wine path
 */
function linuxToWine(linuxPath){

	if (typeof linuxPath !== "string"){
		throw new TypeError("path must be a string");
	}
	if (!linuxPath.startsWith("/")){
		throw new Error("path must be absolute");
	}

	let winePath = linuxPath.replace("/", "Z:\\");
	winePath = winePath.replaceAll("/", "\\");
	return winePath;

}

module.exports = {
	wineToLinux,
	linuxToWine,
};
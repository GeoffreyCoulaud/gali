// TODO Find a way to not rely on Z: path

/**
 * Convert an absolute (Z:\) wine path into a linux path.
 * Changes "\" into "/" and the "Z:\" into "/" (fs root).
 * @param {string} winePath - An absolute wine path (windows style)
 * @returns {string} - The same path converted into a linux path
 */
export function wineToLinux(winePath){

	if (typeof winePath !== "string"){
		throw new TypeError("path must be a string");
	}
	if (!winePath.startsWith("Z:\\")){
		throw new Error("path must be in the Z: drive");
	}

	let linuxPath = winePath.replace("Z:\\", "/");
	linuxPath = linuxPath.replaceAll("\\", "/");
	return linuxPath;

}

/**
 * Convert an absolute linux path into a wine path. 
 * Changes "/" into "\" and the (root fs) "/"  into "Z:\".
 * @param {string} linuxPath - An absolute linux path
 * @returns {string} - The same path converted into a wine path
 */
export function linuxToWine(linuxPath){

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
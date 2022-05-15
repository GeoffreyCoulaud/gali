/**
 * Class representing a game directory
 */
class GameDir {
	/**
	 * Create a game directory
	 * @param {string} dirPath - The local path corresponding to the directory
	 * @param {boolean} recursive - Whether to search games into the directory subdirs
	 */
	constructor(dirPath, recursive = false) {
		this.path = dirPath;
		this.recursive = recursive;
	}
}

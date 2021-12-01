const fsp = require("fs/promises");

/**
 * A class representng a queue.
 * The top element is the gettable one. (Internally, index 0)
 * Elements are added at the back of the queue. (Internally last index)
 */
class Queue{
	#elements = [];

	get isEmpty(){
		return this.#elements.length === 0;
	}

	/**
	 * Add an element at the back of the queue
	 * @param {*} args - The elements to add to the queue
	 */
	add(...args){
		this.#elements.push(...args);
	}

	/**
	 * Remove and get the element at the top of the queue
	 * @returns {*} The element at the top of the queue that was removed
	 */
	pop(){
		return this.#elements.splice(0, 1)[0];
	}

	/**
	 * Get the top element of the queue
	 * @returns {*} The element at the top of the queue
	 */
	top(){
		return this.#elements[0];
	}
}

/**
 * A class representing a custom direcotory entry.
 * @property {string} path - The absolute path part
 * @property {number} depth - The depth info part
 */
class CustomDirent{
	/**
	 * Create a CustomDirent
	 * @param {string} path - Absolute path
	 * @param {number} depth - Depth info
	 */
	constructor(path, depth = 0){
		this.path = path;
		this.depth = depth;
	}

	/**
	 * Get a string representation of the custom dirent
	 * @returns {string} - A string representing the custom dirent
	 */
	toString(){
		return `${this.depth} - ${this.path}`;
	}
}

/**
 * Read a directory and its subdirectories
 * @param {string} dirPath - Path to the directory to read
 * @param {undefined|number} maxDepth - The maximum depth to search.
 *                                      0 = regular readdir
 *                                      negative values = undefined behavior.
 * @param {undefined|function} match - A function to filter elements. The element path will be passed.
 */

// TODO Use dirents instead of paths
async function deepReaddir(dirPath, maxDepth = Infinity, match = undefined){

	const entries = [];

	// If no match function is given, accept all files
	if (typeof match !== "function"){
		match = function(){return true;};
	}

	const q = new Queue();
	q.add(new CustomDirent(dirPath, -1));

	// Read the dirs
	while (!q.isEmpty){

		const top = q.pop();
		const topStat = await fsp.stat(top.path);

		// If a folder test if (depth < maxDepth), then readdir it
		// If a file, test if matches, then add to entries
		// Else, ignore.
		if (top.depth < maxDepth && topStat.isDirectory()){
			const names = await fsp.readdir(top.path);
			const pwds = names.map(name=>new CustomDirent(`${top.path}/${name}`, top.depth+1));
			q.add(...pwds);
		} else if (topStat.isFile() && match(top.path)) {
			entries.push(top.path);
		}

	}

	return entries;

}

module.exports = deepReaddir;
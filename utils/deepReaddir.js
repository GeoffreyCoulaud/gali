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

class FileType extends Symbol{

	static File = Symbol("File");
	static Directory = Symbol("Directory");
	static BlockDevice = Symbol("BlockDevice");
	static CharacterDevice = Symbol("CharacterDevice");
	static FIFO = Symbol("FIFO");
	static Socket = Symbol("Socket");
	static SymbolicLink = Symbol("SymbolicLink");

	static Unknown = Symbol("Unknown");

	/**
	 * Get a dirent type from a fs.Stat or fs.Dirent object.
	 * @param {fs.Stat|fs.Dirent} obj - A fs.Stat like object with is[type] methods
	 */
	static fromStatLike(obj){
		const options = [
			"File",
			"Directory",
			"BlockDevice",
			"CharacterDevice",
			"FIFO",
			"Socket",
			"SymbolicLink",
		];
		for (const option of options){
			const method = `is${option}`;
			if (typeof obj[method] !== "function"){
				throw new Error(`Unable to call ${method} on given object`);
			}
			if (obj[method]()){
				return FileType[option];
			}
		}
		return FileType.Unknown;
	}
}

/**
 * A class representing a custom directory entry.
 * Used to facilitate reading deeply into a directory.
 * @property {string} path - The absolute path part
 * @property {number} depth - The depth info part
 * @property {FileType} type - The dirent type
 */
class CustomDirent{
	/**
	 * Create a CustomDirent
	 * @param {string} fullpath - Absolute path
	 * @param {number} depth - Depth info
	 * @param {FileType} type - The entry type
	 */
	constructor(fullpath, depth, type){
		this.fullpath = fullpath;
		this.depth = depth;
		this.type = type;
	}

	/**
	 * Get a string representation of the custom dirent
	 * @returns {string} - A string representing the custom dirent
	 */
	toString(){
		return `${this.depth} - ${this.fullpath}`;
	}
}

/**
 * Read a directory and its subdirectories
 * @param {string} dirPath - Path to the directory to read
 * @param {number} maxDepth - The maximum depth to search, default is Infinity.
 *                            0 = regular readdir
 *                            < 0 = undefined behavior
 * @param {function} match - A function to filter elements. The element path will be passed.
 */
async function deepReaddir(dirPath, maxDepth = Infinity, match = undefined){

	// If no match function is given, accept all files
	if (typeof match !== "function"){
		match = function(){return true;};
	}

	const outputPaths = [];
	const queue = new Queue();

	// Add initial dir path to the queue
	const initialStat = await fsp.stat(dirPath);
	const initial = new CustomDirent(
		dirPath,
		-1,
		FileType.fromStatLike(initialStat)
	);
	queue.add(initial);

	// Read the dirs
	while (!queue.isEmpty){
		const top = queue.pop();
		if (top.depth < maxDepth && top.type === FileType.Directory){
			const dirents = await fsp.readdir(top.fullpath, {withFileTypes: true});
			const cdirents = dirents.map(dirent=>{
				const fullpath = `${top.fullpath}/${dirent.name}`;
				const depth = top.depth+1;
				const type = FileType.fromStatLike(dirent);
				return new CustomDirent(fullpath, depth, type);
			});
			queue.add(...cdirents);
		} else if (top.type === FileType.File && match(top.fullpath)) {
			outputPaths.push(top.fullpath);
		}
	}

	return outputPaths;

}

module.exports = deepReaddir;
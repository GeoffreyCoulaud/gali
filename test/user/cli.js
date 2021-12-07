const process = require("process");

/**
 * Detect and remove a string from cli arguments
 * @param {string} arg - The argument to get
 * @returns {boolean} true if present, else false
 */
function getPopBoolArgv(arg){
	const index = process.argv.indexOf(arg);
	if (index !== -1){
		process.argv.splice(index, 1);
		return true;
	}
	return false;
}

/**
 * Get and remove cli argument values associated with a named argument
 * @param {string} arg - The argument to get
 * @param {number} n - The number of values to get.
 *                     Set to a negative value if all following are to get.
 * @returns {*[]} An array of values gotten
 */
function getPopValuesArgv(arg, n, map=undefined){
	const index = process.argv.indexOf(arg);
	let values = [];
	if (index !== -1){
		const start = index+1;
		let end = start;
		if (n < 0) end = process.argv.length;
		else end = start + n;
		values = process.argv.slice(start, end);
		process.argv.splice(index, end - index);
	}
	return values;
}

module.exports = {
	getPopBoolArgv,
	getPopValuesArgv,
};
/** 
 * Deeply merge multiple objects
 * @param {object[]} objects - The objects to merge 
 * @returns {object} - A merged object
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign#warning_for_deep_clone
 */
function deepMergeObjects(objects){
	let merged = {};
	for (let object of objects){
		for (let key of Object.keys(object)){
			// If the key doesn't exist, simply copy.
			// If the key exists and is not an object, copy to overwrite it.
			// If the key exists and is an object, recurse into it.
			if (!merged.hasOwnProperty(key) || typeof merged[key] !== "object"){
				merged[key] = object[key];
			} else {
				merged[key] = deepMergeObjects([merged[key], object[key]]);
			}
		}
	}
	return merged;
}

module.exports = deepMergeObjects;
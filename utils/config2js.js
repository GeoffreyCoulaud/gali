
/**
 * Convert a config file text into a JS readable object
 * @param {string} config - A config file contents
 * @returns {object} - The config's equivalent as a JS object. 
 *                     sections are the object's keys, 
 *                     key/values pairs are stored in their section's maps   
 */
function config2js(config){
	
	let obj = new Object();
	let currentKey = undefined;
	const sectionRegex = /\[(?<sectionName>[^\[\]]+)\]/;
	const propertyRegex = /(?<propertyName>\S+)\s?=\s?(?<propertyValue>.*)/i;
	
	for (let line of config.split("\n")){
		
		// Remove comment lines
		if (line.trimStart().startsWith("#")) continue;

		// Detect line type
		let lineMatchSection = line.match(sectionRegex);
		let lineMatchProperty = line.match(propertyRegex);
		
		if (lineMatchSection != null){
		
			// Section start
			currentKey = lineMatchSection.groups["sectionName"];
			if (typeof obj[currentKey] === "undefined"){
				obj[currentKey] = new Map();
			}
		
		} else if (lineMatchProperty != null){
		
			// Property in the current section
			if (typeof currentKey === "undefined") { continue; }
			let propertyName = lineMatchProperty.groups["propertyName"];
			let propertyValue = lineMatchProperty.groups["propertyValue"];
			obj[currentKey].set(propertyName, propertyValue);
		
		}
		
	}

	return obj;
} 

module.exports = config2js;
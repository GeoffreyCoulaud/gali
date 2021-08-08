
/**
 * Convert a config file text into a JS readable object
 * @param {string} config - A config file contents
 * @returns {object} - The config's equivalent as a JS object. 
 *                     sections are the object's keys, 
 *                     key/values pairs are stored in their section's maps   
 */
export default function config2obj(config){
	let obj = new Object();
	let currentKey = undefined;
	const sectionRegex = /\[(?<sectionName>[^\[\]]+)\]/;
	const propertyRegex = /(?<propertyName>\S+)\s?=\s?(?<propertyValue>.*)/i
	
	for (let line of config.split("\n")){
		
		// Remove commented part of config line
		let lineNoComment = line.split("#")[0];

		// Detect line type
		let lineMatchSection = lineNoComment.match(sectionRegex);
		let lineMatchProperty = lineNoComment.match(propertyRegex);
		
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
		
		} else if (line.length > 0) {
			
			// Other line
			console.warn(`Skipped line (unsure of type) : "${lineNoComment}"`);

		}
	}

	return obj;
} 
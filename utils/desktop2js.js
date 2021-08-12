/**
 * Convert a desktop entry text into a JS readable object
 * @param {string} desktopEntry - A desktop entry contents
 * @returns {object} - The entry's equivalent as a JS object. 
 *                     groups are the object's keys, 
 *                     key/values pairs are stored in their section's maps   
 */
function desktop2js(desktopEntry){
	
	let obj = new Object();
	let currentKey = undefined;
	const groupName = /\[(?<groupName>[^\[\]]+)\]/;
	const propertyRegex = /(?<propertyName>[^=]+)=(?<propertyValue>.*)/;
	
	for (let line of desktopEntry.split("\n")){
		
		let lineMatchProperty = line.match(propertyRegex);

		if (line.trim().length === 0){

			// Empty line
			continue;

		} else if (line.trimStart().startsWith("#")){
			
			// Comment line
			continue;

		} else if (line.startsWith("[")){
		
			// Section start
			currentKey = line.match(groupName).groups["groupName"];
			if (typeof currentKey === "undefined") {
				continue;
			}
			if (typeof obj[currentKey] === "undefined"){
				obj[currentKey] = new Map();
			}
		
		} else if (lineMatchProperty != null){
		
			// Property in the current group
			if (typeof currentKey === "undefined") { continue; }
			let propertyName = lineMatchProperty.groups["propertyName"];
			let propertyValue = lineMatchProperty.groups["propertyValue"];
			obj[currentKey].set(propertyName, propertyValue);
		
		}
		
	}

	return obj;

}

module.exports = desktop2js;
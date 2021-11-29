const xml = require("fast-xml-parser");

/**
 * Convert a config file text into a JS readable object
 * @param {string} config - A config file contents
 * @returns {object} - The config's equivalent as a JS object.
 *                     sections are the object's keys,
 *                     key/values pairs are stored in their section's maps
 */
function config2js(config){

	const obj = new Object();
	let currentKey = undefined;
	const sectionRegex = /\[(?<sectionName>[^[\]]+)\]/;
	const propertyRegex = /(?<propertyName>\S+)\s?=\s?(?<propertyValue>.*)/i;

	for (const line of config.split("\n")){

		// Remove comment lines
		if (line.trimStart().startsWith("#")) continue;

		// Detect line type
		const lineMatchSection = line.match(sectionRegex);
		const lineMatchProperty = line.match(propertyRegex);

		if (lineMatchSection != null){

			// Section start
			currentKey = lineMatchSection.groups["sectionName"];
			if (typeof obj[currentKey] === "undefined"){
				obj[currentKey] = new Map();
			}

		} else if (lineMatchProperty != null){

			// Property in the current section
			if (typeof currentKey === "undefined") { continue; }
			const propertyName = lineMatchProperty.groups["propertyName"];
			const propertyValue = lineMatchProperty.groups["propertyValue"];
			obj[currentKey].set(propertyName, propertyValue);

		}

	}

	return obj;
}

/**
 * Convert a desktop entry text into a JS readable object
 * @param {string} desktopEntry - A desktop entry contents
 * @returns {object} - The entry's equivalent as a JS object.
 *                     groups are the object's keys,
 *                     key/values pairs are stored in their section's maps
 */
function desktop2js(desktopEntry){

	const obj = new Object();
	let currentKey = undefined;
	const groupName = /\[(?<groupName>[^[\]]+)\]/;
	const propertyRegex = /(?<propertyName>[^=]+)=(?<propertyValue>.*)/;

	for (const line of desktopEntry.split("\n")){

		const lineMatchProperty = line.match(propertyRegex);

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
			const propertyName = lineMatchProperty.groups["propertyName"];
			const propertyValue = lineMatchProperty.groups["propertyValue"];
			obj[currentKey].set(propertyName, propertyValue);

		}

	}

	return obj;

}

/**
 * Convert a XML text into a JS readable object
 * @param {string} config - A XML file contents
 * @returns {object} An object representing the XML data
 */
async function xml2js(config){
	const parser = new xml.XMLParser();
	return parser.parse(config);
}

module.exports = {
	config2js,
	desktop2js,
	xml2js,
};
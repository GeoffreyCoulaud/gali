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

// ? maybe use a stream instead if a text content for this
/**
 * Convert a XDG file text into a JS readable object
 * @param {string} fileContents - A XDG file contents
 * @returns {object} - The entry's equivalent as a JS object.
 *                     groups are the object's keys,
 *                     key/values pairs are stored in their section's maps
 */
function xdg2js(fileContents){

	const obj = new Object();
	let currentKey = undefined;
	const groupName = /\[(?<groupName>[^[\]]+)\]/;
	const propertyRegex = /(?<propertyName>[^=]+)=(?<propertyValue>.*)/;

	for (const line of fileContents.split("\n")){

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
			if (!currentKey) {
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
 * Convert a desktop entry text into a JS readable object
 * @param {string} desktopEntryContents - A desktop entry text
 * @returns {object} - The entry's equivalent as a JS object.
 *                     groups are the object's keys,
 *                     key/values pairs are stored in their section's maps
 */
function desktop2js(desktopEntryContents){
	return xdg2js(desktopEntryContents);
}

/**
 * Convert an icon theme's text into a JS readable object
 * @param {string} desktopEntryContents - An icon theme's text
 * @returns {object} - The entry's equivalent as a JS object.
 *                     groups are the object's keys,
 *                     key/values pairs are stored in their section's maps
 */
function theme2js(themeFileContents){
	return xdg2js(themeFileContents);
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

/**
 * A class representing a XML encoded value and the corresponding character
 * @property {string} code - The XML encoded value (ex: &amp;)
 * @property {string} char - The equivalent character (ex: &)
 */
class XMLSpecialChar{
	constructor(code, char){
		this.code = code;
		this.char = char;
	}
}

/**
 * Parse xml-encoded special characters in a text (like &amp; becoming &)
 * @param {string} text - The text containing xml-encoded characters
 * @returns {string} - The parsed text
 */
function xmlDecodeSpecialChars(text){
	const pairs = [
		new XMLSpecialChar("lt", "<"),
		new XMLSpecialChar("gt", ">"),
		new XMLSpecialChar("quot", "\""),
		new XMLSpecialChar("apos", "'"),
		new XMLSpecialChar("amp", "&")
	];
	for (const pair of pairs){
		const regex = new RegExp(`&${pair.code};`, "g");
		text = text.replace(regex, pair.char);
	}
	return text;
}

module.exports = {
	config2js,
	desktop2js,
	theme2js,
	xml2js,
	xmlDecodeSpecialChars,
};
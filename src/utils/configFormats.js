const xml = require("fast-xml-parser");
const vdf = require("vdf-parser");
const yml = require("yaml");

function parseConfigValue(str){
	const falseRegex = /false/i;
	const trueRegex = /true/i;

	if (!isNaN(str)){
		return Number(str);
	} else if (trueRegex.test(str)){
		return true;
	} else if (falseRegex.test(str)){
		return false;
	}

	return str;
}

/**
 * Convert a config file text into a JS readable object
 * @param {string} config - A config file contents
 * @returns {object} - The config's equivalent as a JS object.
 *                     sections are the object's keys,
 *                     key/values pairs are stored in their section
 */
function config2js(config){

	const obj = new Object();
	let currentSection = undefined;
	const sectionRegex = /\[(?<name>[^[\]]+)\]/;
	const propertyRegex = /(?<name>\S+)\s?=\s?(?<value>.*)/i;

	for (const line of config.split("\n")){

		// Remove comment lines
		if (line.trimStart().startsWith("#")) continue;

		// Detect line type
		const lineMatchSection = line.match(sectionRegex);
		const lineMatchProperty = line.match(propertyRegex);

		if (lineMatchSection != null){

			// Type section start
			currentSection = lineMatchSection.groups["name"];
			if (typeof obj[currentSection] === "undefined"){
				obj[currentSection] = new Object();
			}

		} else if (lineMatchProperty != null){

			// Type property in the current section
			if (typeof currentSection === "undefined") { continue; }
			const name = lineMatchProperty.groups["name"];
			const value = parseConfigValue(lineMatchProperty.groups["value"]);
			obj[currentSection][name] = value;

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
 *                     key/values pairs are stored in their section
 */
function xdg2js(fileContents){

	const obj = new Object();
	let currentSection = undefined;
	const sectionRegex = /\[(?<name>[^[\]]+)\]/;
	const propertyRegex = /(?<name>[^=]+)=(?<value>.*)/;

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
			currentSection = line.match(sectionRegex).groups["name"];
			if (!currentSection) { continue; }
			if (typeof obj[currentSection] === "undefined"){
				obj[currentSection] = new Object();
			}

		} else if (lineMatchProperty != null){

			// Property in the current group
			if (typeof currentSection === "undefined") { continue; }
			const name = lineMatchProperty.groups["name"];
			const value = parseConfigValue(lineMatchProperty.groups["value"]);
			obj[currentSection][name] = value;

		}

	}

	return obj;

}

/**
 * Convert a desktop entry text into a JS readable object
 * @param {string} desktopEntryContents - A desktop entry text
 * @returns {object} - The entry's equivalent as a JS object.
 *                     groups are the object's keys,
 *                     key/values pairs are stored in their section
 */
function desktop2js(desktopEntryContents){
	return xdg2js(desktopEntryContents);
}

/**
 * Convert an icon theme's text into a JS readable object
 * @param {string} desktopEntryContents - An icon theme's text
 * @returns {object} - The entry's equivalent as a JS object.
 *                     groups are the object's keys,
 *                     key/values pairs are stored in their section
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
 * Convert a VDF text into a JS readable object
 * @param {string} config - A VDF file contents
 * @returns {object} An object representing the VDF data
 */
async function vdf2js(config){
	return vdf.parse(config);
}

/**
 * Convert a YAML text into a JS readable object
 * @param {string} config - A YAML file contents
 * @returns {object} An object representing the YAML data
 */
async function yml2js(config){
	return yml.parse(config);
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
	vdf2js,
	yml2js,
};
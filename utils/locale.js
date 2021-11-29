const isIterable = require("./isIterable.js");
const process    = require("process");

const FB_LOCALES = ["en-US"];

/**
 * Check if a locale string is valid
 * @param {string} str - A locale string to test
 * @returns {boolean} - Whether the locale string can contruct a locale.
 */
function isValidLocale(str){
	try  {
		new Intl.Locale(str);
	} catch (error){
		return false;
	}
	return true;
}

/**
 * Sanitize a locale string value.
 * This removes the encoding bit (ex: .UTF-8) and the surrounding quotes.
 * @param {string} str - The locale string to prepare
 * @returns {string} - The sanitized locale string
 */
function sanitizeLocale(str){
	str = str.replace(/^"|"$/g, "");
	str = str.replace(/[.:].*/, "");
	str = str.replace(/_/, "-");
	return str;
}

/**
 * Get the user's locale preference for game metadata.
 * @param {boolean} onlyLanguageCode - Whether to return language codes or locales
 * @param {string[]} fallback - Fallback preferred locales
 * @returns {string[]} - An array of locales or language names
 * @see https://www.gnu.org/software/libc/manual/html_node/Using-gettextized-software.html
 */
function getUserLocalePreference(onlyLanguageCode = true, fallback = FB_LOCALES){

	const pe = process.env;
	let preferredLocales = [];

	// Add fallback locales to the list
	if (isIterable(fallback)){
		preferredLocales.push(...fallback);
	}

	// Get the user / OS locale
	if (pe.LANGUAGE){

		// Get multiple locales from env LANGUAGE
		const locales = pe.LANGUAGE.split(",");
		preferredLocales.splice(0, 0, ...locales);

	} else {

		// Get single locale from env
		const envLocales = [pe.LC_ALL, pe.LC_MESSAGES, pe.LANG];
		for (const envLocale of envLocales){
			if (envLocale){
				preferredLocales.splice(0, 0, envLocale);
				break;
			}
		}

	}

	// Sanitize locales
	preferredLocales = preferredLocales.map(str=>sanitizeLocale(str));

	// Return locales or language codes
	if (onlyLanguageCode){
		preferredLocales = preferredLocales.map((localeString)=>{
			const locale = new Intl.Locale(localeString);
			return locale.language;
		});
	}
	return preferredLocales;
}

module.exports = {
	getUserLocalePreference,
	isValidLocale,
};
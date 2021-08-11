import isIterable from "./isIterable.js";
import { osLocale } from "os-locale";

const DEFAULT_PREFERENCE = ["en-US", "ja-JP"];

/**
 * Get the user's locale preference for game metadata.
 * @param {boolean} onlyLanguageCode - If true, will return the language codes of the locales instead of the locales themselves.
 * @param {string[]} fallback - The fallback preferred locales in case the OS one can't be detected, by default "en" and "ja".
 * @returns {string[]} - An array of 2 letter locale names.
 */
export async function getUserLocalePreference(onlyLanguageCode = true, fallback = DEFAULT_PREFERENCE){
	let userLocale;
	let preferredLocales = [];

	// Add fallback locales to the list
	if (isIterable(fallback)){
		preferredLocales.push(...fallback);
	} 
	
	// Get the user / OS locale
	try { 
		userLocale = await osLocale(); 
	}
	catch (e){ 
		userLocale = undefined; 
	} 
	if (userLocale) { 
		preferredLocales.splice(0, 0, userLocale); 
	}

	// Return locales or language codes
	if (onlyLanguageCode){ 
		return preferredLocales.map(l=>(new Intl.Locale(l)).language);
	} else {
		return preferredLocales;
	}
}
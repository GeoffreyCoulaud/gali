const config = require("../utils/configFormats.js");
const locale = require("../utils/locale.js");
const { EmulationSource } = require("./EmulationSource.js");
const fsp = require("fs/promises");
const path = require("path");
const fs = require("fs");

/**
 * A class representing a WiiU emulator source.
 * You're not supposed to use it directly, instead use a descendent of this class.
 * @abstract
 */
class WiiUEmulationSource extends EmulationSource {

	/**
	 * Add a better name to a game
	 * @param {CemuGame} game - The game to add a longname to
	 * @param {object} metadata - The game's metadata
	 * @param {string[]} langs - An array of preferred language codes
	 * @private
	 */
	#getRPXGameLongname(game, metadata, langs) {

		// Get longname lang key from available lang options
		const keys = Object.entries(metadata.menu)
			.filter(([key, value])=>key.startsWith("longname_") && value)
			.map(([key, value])=>key.replace("longname_", ""));

		// Select a longname according to user locale
		let longnameKey;
		for (const lang of langs) {
			if (keys.includes(lang)) {
				longnameKey = `longname_${lang}`;
				break;
			}
		}
		if (!longnameKey) {
			return;
		}

		// Get longname in config
		let longname = metadata.menu[longnameKey];
		longname = config.xmlDecodeSpecialChars(longname);
		game.name = longname;
	}

	/**
	 * Add images to a game
	 * @param {CemuGame} game - The game to add images to
	 * @private
	 */
	#getRPXGameImages(game) {
		const gameMetaDir = path.resolve(`${game.path}/../../meta`);
		const images = {
			coverImage: `${gameMetaDir}/bootTvTex.tga`,
			iconImage: `${gameMetaDir}/iconTex.tga`,
		};
		for (const [key, value] of Object.entries(images)) {
			const imageExists = fs.existsSync(value);
			if (imageExists) {
				game[key] = value;
			}
		}
	}

	/**
	 * Get a RPX game's meta.xml data
	 * @param {CemuGame} game - A game to get metadata from
	 * @returns {object|undefined} - The game's metadata
	 * @access protected
	 */
	async _getRPXGameMetadata(game) {
		const filePath = path.resolve(`${game.path}/../../meta/meta.xml`);
		const fileContents = await fsp.readFile(filePath, "utf-8");
		const metadata = await config.xml2js(fileContents);
		return metadata;
	}

	/**
	 * Optional step, Precise RPX game properties
	 * This will add a better name, iconImage and coverImage.
	 * @param {CemuGame} game - The game to add metadata to
	 * @access protected
	 */
	async _getRPXGameProps(game) {
		const preferredLangs = locale.getUserLocalePreference(true);
		const metadata = await this._getRPXGameMetadata(game);
		this.#getRPXGameLongname(game, metadata, preferredLangs);
		this.#getRPXGameImages(game);
	}

}

module.exports = {
	WiiUEmulationSource
};
const gi = require("node-gtk");
const Gtk = gi.require("Gtk", "4.0");

const ImageButton = require("./ImageButton.js");

class MainWindowHeaderBar extends Gtk.HeaderBar {

	constructor() {
		super();

		// Left search bar
		const search = new Gtk.SearchEntry();
		search.placeholderText = "Search games";
		this.packStart(search);

		// Right button box
		const IMAGES_PATH = "UI/icons"; // ? Relative to what ?
		const buttonBox = new Gtk.Box();
		const scanButton = new ImageButton(`${IMAGES_PATH}/refresh_black_24dp.svg`);
		const sourcesButton = new ImageButton(`${IMAGES_PATH}/filter_alt_black_24dp.svg`);
		const settingsButton = new ImageButton(`${IMAGES_PATH}/menu_black_24dp.svg`);
		buttonBox.append(scanButton);
		buttonBox.append(sourcesButton);
		buttonBox.append(settingsButton);
		this.packEnd(buttonBox);
	}

}

module.exports = MainWindowHeaderBar;
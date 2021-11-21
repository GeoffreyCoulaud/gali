const gi = require("node-gtk");
const Gtk = gi.require("Gtk", "4.0");

const rootUI = `${__dirname}/root.xml`;

class BragGameGridChild extends Gtk.FlowBoxChild {

	static GTypeName = "BragGameGridChild";

	libraryIndex = -1;

	/**
	 * Create a game grid child widget
	 * @param {number} libraryIndex - The game's index in the library (-1 if not in library)
	 * @param {string} image - Absolute path to the game's cover image
	 * @param {string} name - The game's displayed name
	 */
	constructor(libraryIndex, image, name){
		super();

		this.libraryIndex = libraryIndex;

		const builder = Gtk.Builder.newFromFile(rootUI);
		const imageWidget = builder.getObject("image");
		const nameWidget = builder.getObject("name");
		const rootWidget = builder.getObject("root");

		imageWidget.setFilename(image);
		nameWidget.setLabel(name);
		this.setChild(rootWidget);
	}
}

module.exports = BragGameGridChild;
const fs  = require("fs");
const gi  = require("node-gtk");
const Gtk = gi.require("Gtk", "4.0");

const rootUI = `${__dirname}/root.xml`;

class BragGameGridChild extends Gtk.FlowBoxChild {

	static GTypeName = "BragGameGridChild";

	libraryIndex = -1;

	/**
	 * Create a game grid child widget
	 * @param {number} libraryIndex - The game index in the library
	 * @param {Game} game - The game to create a grid child from
	 */
	constructor(libraryIndex, game){
		super();

		this.libraryIndex = libraryIndex;

		const builder = Gtk.Builder.newFromFile(rootUI);
		const imageWidget = builder.getObject("image");
		const nameWidget = builder.getObject("name");
		const rootWidget = builder.getObject("root");

		let image = `${__dirname}/icons/white/image_not_found.svg`;
		if (fs.existsSync(game.boxArtImage)){
			image = game.boxArtImage;
		}
		imageWidget.setFilename(image);
		nameWidget.setLabel(game.name);
		this.setChild(rootWidget);
	}
}

module.exports = BragGameGridChild;
const gi = require("node-gtk");
const Gtk = gi.require("Gtk", "4.0");

class ImageButton extends Gtk.Button {
	constructor(file) {
		super();
		const image = new Gtk.Image();
		image.setFromFile(file);
		this.setChild(image);
	}
}

module.exports = ImageButton;
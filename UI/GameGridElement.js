const gi = require("node-gtk");
const Gtk = gi.require("Gtk", "4.0");

class GameGridElement extends Gtk.Box{
	constructor(image, title){
		super();

		// Image BG
		const imageWidget = new Gtk.Picture();
		imageWidget.setFilename(image);
		imageWidget.setCanShrink(true);
		imageWidget.setKeepAspectRatio(true);
		imageWidget.setHexpand(true);

		// Text title
		const titleWidget = new Gtk.Label();
		titleWidget.setLabel(title);

		this.setOrientation(Gtk.Orientation.VERTICAL);
		this.setValign(Gtk.Align.START);
		this.setVexpand(false);
		this.setHexpand(true);
		this.append(imageWidget);
		this.append(titleWidget);
	}
}

module.exports = GameGridElement;
const gi = require("node-gtk");
const Gtk = gi.require("Gtk", "4.0");
const { join: pathJoin } = require("path");

const rootUI = pathJoin(__dirname, "./root.xml");

class BragGameGridChild extends Gtk.FlowBoxChild {

	static GTypeName = "BragGameGridChild";

	constructor(image, name){
		super();

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
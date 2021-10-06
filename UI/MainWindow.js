const gi = require("node-gtk");
const Gtk = gi.require("Gtk", "4.0");

const MainWindowHeaderBar = require("./MainWindowHeaderBar");

class MainWindow extends Gtk.ApplicationWindow{
	constructor(app){
		super(app);

		// Custom header bar
		const headerBar = new MainWindowHeaderBar();
		this.setTitlebar(headerBar);
	}
}

module.exports = MainWindow;
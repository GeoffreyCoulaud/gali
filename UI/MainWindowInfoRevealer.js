const gi = require("node-gtk");
const Gtk = gi.require("Gtk", "4.0");

const ImageButton = require("./ImageButton.js");

class MainWindowInfoRevealer extends Gtk.Revealer{
	constructor(){
		super();

		// Title, hardware and platform
		const titleWidget = new Gtk.Label();
		titleWidget.setLabel("Super Tux Kart");
		const hardwareWidget = new Gtk.Label();
		hardwareWidget.setLabel("PC / Desktop entries");

		// Buttons box
		const buttonBox = new Gtk.Box();
		buttonBox.setHalign(Gtk.Align.CENTER);
		const IMAGES_PATH = "UI/icons/black"; // ? Relative to what ?
		const startButton = new ImageButton(`${IMAGES_PATH}/play_arrow.svg`);
		const stopButton = new ImageButton(`${IMAGES_PATH}/stop.svg`);
		const killButton = new ImageButton(`${IMAGES_PATH}/dangerous.svg`);
		buttonBox.append(startButton);
		buttonBox.append(stopButton);
		buttonBox.append(killButton);

		// Containing box
		const box = new Gtk.Box();
		box.setMarginBottom(4);
		box.setMarginStart(4);
		box.setMarginEnd(4);
		box.setOrientation(Gtk.Orientation.VERTICAL);
		box.append(titleWidget);
		box.append(hardwareWidget);
		box.append(buttonBox);
		this.setChild(box);
	}
}

module.exports = MainWindowInfoRevealer;
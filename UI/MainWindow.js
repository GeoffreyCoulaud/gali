const gi = require("node-gtk");
const Gtk = gi.require("Gtk", "4.0");

const GameGridElement = require("./GameGridElement.js");
const MainWindowHeaderBar = require("./MainWindowHeaderBar.js");
const MainWindowInfoRevealer = require("./MainWindowInfoRevealer.js");

class MainWindow extends Gtk.ApplicationWindow{
	constructor(app){
		super(app);

		// Custom header bar
		const headerBar = new MainWindowHeaderBar();
		this.setTitlebar(headerBar);

		// Bottom info revealer
		const infoRevealer = new MainWindowInfoRevealer();
		infoRevealer.setRevealChild(true);

		// Games grid
		const GRID_GAP = 4;
		const gamesGrid = new Gtk.FlowBox();
		gamesGrid.setRowSpacing(GRID_GAP);
		gamesGrid.setColumnSpacing(GRID_GAP);

		// TODO Fix the grid element sizing.
		// Elements in the grid should be the width of their picture ± gap.
		// They must not have random padding ! It's better to space them out 
		// with margins.

		// ! TEST - Sample game grid items
		/*
		const sampleGridElems = [];
		for (let i = 0; i < 10; i++){
			const sampleGridElem = new GameGridElement("UI/sample/doom_eternal_steam_boxart.jpg", "Doom Eternal");
			sampleGridElems.push(sampleGridElem);
			gamesGrid.insert(sampleGridElem, i);
		}
		*/

		// Games scrolled window
		const gamesScrolledWindow = new Gtk.ScrolledWindow();
		gamesScrolledWindow.setHasFrame(false);
		gamesScrolledWindow.setChild(gamesGrid);
		gamesScrolledWindow.setVexpand(true);


		// Wrap all elements and add to window
		const mainBox = new Gtk.Box();
		mainBox.setOrientation(Gtk.Orientation.VERTICAL);
		mainBox.append(gamesScrolledWindow);
		mainBox.append(infoRevealer);
		this.setChild(mainBox);
	}
}

module.exports = MainWindow;
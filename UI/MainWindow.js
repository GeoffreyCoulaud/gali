const gi = require("node-gtk");
const Gtk = gi.require("Gtk", "4.0");
const Gdk = gi.require("Gdk", "3.0");

const GameGrid = require("./GameGrid.js");
const GameGridElement = require("./GameGridElement.js");
const MainWindowHeaderBar = require("./MainWindowHeaderBar.js");
const MainWindowInfoRevealer = require("./MainWindowInfoRevealer.js");

class MainWindow extends Gtk.ApplicationWindow{

	gamesScrolledWindow = undefined;
	infoRevealer = undefined;
	gamesGrid = undefined;
	headerBar = undefined;
	mainBox = undefined;

	constructor(app){
		super(app);

		// Widgets
		this.gamesScrolledWindow = new Gtk.ScrolledWindow();
		this.infoRevealer = new MainWindowInfoRevealer();
		this.headerBar = new MainWindowHeaderBar();
		this.gamesGrid = new GameGrid();
		this.mainBox = new Gtk.Box();

		// Custom header bar
		this.setTitlebar(this.headerBar);

		// Bottom info revealer
		this.infoRevealer.setRevealChild(true);

		// TODO Set the number of columns dynamically with the available width
		// Games grid
		const GRID_GAP = 4;
		const COLUMNS = 5;
		this.gamesGrid.setGap(GRID_GAP);
		this.gamesGrid.setColumns(COLUMNS);

		// ! TEST - Sample game grid items
		const sampleGridElems = [];
		for (let i = 0; i < 10; i++){
			const sampleGridElem = new GameGridElement("UI/sample/stk_boxart.jpg", "Super Tux Kart");
			sampleGridElems.push(sampleGridElem);
			this.gamesGrid.insert(sampleGridElem, i);
		}

		// Games scrolled window
		this.gamesScrolledWindow.setHasFrame(false);
		this.gamesScrolledWindow.setChild(this.gamesGrid);
		this.gamesScrolledWindow.setVexpand(true);
		this.gamesScrolledWindow.setPolicy(Gtk.PolicyType.NEVER, Gtk.PolicyType.AUTOMATIC);

		// Wrap all elements and add to window
		this.mainBox.setOrientation(Gtk.Orientation.VERTICAL);
		this.mainBox.append(this.gamesScrolledWindow);
		this.mainBox.append(this.infoRevealer);

		// Bind event handlers
		this.bindEvents();

		this.setChild(this.mainBox);
	}

	/**
	 * Bind event handlers to child widgets
	 */
	bindEvents(){
		// TODO find a way to detect grid resize (better event)
		this.gamesGrid.on("child-activated", this.onGridResize.bind(this));
	}

	/**
	 * On resize, change the number of columns
	 */
	onGridResize(){
		const gridWidth = this.gamesGrid.getAllocatedWidth();
		const elemWidth = 256; // TODO determine a proper value
		const cols = Math.floor(gridWidth / elemWidth);
		this.gamesGrid.setColumns(cols);
		console.log("grid resize handler");
	}
}

module.exports = MainWindow;
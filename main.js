const gi          = require("node-gtk");
const GLib        = gi.require("GLib", "2.0");
const Gtk         = gi.require("Gtk", "4.0");
const preferences = require("./utils/preferences.js");
const Library     = require("./library.js");
const process     = require("process");
const BragMainWindow    = require("./UI/BragMainWindow/widget.js");
const BragGameGridChild = require("./UI/BragGameGridChild/widget.js");

// Main UI components
let mainWindow = null;
let loop = null;
let app = null;

// Main logic components
const userPreferences = preferences.readUserFileSafe();
const library = new Library(
	userPreferences.scan.enabledSources,
	userPreferences.scan.preferCache,
	userPreferences.scan.warnings
);

/**
 * Function called by the UI to start a scan and refresh the games shown
 */
function libraryScanUpdateUI(){

	// Show loading view
	mainWindow._viewStack.setVisibleChildName("loadingView");

	// Scan
	library.scan().then(()=>{

		// Clear game grid
		const grid = mainWindow._gameGridFlowBox;
		let currentChild = grid.getChildAtIndex(0);
		while (currentChild){
			grid.remove(currentChild);
			currentChild = grid.getChildAtIndex(0);
		}

		// Show library view
		mainWindow._viewStack.setVisibleChildName("libraryView");

		// TODO Add games to the grid
		// Temporary for testing : add dummy games
		for (let i = 0; i < 15; i++){
			const gameGridChild = new BragGameGridChild(
				`${__dirname}/UI/sample/stk_boxart.jpg`,
				"Super Tux Kart"
			);
			mainWindow._gameGridFlowBox.insert(gameGridChild, -1);
		}

	});
}

/**
 * Function called when the main window does a close request
 */
function onWindowCloseRequest(){
	process.exit(0);
}

/**
 * Function called when the app is activated
 */
function onAppActivate(){
	// Create the main window
	mainWindow = new BragMainWindow(app);
	mainWindow.on("close-request", onWindowCloseRequest);
	mainWindow.show();

	// Trigger library scan on startup
	libraryScanUpdateUI();

	gi.startLoop();
	loop.run();
}


// Start the app
loop = GLib.MainLoop.new(null, false);
app = new Gtk.Application("brag", 0);
app.on("activate", onAppActivate);

// Hack to not break the event loop because of node-gtk
setTimeout(
	()=>setImmediate(
		()=>{
			app.run();
		}
	)
);
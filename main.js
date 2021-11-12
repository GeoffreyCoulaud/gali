const gi = require("node-gtk");
const Gtk = gi.require("Gtk", "4.0");
const GLib = gi.require("GLib", "2.0");
const { join: pathJoin } = require("path");
const { readUserFileSafe } = require("./utils/preferences.js");
const Library = require("./library.js");
const BragMainWindow = require("./UI/BragMainWindow/widget.js");
const BragGameGridChild = require("./UI/BragGameGridChild/widget.js");

// Get user preferences from disk
const prefs = readUserFileSafe();

// Define main components
let mainWindow = undefined;
const GtkLoop = GLib.MainLoop.new(null, false);
const application = new Gtk.Application("brag", 0);
application.on("activate", onActivate);
const library = new Library(
	prefs.scan.enabledSources,
	prefs.scan.preferCache,
	prefs.scan.warnings
);

// -----------------------------------------------------------------------------
// Event handlers
// -----------------------------------------------------------------------------

/**
 * Handle application activation
 */
function onActivate(){

	// Create main window
	mainWindow = new BragMainWindow(application);
	mainWindow.on("close-request", onCloseRequest);
	mainWindow.show();
	mainWindow.present();

	// Trigger library scan on startup
	triggerScan();

	// TODO Remove later, temporary for testing
	// mainWindow._viewStack.setVisibleChildName("loadingView");
	// mainWindow._gameInfoRevealer.setRevealChild(true);

	gi.startLoop();
	GtkLoop.run();

}

/**
 * A function to trigger a library scan and update the view along the way.
 */
function triggerScan(){

	// !temp
	console.log("triggerscan started");

	// Show the loading view
	mainWindow._viewStack.setVisibleChildName("loadingView");

	// Clear game grid
	const grid = mainWindow._gameGridFlowBox;
	let currentChild = grid.getChildAtIndex(0);
	while (currentChild){
		grid.remove(currentChild);
		currentChild = grid.getChildAtIndex(0);
	}

	// Scan the library
	library.empty();
	library.scan().then(()=>{

		// TODO this code is not reached before the app closes.
		// See https://github.com/romgrk/node-gtk/issues/289
		// This is because the event loop is interrupted when
		// GLib's loop is running.

		// Add game to the grid
		// !temp
		console.log("Library scanned and found", library.games.length, "games");
		const dummyImage = pathJoin(__dirname, "./UI/sample/stk_boxart.jpg");
		const dummyName = "Super Tux Kart";
		for (let i = 0; i < 5; i++){
			const childWidget = new BragGameGridChild(dummyImage, dummyName);
			mainWindow._gameGridFlowBox.insert(childWidget, -1);
		}

		// Show library view
		mainWindow._viewStack.setVisibleChildName("libraryView");
	});

}

/**
 * Handle application close request
 */
function onCloseRequest(){

	GtkLoop.quit();
	application.quit();
	return false;

}

// -----------------------------------------------------------------------------

// Start the application
const status = application.run([]);
console.log("Exiting with status :", status);
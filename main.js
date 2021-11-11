const gi = require("node-gtk");
const Gtk = gi.require("Gtk", "4.0");
const GLib = gi.require("GLib", "2.0");
const { readUserFileSafe } = require("./utils/preferences.js");
const Library = require("./library.js");

// Import custom widgets
const BragMainWindow = require("./UI/BragMainWindow.js");
const BragGameGridChild = require("./UI/BragGameGridChild.js");

// Get user preferences from disk
const prefs = readUserFileSafe();

// Define main components
const GtkLoop = GLib.MainLoop.new(null, false);
const GtkApp = new Gtk.Application("brag", 0);
GtkApp.on("activate", onActivate);

// Scan the library then run app
const library = new Library(
	prefs.scan.enabledSources,
	prefs.scan.preferCache,
	prefs.scan.warnings
);
library.scan().then(()=>{
	console.log("Library scanned and found", library.games.length, "games");
	const status = GtkApp.run([]);
	console.log("Exiting with status :", status);
});

// -----------------------------------------------------------------------------
// Event handlers
// -----------------------------------------------------------------------------

/**
 * Handle application close request
 */
function onCloseRequest(){

	GtkLoop.quit();
	GtkApp.quit();
	return false;

}

/**
 * Handle application activation
 */
function onActivate(){

	const mainWindow = new BragMainWindow(GtkApp);
	mainWindow.on("close-request", onCloseRequest);
	mainWindow.show();
	mainWindow.present();

	// TODO Remove later, temporary for testing
	// -------------------------------------------------------------------------

	// Show game info revealer
	mainWindow._gameInfoRevealer.setRevealChild(true);

	// Add dummy games
	const dummyImage = "UI/sample/stk_boxart.jpg";
	const dummyName = "Super Tux Kart";
	for (let i = 0; i < 15; i++){
		const childWidget = new BragGameGridChild(dummyImage, dummyName);
		mainWindow._gameGridFlowBox.insert(childWidget, -1);
	}

	// -------------------------------------------------------------------------

	gi.startLoop();
	GtkLoop.run();

}
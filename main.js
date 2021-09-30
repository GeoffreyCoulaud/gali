const gi = require("node-gtk");
const Gtk = gi.require("Gtk", "4.0");
const GLib = gi.require("GLib", "2.0");
const { widgetHandleEvent } = require("./UI/gtkUtils.js");
const Library = require("./library.js");
const { PrefUtils } = require("./utils/preferences.js");

// Get user preferences from disk
const prefs = PrefUtils.readUserFileSafe();

// Define main components
const GtkLoop = GLib.MainLoop.new(null, false);
const GtkApp = new Gtk.Application("brag", 0);
GtkApp.on("activate", onActivate);
const library = new Library(
	prefs.scan.enabledSources,
	prefs.scan.preferCache,
	prefs.scan.warnings
);

// Scan the library then run app
library.scan().then(()=>{
	console.log("Library scanned and found", library.games.length, "games");
	const status = GtkApp.run([]);
	console.log("Exiting with status :", status);
});

// -----------------------------------------------------------------------------
// Event handlers
// -----------------------------------------------------------------------------

// TODO Implement these handlers
/*
refresh button triggers
	- library scan
	- grid refresh

filter button triggers
	- toggle sources menu under it

source menu box tick triggers
	- partial library scan
	- grid refresh

source menu box untick triggers
	- grid refresh (keep games in library)

search bar type triggers
	- grid refresh (keep games in library)

clicking on a game in grid triggers
	- updates info-bar's data
	- shows info-bar

game start triggers
	- stop and kill button show (if not startOnly)
	- start button hide
	- game highlight in grid

game stop (or kill) triggers
	- stop and kill button hide
	- start button show
	- removes highlight in grid
*/

/**
 * Handlers for game life cycle buttons
 */
function onStartButtonClicked(){
	console.log("Start button clicked");
}
function onStopButtonClicked(){
	console.log("Stop button clicked");
}
function onKillButtonClicked(){
	console.log("Kill button clicked");
}

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

	// Load UI definition from file
	const builder = new Gtk.Builder.newFromFile("UI/brag-launcher.cmb.ui");

	widgetHandleEvent(builder, "startGameButton", "clicked", onStartButtonClicked);
	widgetHandleEvent(builder, "stopGameButton", "clicked", onStopButtonClicked);
	widgetHandleEvent(builder, "killGameButton", "clicked", onKillButtonClicked);

	const mainWindow = builder.getObject("mainWindow");
	mainWindow.on("close-request", onCloseRequest);
	mainWindow.show();
	mainWindow.present();

	// Start app
	gi.startLoop();
	GtkLoop.run();

}
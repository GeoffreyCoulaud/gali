const gi = require("node-gtk");
const Gtk = gi.require("Gtk", "4.0");
const GLib = gi.require("GLib", "2.0");
const { widgetHandleEvent } = require("./UI/gtkUtils.js");

let GtkLoop = undefined;
let GtkApp = undefined;

/**
 * Event handler for the game life cycle buttons
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

// Start the app
GtkLoop = GLib.MainLoop.new(null, false);
GtkApp = new Gtk.Application("brag-launcher", 0);
GtkApp.on("activate", onActivate);
const status = GtkApp.run([]);
console.log("Exiting with status :", status);
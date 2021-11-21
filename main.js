const gi          = require("node-gtk");
const GLib        = gi.require("GLib", "2.0");
const Gtk         = gi.require("Gtk", "4.0");
const preferences = require("./utils/preferences.js");
const Library     = require("./library.js");
const process     = require("process");
const fs          = require("fs");
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
function onScanRequest(){

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

		// Add games to the grid
		const games = library.games;
		games.forEach((game, i)=>{
			let image = `${__dirname}/UI/icons/white/image_not_found.svg`;
			if (fs.existsSync(game.boxArtImage)){
				image = game.boxArtImage;
			}
			const gameGridChild = new BragGameGridChild(i, image, game.name);
			mainWindow._gameGridFlowBox.insert(gameGridChild, -1);
		});

	});
}

/**
 * Function called when the game grid's selected elements changes.
 * Please note that there is at most one selected child.
 */
function onGridSelectedChildChanged(){
	const selectedElements = mainWindow._gameGridFlowBox.getSelectedChildren();
	// Toggle info panel
	const isInfoPaneVisible = selectedElements.length > 0;
	mainWindow._gameInfoRevealer.setRevealChild(isInfoPaneVisible);
	// Update info panel data
	if (isInfoPaneVisible){
		const game = library.games?.[selectedElements[0].libraryIndex];
		if (game){
			mainWindow._gameInfoTitle.setLabel(game.name);
			mainWindow._gameInfoPlatform.setLabel(`${game.source} / ${game.platform}`);
		} else {
			console.warn("Info panel could not be updated, game isn't present in the library");
		}
	}
}

/**
 * Function called when the main window does a close request
 */
function onWindowCloseRequest(){
	process.exit(0);
}

/**
 * Function called when the main window is created to bind GTK signals (events)
 */
function bindMainWindowSignals(){
	mainWindow.on("close-request", onWindowCloseRequest);
	mainWindow._scanButton.on("clicked", onScanRequest);
	mainWindow._gameGridFlowBox.on("selected-children-changed", onGridSelectedChildChanged);
}

/**
 * Function called when the app is activated
 */
function onAppActivate(){
	// Create the main window
	mainWindow = new BragMainWindow(app);
	bindMainWindowSignals();
	mainWindow.show();

	// Trigger library scan on startup
	onScanRequest();

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
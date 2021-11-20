const gi = require("node-gtk");
const Gtk = gi.require("Gtk", "4.0");
const GLib = gi.require("GLib", "2.0");
const process = require("process");
const IPC = require("./utils/ipc.js");

const BragMainWindow    = require("./UI/BragMainWindow/widget.js");
const BragGameGridChild = require("./UI/BragGameGridChild/widget.js");

// App constants
let mainWindow = null;
let loop = null;
let app = null;

/**
 * Handle application close request
 */
function handleCloseRequest(){
	process.exit(0);
}

/**
 * Show the loading view and request a library scan to the main process.
 */
function requestScan(){
	mainWindow._viewStack.setVisibleChildName("loadingView");
	process.send(new IPC.Message(IPC.MessageType.RequestScan));
}

/**
 * Handle library scan end
 */
function handleScanHasEnded(){

	// Clear game grid
	const grid = mainWindow._gameGridFlowBox;
	let currentChild = grid.getChildAtIndex(0);
	while (currentChild){
		grid.remove(currentChild);
		currentChild = grid.getChildAtIndex(0);
	}

	// Show library view
	mainWindow._viewStack.setVisibleChildName("libraryView");

	// TODO Request games

	// ! Temporary for testing : add dummy games
	for (let i = 0; i < 15; i++){
		const gameGridChild = new BragGameGridChild(
			`${__dirname}/UI/sample/stk_boxart.jpg`,
			"Super Tux Kart"
		);
		mainWindow._gameGridFlowBox.insert(gameGridChild, -1);
	}

}

/**
 * Handle IPC messages sent from the main process
 * @param {IPC.Message} message - A message sent by the main process
 */
function handleMainMessage(message){
	console.log(`view ← main ${message.type.name}`);
	switch (message.type.name){
	// A requested library scan has finished
	case IPC.MessageType.ScanHasEnded.name:
		handleScanHasEnded(message.data);
		break;
	}
}
process.on("message", handleMainMessage);

// Start the app
loop = GLib.MainLoop.new(null, false);
app = new Gtk.Application("brag", 0);
app.on("activate", ()=>{

	// Create the main window
	mainWindow = new BragMainWindow(app);
	mainWindow.on("close-request", handleCloseRequest);
	mainWindow.show();

	// Trigger library scan on startup
	requestScan();

	gi.startLoop();
	loop.run();

});

// Hack to not break the event loop because of node-gtk
setTimeout(
	()=>setImmediate(
		()=>{
			app.run();
		}
	)
);
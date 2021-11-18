const { readUserFileSafe } = require("./utils/preferences.js");
const child_process = require("child_process");
const Library = require("./library.js");
const IPC = require("./utils/ipc.js");

// Main components
const preferences = readUserFileSafe();
const library = new Library(
	preferences.scan.enabledSources,
	preferences.scan.preferCache,
	preferences.scan.warnings
);

// Create view child process
let child_view = child_process.fork(`${__dirname}/view.js`, [], {});
child_view.on("message", handleViewMessage);
child_view.on("exit", handleViewExit);

/**
 * Handle messages sent from the view process
 * @param {IPC.Message} message - A message object passed from the child process
 */
function handleViewMessage(message){
	console.log(`main ← view ${message.type.name}`);
	switch (message.type.name){
	// View child process requests a library scan
	case IPC.MessageType.RequestScan.name:
		onScanRequest();
	}
}

/**
 * Handle the exit of the view process
 * @param {number} code - The child's exit code
 * @param {string} signal - The signal that terminated the child
 */
function handleViewExit(code, signal){
	if (code !== null){
		console.log("View process exited with code", code);
	} else {
		console.log("View process exited due to signal", signal);
	}
	child_view = null;
}

/**
 * Handle library scan requests from the view process
 */
function onScanRequest(){
	library.scan().then(()=>{
		child_view.send(new IPC.Message(IPC.MessageType.ScanHasEnded), (error)=>{
			if (error === null){
				console.log("\tScanHasEnded was sent successfully");
			} else {
				console.log("\tScanHasEnded could not be sent  :", error);
			}
		});
	});
}
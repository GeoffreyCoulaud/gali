const { app, BrowserWindow } = require("electron");
const { join: pathJoin } = require("path");

// App entry point file.
// The library is scanned, the UI is started and app management happens.

function createWindow(){
	const options = {
		width: 800,
		height: 600,
	};
	const mainWindow = new BrowserWindow(options);
	mainWindow.loadFile('frontend/main.html');
	mainWindow.webContents.openDevTools();
}

// Start the UI
app.whenReady().then(()=>{
	createWindow();
});

// Close the process when all windows are closed
app.on('window-all-closed', ()=>{
	app.quit()
})
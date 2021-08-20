// App entry point file.
// The library is scanned, the UI is started and app management happens.

const { app, BrowserWindow } = require("electron");

function createWindow(){
	const options = {
		width: 800,
		height: 600,
		autoHideMenuBar: true,
	};
	const mainWindow = new BrowserWindow(options);
	mainWindow.loadFile("frontend/index.html");
	mainWindow.webContents.openDevTools();
	mainWindow.maximize();
}

// Start the UI
app.whenReady().then(()=>{
	createWindow();
});

// Close the process when all windows are closed
app.on("window-all-closed", ()=>{
	app.quit();
});
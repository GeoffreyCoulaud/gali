const gi          = require("node-gtk");
const GLib        = gi.require("GLib", "2.0");
const Gtk         = gi.require("Gtk", "4.0");
const preferences = require("./utils/preferences.js");
const Library     = require("./library.js");
const process     = require("process");
const fs          = require("fs");
const BragMainWindow    = require("./UI/BragMainWindow/widget.js");
const BragGameGridChild = require("./UI/BragGameGridChild/widget.js");

class BragApp{

	// Main UI components
	mainWindow = undefined;
	loop = undefined;
	app = undefined;

	// Main logic components
	preferences = undefined;
	activeGame = undefined;
	library = undefined;

	constructor(){
		this.preferences = preferences.readUserFileSafe();
		this.library = new Library(
			this.preferences.scan.enabledSources,
			this.preferences.scan.preferCache,
			this.preferences.scan.warnings
		);
	}

	// ---------------------------- Regular methods ----------------------------

	/**
	 * Start the app
	 */
	start(){
		this.loop = GLib.MainLoop.new(null, false);
		this.app = new Gtk.Application("brag", 0);
		this.app.on("activate", this.onAppActivate);
		setTimeout(
			()=>setImmediate(
				()=>{
					this.app.run();
				}
			)
		);
	}

	/**
	 * Clear the games grid
	 */
	clearGrid(){
		const grid = this.mainWindow._gameGridFlowBox;
		let currentChild = grid.getChildAtIndex(0);
		while (currentChild){
			grid.remove(currentChild);
			currentChild = grid.getChildAtIndex(0);
		}
	}

	/**
	 * Get the selected game in the grid
	 * @returns {Game} - The selected game
	 */
	getActiveGame(){
		const selectedElements = this.mainWindow._gameGridFlowBox.getSelectedChildren();
		if (selectedElements.length === 0){ return undefined; }
		const game = this.library.games?.[selectedElements[0].libraryIndex];
		return game;
	}

	updateInfoPanel(){
		const g = this.activeGame;
		this.mainWindow._gameInfoRevealer.setRevealChild(!!g);
		if (g){
			this.mainWindow._gameInfoTitle.setLabel(g.name);
			this.mainWindow._gameInfoPlatform.setLabel(`${g.source} / ${g.platform}`);
		}
	}

	/**
	 * Do a library scan, clear the grid, add game to the grid
	 */
	scanLibraryThenRefreshGrid(){
		const grid = this.mainWindow._gameGridFlowBox;
		this.mainWindow._viewStack.setVisibleChildName("loadingView");
		this.library.scan().then(()=>{
			this.clearGrid();
			this.mainWindow._viewStack.setVisibleChildName("libraryView");
			this.library.games.forEach((game, i)=>{
				let image = `${__dirname}/UI/icons/white/image_not_found.svg`;
				if (fs.existsSync(game.boxArtImage)){
					image = game.boxArtImage;
				}
				const gameGridChild = new BragGameGridChild(i, image, game.name);
				grid.insert(gameGridChild, -1);
			});
		});
	}

	/**
	 * Bind UI event listeners to their handlers
	 */
	bindMainWindowSignals(){
		const w = this.mainWindow;
		w.on("close-request", this.onWindowCloseRequest);
		w._scanButton.on("clicked", this.onScanRequest);
		w._gameGridFlowBox.on("selected-children-changed", this.onActiveGameChange);
		w._gameStartButton.on("clicked", this.onStartGameRequest);
		w._gameStopButton.on("clicked", this.onStopGameRequest);
		w._gameKillButton.on("clicked", this.onKillGameRequest);
	}

	// ---------------------------- Event handlers -----------------------------

	onAppActivate = ()=>{
		this.mainWindow = new BragMainWindow(this.app);
		this.bindMainWindowSignals();
		this.mainWindow.show();
		this.scanLibraryThenRefreshGrid();
		gi.startLoop();
		this.loop.run();
	}

	onActiveGameChange = ()=>{
		this.activeGame = this.getActiveGame();
		this.updateInfoPanel();
	}

	onScanRequest = ()=>{
		this.scanLibraryThenRefreshGrid();
	}

	onWindowCloseRequest = ()=>{
		process.exit(0);
	}

	/**
	 * Handle game life cycle requests
	 * @param {string} methodName - A method of GameProcessContainer (start, stop, kill)
	 * @private
	 */
	_onGameLifeCycleRequest = (methodName)=>{
		const game = this.getActiveGame();
		if (game){
			game.processContainer[methodName]();
		}
	}

	// TODO Freeze the current element when starting it is requested
	onStartGameRequest = ()=>{
		this._onGameLifeCycleRequest("start");
	}

	onStopGameRequest = ()=>{
		this._onGameLifeCycleRequest("stop");
	}

	onKillGameRequest = ()=>{
		this._onGameLifeCycleRequest("kill");
	}

}

const app = new BragApp();
app.start();
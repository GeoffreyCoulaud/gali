// TODO -----------------------------
// Hehe check if any of this works :D
// I'm so fucking tired right now
// Ok byeeeeeeeeee
// ----------------------------------

const gi          = require("node-gtk");
const GLib        = gi.require("GLib", "2.0");
const Gtk         = gi.require("Gtk", "4.0");
const preferences = require("./utils/preferences.js");
const Library     = require("./library.js");
const process     = require("process");
const events      = require("events");
const fs          = require("fs");

const BragMainWindow    = require("./UI/BragMainWindow/widget.js");
const BragGameGridChild = require("./UI/BragGameGridChild/widget.js");

const EXIT_OK = 0;
const EXIT_UNKNOWN_CURRENT_UI_STATE = 1;
const EXIT_UNKNOWN_NEW_UI_STATE = 2;
const EXIT_NO_SELECTED_GAME = 3;

/**
 * A class mimicking an enum for UI states
 */
class UIState extends Symbol{
	static ScanningLibrary = new UIState("ScanningLibrary");
	static BrowsingLibrary = new UIState("BrowsingLibrary");
	static GameSelected = new UIState("GameSelected");
	static GameLifeCycle = new UIState("GameLifeCycle");

	constructor(name){
		super(name);
	}
}


/**
 * A class representing the app's UI
 */
class UI extends events.EventEmitter{

	state = UIState.BrowsingLibrary;
	loop = undefined;
	app = undefined;
	mw = undefined;

	/**
	 * Start the app's UI
	 */
	start(){
		this.loop = GLib.MainLoop.new(null, false);
		this.app = new Gtk.Application("brag", 0);
		this.app.on("activate", ()=>{
			this.mw = new BragMainWindow(this.app);
			this.mw.show();
			this.emit("activate");
			gi.startLoop();
			this.loop.run();
		});
		setTimeout(
			()=>setImmediate(
				()=>{
					this.app.run();
				}
			)
		);
	}

	/**
	 * Hide or show the main window headerBar controls
	 * @param {boolean} isVisible - True for shown, else false
	 */
	#toggleHeaderBarControls(isVisible){
		const ids = [
			"_gameSearch",
			"_scanButton",
			"_filterButton",
			"_settingsButton",
		];
		for (const id of ids){
			this.mw[id].setVisible(isVisible);
		}
	}

	/**
	 * Change the current state to the default one.
	 * Default state is UIState.BrowsingLibrary.
	 * @private
	 */
	#resetState(){
		// Go into browsing state
		switch (this.state){
		case UIState.ScanningLibrary:
			this.#toggleHeaderBarControls(true);
			this.mw._viewStack.setVisibleChildName("libraryView");
			break;
		case UIState.GameLifeCycle:
			this.#toggleHeaderBarControls(true);
			this.mw._viewStack.setVisibleChildName("libraryView");
			break;
		case UIState.BrowsingLibrary:
			break;
		case UIState.GameSelected:
			this.mw._gameInfoRevealer.setRevealChild(false);
			break;
		default:
			console.error(`Unexpected current UI state "${this.state.toString()}"`);
			process.exit(EXIT_UNKNOWN_CURRENT_UI_STATE);
			break;
		}
	}

	/**
	 * Change the current state to a new state from the default one.
	 * Default state is UIState.BrowsingLibrary.
	 * @private
	 */
	#changeStateTo(newState){
		switch (newState){
		case UIState.ScanningLibrary:
			this.#toggleHeaderBarControls(false);
			this.mw._viewStack.setVisibleChildName("scanningView");
			break;
		case UIState.GameLifeCycle:
			this.#toggleHeaderBarControls(false);
			this.mw._viewStack.setVisibleChildName("lifeCycleView");
			break;
		case UIState.GameSelected:
			this.mainWindow._gameInfoRevealer.setRevealChild(true);
			break;
		case UIState.BrowsingLibrary:
			break;
		default:
			console.error(`Unexpected new UI state "${newState.toString()}"`);
			process.exit(EXIT_UNKNOWN_NEW_UI_STATE);
			break;
		}
	}

	/**
	 * Change the UI's state
	 * @param {UIState} newState - The new UI state to go into
	 */
	changeState(newState){
		if (this.state.name === newState.name){
			return;
		}
		this.#resetState();
		this.#changeStateTo(newState);
	}

	/**
	 * Clear the games grid
	 */
	clearGrid(){
		let currentChild = this.mw._gameGridFlowBox.getChildAtIndex(0);
		while (currentChild){
			this.mw._gameGridFlowBox.remove(currentChild);
			currentChild = this.mw._gameGridFlowBox.getChildAtIndex(0);
		}
	}

	/**
	 * Add a game to the UI grid
	 * @param {number} index - The game's index in the library
	 * @param {Game} game - The game to add to the grid
	 */
	addGameToGrid(index, game){
		const gameGridChild = new BragGameGridChild(index, game);
		this.mw._gameGridFlowBox.insert(gameGridChild, -1);
	}

	/**
	 * Get the selected game's index
	 * @returns {number|undefined} - The selected game's index. Undefined if none.
	 */
	getSelectedGameIndex(){
		const selectedElements = this.mainWindow._gameGridFlowBox.getSelectedChildren();
		if (!selectedElements){ return undefined; }
		return selectedElements[0].libraryIndex;
	}

	/**
	 * Deselect the selected game
	 */
	deselectGame(){
		this.mw._gameGridFlowBox.unselectAll();
	}

	/**
	 * Updates the info panel with the given game info
	 * @param {Game} game - The game to get info from
	 */
	updateInfoPanel(game){
		this.mw._gameInfoTitle.setLabel(game.name);
		this.mw._gameInfoPlatform.setLabel(`${game.source} / ${game.platform}`);
	}

	/**
	 * Updated the life cycle panel game info
	 * @param {Game} game - The game to get info from
	 */
	updateLifeCyclePanel(game){
		let image = `${__dirname}/icons/white/image_not_found.svg`;
		if (fs.existsSync(game.coverImage)){
			image = game.coverImage;
		}
		this.mw._lifeCycleInfoPicture.setFilename(image);
		this.mw._lifeCycleInfoTitle.setLabel(game.name);
		this.mw._lifeCycleInfoPlatform.setLabel(`${game.source} / ${game.platform}`);
	}

}

class BragApp{

	ui = new UI();
	#selectedGame = undefined;
	preferences = undefined;
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
	 * @public
	 */
	start(){
		this.UI.start();
		this.UI.on("activate", ()=>{
			this.#bindUISignals();
			this.#scan();
		});
	}

	/**
	 * Bind UI signals to their handlers
	 * @private
	 */
	#bindUISignals(){
		const binds = [
			{
				widget: this.UI.mw,
				event: "close-request",
				handler: this.#onCloseRequest
			}, {
				widget: this.UI.mw._scanButton,
				event: "clicked",
				handler: this.#onScanRequest,
			}, {
				widget: this.UI.mw._gameGridFlowBox,
				event: "selected-children-changed",
				handler: this.#onSelectedGameChange,
			}, {
				widget: this.UI.mw._gameStartButton,
				event: "clicked",
				handler: this.#onStartGameRequest,
			}, {
				widget: this.UI.mw._gameStopButton,
				event: "clicked",
				handler: this.#onStopGameRequest,
			}, {
				widget: this.UI.mw._gameKillButton,
				event: "clicked",
				handler: this.#onKillGameRequest,
			},
		];
		for (const b of binds){
			b.widget.on(b.event, b.handler);
		}
	}

	/**
	 * Do a library scan, clear the grid, add games to the grid
	 * @private
	 */
	#scan(){
		this.UI.changeState(UIState.ScanningLibrary);
		this.library.scan().then(()=>{
			this.UI.clearGrid();
			this.library.games.forEach((game, i)=>{
				this.UI.addGameToGrid(i, game);
			});
			this.UI.changeState(UIState.BrowsingLibrary);
		});
	}

	// ---------------------------- Event handlers -----------------------------

	/**
	 * Handle change of the selected game in the UI
	 * @private
	 */
	#onSelectedGameChange = ()=>{
		const index = this.UI.getActiveGameIndex();
		const game = this.library.games[index];
		if (typeof index === "undefined"){
			// No game selected
			this.UI.changeState(UIState.BrowsingLibrary);
		} else if (!game){
			// An invalid game is selected
			console.error("Selected game is broken");
			this.UI.changeState(UIState.BrowsingLibrary);
			this.UI.deselectGame();
		} else {
			// A valid game is selected
			this.UI.changeState(UIState.GameSelected);
			this.UI.updateInfoPanel(game);
		}
		this.#selectedGame = game;
	}

	/**
	 * Handle a scan request from the UI or the itself
	 * @private
	 */
	#onScanRequest = ()=>{
		this.#scan();
	}

	/**
	 * Handle a close request from the UI
	 * @private
	 */
	#onCloseRequest = ()=>{
		process.exit(EXIT_OK);
	}

	/**
	 * Handle a start game request from the UI
	 * @private
	 */
	#onStartGameRequest = ()=>{
		if (!this.#selectedGame){
			console.error("This is not supposed to happen... You can't start \"nothing\" !");
			process.exit(EXIT_NO_SELECTED_GAME);
		}
		console.log(`Starting ${this.#selectedGame.name}`);

		// Handle start outcomes
		const onSpawn = ()=>{
			this.UI.updateLifeCyclePanel(this.#selectedGame);
			this.UI.changeState(UIState.GameLifeCycle);
		};
		const onError = (message)=>{
			console.error(`Game start error : ${message}`);
		};
		const onExit = (code, signal)=>{
			if (code){
				console.warn("Game child process exited with code", code);
			} else {
				console.log("Game child process exited");
			}
			this.#selectedGame.processContainer.off("error", onError);
			this.UI.changeState(UIState.GameSelected);
		};
		this.#selectedGame.processContainer.once("spawn", onSpawn);
		this.#selectedGame.processContainer.once("exit", onExit);
		this.#selectedGame.processContainer.on("error", onError);

		// Start the game
		this.#selectedGame.processContainer.start();
	}

	/**
	 * Handle a stop game request from the UI
	 * @private
	 */
	#onStopGameRequest = ()=>{
		if (!this.#selectedGame){
			console.warn("Tried to stop undefined selected game");
			return;
		}
		this.#selectedGame.processContainer.stop();
	}

	/**
	 * Handle a kill game request from the UI
	 * @private
	 */
	#onKillGameRequest = ()=>{
		if (!this.#selectedGame){
			console.warn("Tried to kill undefined selected game");
			return;
		}
		this.#selectedGame.processContainer.kill();
	}

}

const app = new BragApp();
app.start();
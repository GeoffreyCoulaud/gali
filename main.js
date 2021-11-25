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

const FALLBACK_IMAGE_BOXART = `${__dirname}/icons/white/image_not_found.svg`;
const FALLBACK_IMAGE_COVER = FALLBACK_IMAGE_BOXART; // TODO add another image

/**
 * Get a fallback for an file path in case it's unreadable / missing.
 * @param {string|undefined} file - The file to try to get.
 *                                  Undefined is handled.
 * @returns {string} Final file path
 */

function fileWithFallback(file, fallback){
	if (file){
		if (fs.existsSync(file)){
			return file;
		}
	}
	return fallback;
}

/**
 * A class representing the app's UI
 */
class UI extends events.EventEmitter{

	/**
	 * A class mimicking an enum for UI states
	 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol
	 */
	static State = class extends Symbol{
		static LibraryScan = Symbol("ScanningLibrary");
		static LibraryBrowsing = Symbol("LibraryBrowsing");
		static LibraryGameSelected = Symbol("LibraryGameSelected");
		static GameRunning = Symbol("GameRunning");
	}

	state = UI.State.LibraryBrowsing;
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
	 * Change the current state to the default one.
	 * Default state is UI.State.LibraryBrowsing.
	 * @private
	 */
	#resetState(){
		// Go into browsing state
		switch (this.state){
		case UI.State.LibraryScan:
			this.mw.toggleHeaderBarControls(true);
			this.mw.setLibraryView();
			break;
		case UI.State.GameRunning:
			this.mw.toggleHeaderBarControls(true);
			this.mw.setLibraryView();
			break;
		case UI.State.LibraryBrowsing:
			break;
		case UI.State.LibraryGameSelected:
			this.mw.toggleInfoPanel(false);
			break;
		default:
			console.error(`Unexpected current UI state "${this.state.toString()}"`);
			process.exit(EXIT_UNKNOWN_CURRENT_UI_STATE);
			return;
		}
		this.state = UI.State.LibraryBrowsing;
	}

	/**
	 * Change the current state to a new state from the default one.
	 * Default state is UI.State.LibraryBrowsing.
	 * @private
	 */
	#changeStateTo(newState){
		switch (newState){
		case UI.State.LibraryScan:
			this.mw.toggleHeaderBarControls(false);
			this.mw.setScanningView();
			break;
		case UI.State.GameRunning:
			this.mw.toggleHeaderBarControls(false);
			this.mw.setGameRunningView();
			break;
		case UI.State.LibraryGameSelected:
			this.mw.toggleInfoPanel(true);
			break;
		case UI.State.LibraryBrowsing:
			break;
		default:
			console.error(`Unexpected new UI state "${newState.toString()}"`);
			process.exit(EXIT_UNKNOWN_NEW_UI_STATE);
			return;
		}
		this.state = newState;
	}

	/**
	 * Change the UI's state
	 * @param {UI.State} newState - The new UI state to go into
	 */
	changeState(newState){
		if (this.state === newState){
			return;
		}
		console.log(`Changing state : ${this.state.toString()} → ${newState.toString()}`);
		this.#resetState();
		this.#changeStateTo(newState);
	}

	/**
	 * Clear the games grid
	 */
	clearGamesGrid(){
		this.mw.clearGamesGrid();
	}

	/**
	 * Add a game to the UI grid
	 * @param {number} index - The game's index in the library
	 * @param {Game} game - The game to add to the grid
	 */
	addGameToGrid(index, game){
		const widget = new BragGameGridChild(index, game);
		this.mw.addGameGridChild(widget);
	}

	/**
	 * Get the selected game's index
	 * @returns {number|undefined} - The selected game's index. Undefined if none.
	 */
	getSelectedGameIndex(){
		const widget = this.mw.getSelectedGameWidget();
		if (!widget){
			return undefined;
		} else {
			return widget.libraryIndex;
		}
	}

	/**
	 * Deselect the selected game
	 */
	deselectGame(){
		this.mw.deselectGame();
	}

	/**
	 * Updates the info panel with the given game info
	 * @param {Game} game - The game to get info from
	 */
	updateInfoPanel(game){
		const image = fileWithFallback(game.coverImage, FALLBACK_IMAGE_COVER);
		this.mw.updateInfoPanel(image, game.name, `${game.source} / ${game.platform}`);
	}

	/**
	 * Updates the game running panel game info
	 * @param {Game} game - The game to get info from
	 */
	updateGameRunningPanel(game){
		const image = fileWithFallback(game.coverImage, FALLBACK_IMAGE_COVER);
		this.mw.updateGameRunningPanel(image, game.name, `${game.source} / ${game.platform}`);
	}

}

class BragApp{

	UI = new UI();
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
	 * Bind UI signals to their handlers.
	 * Must run after the UI activates, since it references children widgets.
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
		this.UI.changeState(UI.State.LibraryScan);
		this.library.scan().then(()=>{
			this.UI.clearGamesGrid();
			this.library.games.forEach((game, i)=>{
				this.UI.addGameToGrid(i, game);
			});
			this.UI.changeState(UI.State.LibraryBrowsing);
		});
	}

	// ---------------------------- Event handlers -----------------------------

	/**
	 * Handle change of the selected game in the UI
	 * @private
	 */
	#onSelectedGameChange = ()=>{
		const index = this.UI.getSelectedGameIndex();
		const game = this.library.games[index];
		if (typeof index === "undefined"){
			// No game selected
			this.UI.changeState(UI.State.LibraryBrowsing);
		} else if (typeof game === "undefined"){
			// An invalid game is selected
			console.error("Selected game is broken");
			this.UI.deselectGame();
		} else {
			// A valid game is selected
			this.UI.changeState(UI.State.LibraryGameSelected);
			this.UI.updateInfoPanel(game);
		}
		this.#selectedGame = game;
	}

	/**
	 * Handle a scan request from the UI or the itself
	 * @private
	 */
	#onScanRequest = ()=>{
		// TODO Fix : can freeze the app sometimes (clicked too early, too fast)
		const forbiddenStates = [
			UI.State.LibraryScan,
			UI.State.GameRunning,
		];
		if (forbiddenStates.includes(this.UI.state)){
			return;
		} else {
			this.#scan();
		}
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
			// Can happen if there's a transition set for the revealer.
			// 1. User selects a game, the state changes and the panel is shown
			// 2. User deselects, the panel starts to hide
			// 3. User clicks on start before the panel is hidden
			console.error("Tried to start undefined game");
			return;
		}

		// Handle start outcomes
		const onSpawn = ()=>{
			this.UI.updateGameRunningPanel(this.#selectedGame);
			this.UI.changeState(UI.State.GameRunning);
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
			this.UI.changeState(UI.State.LibraryGameSelected);
		};
		this.#selectedGame.processContainer.once("spawn", onSpawn);
		this.#selectedGame.processContainer.once("exit", onExit);
		this.#selectedGame.processContainer.on("error", onError);

		// Start the game
		console.log(`Starting ${this.#selectedGame.name}`);
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
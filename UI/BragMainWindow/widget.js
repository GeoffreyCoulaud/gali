const gi = require("node-gtk");
const Gtk = gi.require("Gtk", "4.0");

const headerBarUI = `${__dirname}/headerBar.xml`;
const rootUI = `${__dirname}/root.xml`;

class BragMainWindow extends Gtk.ApplicationWindow{

	static GTypeName = "BragMainWindow"

	static EXPOSED_CHILDREN_IDS = [

		// Header bar IDs
		"gameSearch",
		"headerBarButtonsBox",
		"scanButton",
		"filterButton",
		"settingsButton",

		// View changer IDs
		"viewStack",

		// Library view IDs
		"gameGridScrolledWindow",
		"gameGridViewport",
		"gameGridFlowBox",

		// Selected game view IDs
		"infoPanelRevealer",
		"infoPanelTitle",
		"infoPanelPlatform",
		"gameStartButton",

		// Life cycle view IDs
		"gameRunningPanelPicture",
		"gameRunningPanelTitle",
		"gameRunningPanelPlatform",
		"gameStopButton",
		"gameKillButton",
	];

	constructor(app){
		super(app);

		// Build UI from XML
		const builder = new Gtk.Builder();
		builder.addFromFile(headerBarUI);
		builder.addFromFile(rootUI);

		// Add header bar
		const headerBar = builder.getObject("headerBar");
		this.setTitlebar(headerBar);
		this.setTitle("Brag");

		// Add content root
		const root = builder.getObject("viewStack");
		this.setChild(root);

		// Set game grid ScrolledWindow policy
		const scrolledWindow = builder.getObject("gameGridScrolledWindow");
		scrolledWindow.setPolicy(
			Gtk.PolicyType.NEVER, // No horizontal scrollbar
			Gtk.PolicyType.ALWAYS // Auto vertical scrollbar
		);

		// Expose children widgets, prefixing them as gjs does
		// See https://gjs.guide/guides/gtk/3/14-templates.html#loading-the-template
		for (const id of BragMainWindow.EXPOSED_CHILDREN_IDS){
			this["_"+id] = builder.getObject(id);
		}
	}

	/**
	 * Hide or show the main window headerBar controls
	 * @param {boolean} isVisible - True for visible, else false
	 */
	toggleHeaderBarControls(isVisible){
		const ids = ["_gameSearch", "_headerBarButtonsBox"];
		for (const id of ids){
			this[id].setVisible(isVisible);
		}
	}

	/**
	 * Hide or show the main window info panel
	 * @param {boolean} isVisible - True for visible, else false
	 */
	toggleInfoPanel(isVisible){
		this._infoPanelRevealer.setRevealChild(isVisible);
	}

	/**
	 * Change the current view visible in the stack
	 * @param {string} name - The view stack child name
	 */
	#changeView(name){
		this._viewStack.setVisibleChildName(name);
	}
	setLibraryView(){
		this.#changeView("libraryView");
	}
	setScanningView(){
		this.#changeView("scanningView");
	}
	setGameRunningView(){
		this.#changeView("gameRunningView");
	}

	/**
	 * Clear the games grid
	 */
	clearGamesGrid(){
		let currentChild = this._gameGridFlowBox.getChildAtIndex(0);
		while (currentChild){
			this._gameGridFlowBox.remove(currentChild);
			currentChild = this._gameGridFlowBox.getChildAtIndex(0);
		}
	}

	/**
	 * Add a game to the UI grid
	 * @param {BragGameGridChild} widget - The game widget to add
	 */
	addGameGridChild(widget){
		this._gameGridFlowBox.insert(widget, -1);
	}

	/**
	 * Get the game widget that is currently selected
	 * @returns {BragGameGridChild|undefined} The currently selected widget
	 */
	getSelectedGameWidget(){
		return this._gameGridFlowBox.getSelectedChildren()[0];
	}

	/**
	 * Deselect the selected game
	 */
	deselectGame(){
		this._gameGridFlowBox.unselectAll();
	}

	/**
	 * Updates the info panel with the given game info
	 * @param {string} image - Path to the game cover image to display
	 * @param {string} title - Title (name) to display
	 * @param {string} platform - Platform to display
	 */
	updateInfoPanel(image, title, platform){
		// TODO - Add image (new UI)
		this._infoPanelTitle.setLabel(title);
		this._infoPanelPlatform.setLabel(platform);
	}

	/**
	 * Updates the game running panel with the given game info
	 * @param {string} image - Path to the game cover image to display
	 * @param {string} title - Title (name) to display
	 * @param {string} platform - Platform to display
	 */
	updateGameRunningPanel(image, title, platform){
		this._gameRunningPanelPicture.setFilename(image);
		this._gameRunningPanelTitle.setLabel(title);
		this._gameRunningPanelPlatform.setLabel(platform);
	}

}

module.exports = BragMainWindow;
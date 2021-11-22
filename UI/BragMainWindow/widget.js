const gi = require("node-gtk");
const Gtk = gi.require("Gtk", "4.0");

const headerBarUI = `${__dirname}/headerBar.xml`;
const rootUI = `${__dirname}/root.xml`;

class BragMainWindow extends Gtk.ApplicationWindow{

	static GTypeName = "BragMainWindow"

	static EXPOSED_CHILDREN_IDS = [

		// Header bar IDs
		"gameSearch",
		"scanButton",
		"filterButton",
		"settingsButton",

		// Root child IDs
		"viewStack",

		// Library view IDs
		"gameGridScrolledWindow",
		"gameGridViewport",
		"gameGridFlowBox",
		"gameInfoRevealer",
		"gameInfoTitle",
		"gameInfoPlatform",
		"gameStartButton",
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

}

module.exports = BragMainWindow;
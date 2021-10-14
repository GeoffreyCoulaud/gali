const gi = require("node-gtk");
const Gtk = gi.require("Gtk", "4.0");

class GameGrid extends Gtk.FlowBox{
	constructor(){
		super();
		const GRID_GAP = 4;
		this.setGap(GRID_GAP);
	}

	// Gtk row and column spacing
	gap = 0;
	setGap(value){
		this.setRowSpacing(value);
		this.setColumnSpacing(value);
	}
	getGap(){
		return this.gap;
	}

	// Set the exact number of columns
	setColumns(columns){
		this.setMinChildrenPerLine(columns);
		this.setMaxChildrenPerLine(columns);
	}
}
module.exports = GameGrid;
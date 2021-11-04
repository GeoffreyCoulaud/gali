const gi = require("node-gtk");
const Gtk = gi.require("Gtk", "4.0");

const ROOT_UI = `
<?xml version="1.0" encoding="UTF-8"?>
<interface>
	<object class="GtkBox" id="root">
		<property name="orientation">vertical</property>
		<property name="hexpand">true</property>
		<child>
			<object class="GtkPicture" id="image">
				<property name="can-shrink">true</property>
				<property name="hexpand">true</property>
				<property name="keep-aspect-ratio">true</property>
			</object>
		</child>
		<child>
			<object class="GtkLabel" id="label">
				<property name="label">Super Tux Kart</property>
			</object>
		</child>
	</object>
</interface>
`;

class BragGameGridElement extends Gtk.FlowBoxChild{

	static GTypeName = "GameGridElement";
	static EXPOSED_CHILDREN_IDS = [
		"image",
		"label",
		"root",
	];

	constructor(image, title){
		super();

		// Send data to the image and label widgets
		const builder = Gtk.Builder.newFromString(ROOT_UI, ROOT_UI.length);
		const imageWidget = builder.getObject("image");
		const titleWidget = builder.getObject("label");
		imageWidget.setFilename(image);
		titleWidget.setLabel(title);

		// Set box as child
		const box = builder.getObject("root");
		this.setChild(box);

		this.setHexpand(true);

		// Expose children widgets
		for (const id of BragGameGridElement.EXPOSED_CHILDREN_IDS){
			this["_"+id] = builder.getObject(id);
		}

	}
}

module.exports = BragGameGridElement;
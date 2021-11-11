const gi = require("node-gtk");
const Gtk = gi.require("Gtk", "4.0");

const CHILDREN_UI = `
<?xml version="1.0" encoding="UTF-8"?>
<interface>
	<object class="GtkBox" id="root">
		<property name="orientation">vertical</property>
		<child>
			<object class="GtkPicture" id="image">
				<property name="can-shrink">true</property>
				<property name="keep-aspect-ratio">true</property>
			</object>
		</child>
		<child>
			<object class="GtkLabel" id="name">
			</object>
		</child>
	</object>
</interface
`;

class BragGameGridChild extends Gtk.FlowBoxChild{
	constructor(image, name){
		super();

		const builder = Gtk.Builder.newFromString(CHILDREN_UI, CHILDREN_UI.length);
		const imageWidget = builder.getObject("image");
		const nameWidget = builder.getObject("name");
		const rootWidget = builder.getObject("root");

		imageWidget.setFilename(image);
		nameWidget.setLabel(name);
		this.setChild(rootWidget);
	}
}

module.exports = BragGameGridChild;
const gi = require("node-gtk");
const Gtk = gi.require("Gtk", "4.0");

const HEADER_BAR_UI = `
<?xml version="1.0" encoding="UTF-8"?>
<interface>
	<object class="GtkHeaderBar" id="headerBar">
	<child type="start">
		<object class="GtkSearchEntry" id="gameSearch">
			<property name="placeholder-text">Search games</property>
		</object>
	</child>
	<child type="end">
		<object class="GtkBox">
			<child>
				<object class="GtkButton" id="scanButton">
					<child>
						<object class="GtkImage">
							<property name="file">UI/icons/black/refresh.svg</property>
						</object>
					</child>
				</object>
			</child>
			<child>
				<object class="GtkButton" id="filterButton">
					<child>
						<object class="GtkImage">
							<property name="file">UI/icons/black/filter.svg</property>
						</object>
					</child>
				</object>
			</child>
			<child>
				<object class="GtkButton" id="settingsButton">
					<child>
						<object class="GtkImage">
							<property name="file">UI/icons/black/menu.svg</property>
						</object>
					</child>
				</object>
			</child>
		</object>
	</child>
	</object>
</interface>
`;

const ROOT_UI = `
<?xml version="1.0" encoding="UTF-8"?>
<interface>
	<object class="GtkBox" id="root">
		<property name="orientation">vertical</property>
		<child>
			<object class="GtkScrolledWindow" id="gameGridScrolledWindow">
				<property name="has-frame">false</property>
				<property name="vexpand">true</property>
				<child>
					<object class="GtkFlowBox" id="gameGridFlowBox">
						<property name="row-spacing">4</property>
						<property name="column-spacing">4</property>
						<property name="min-children-per-line">5</property>
						<property name="max-children-per-line">5</property>
					</object>
				</child>
			</object>
		</child>
		<child>
			<object class="GtkRevealer" id="gameInfoRevealer">
				<child>
					<object class="GtkBox">
						<property name="margin-bottom">4</property>
						<property name="margin-start">4</property>
						<property name="margin-end">4</property>
						<property name="orientation">vertical</property>
						<child>
							<object class="GtkLabel" id="gameInfoTitle">
								<property name="label">Super Tux Kart</property>
							</object>
						</child>
						<child>
							<object class="GtkLabel" id="gameInfoPlatform">
								<property name="label">PC / Desktop entries</property>
							</object>
						</child>
						<child>
							<object class="GtkBox">
								<property name="halign">center</property>
								<child>
									<object class="GtkButton">
										<child>
											<object class="GtkImage">
												<property name="file">UI/icons/black/play_arrow.svg</property>
											</object>
										</child>
									</object>
								</child>
								<child>
									<object class="GtkButton">
										<child>
											<object class="GtkImage">
												<property name="file">UI/icons/black/stop.svg</property>
											</object>
										</child>
									</object>
								</child>
								<child>
									<object class="GtkButton">
										<child>
											<object class="GtkImage">
												<property name="file">UI/icons/black/dangerous.svg</property>
											</object>
										</child>
									</object>
								</child>
							</object>
						</child>
					</object>
				</child>
			</object>
		</child>
	</object>
</interface>
`;

class BragMainWindow extends Gtk.ApplicationWindow{

	static GTypeName = "BragMainWindow"

	static EXPOSED_CHILDREN_IDS = [
		"gameSearch",
		"scanButton",
		"filterButton",
		"settingsButton",
		"gameGridScrolledWindow",
		"gameGridFlowBox",
		"gameInfoRevealer",
		"gameInfoTitle",
		"gameInfoPlatform",
	];

	constructor(app){
		super(app);

		// Build UI from XML
		const builder = new Gtk.Builder();
		builder.addFromString(HEADER_BAR_UI, HEADER_BAR_UI.length);
		builder.addFromString(ROOT_UI, ROOT_UI.length);

		// Add header bar
		const headerBar = builder.getObject("headerBar");
		this.setTitlebar(headerBar);
		this.setTitle("Brag");

		// Add content root
		const root = builder.getObject("root");
		this.setChild(root);

		// Set game grid ScrolledWindow policy
		const scrolledWindow = builder.getObject("gameGridScrolledWindow");
		scrolledWindow.setPolicy(
			Gtk.PolicyType.NEVER, // No horizontal scrollbar
			Gtk.PolicyType.AUTOMATIC // Auto vertical scrollbar
		);

		// Expose children widgets, prefixing them as gjs does
		// See https://gjs.guide/guides/gtk/3/14-templates.html#loading-the-template
		for (const id of BragMainWindow.EXPOSED_CHILDREN_IDS){
			this["_"+id] = builder.getObject(id);
		}
	}

}

module.exports = BragMainWindow;
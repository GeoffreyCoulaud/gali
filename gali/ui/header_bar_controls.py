from gi.repository import Gtk, Gio, Adw
from gali.sources.all_sources import all_sources

class HeaderBarControls(Gtk.Box):

    filter_popover = None

    def __init__(self, **kwargs):
        super().__init__(**kwargs)

        # Filter button
        filter_popover_content = Gtk.Box(orientation=Gtk.Orientation.VERTICAL)
        for klass in all_sources:
            source = klass()
            check_button = Gtk.CheckButton.new_with_label(source.name)
            filter_popover_content.append(check_button)
        self.filter_popover = Gtk.Popover()
        self.filter_popover.set_child(filter_popover_content)
        self.filter_popover.set_position(Gtk.PositionType.BOTTOM)
        filter_icon = Adw.ButtonContent(icon_name="funnel-symbolic")
        filter_button_content = Gtk.Box()
        filter_button_content.append(self.filter_popover)
        filter_button_content.append(filter_icon)
        filter_button = Gtk.Button()
        filter_button.connect("clicked", self.on_filter_button_clicked)
        filter_button.set_child(filter_button_content)
        self.append(filter_button)

        # Menu button
        menu = Gio.Menu()
        menu.append("Scan Library", "app.scan")
        menu.append("Print Library", "app.print_library")
        menu.append("Preferences", "app.preferences")
        menu.append("Keyboard Shortcuts", "app.show-help-overlay")
        menu.append("About Gali", "app.about")

        menu_button = Gtk.MenuButton()
        menu_button.set_icon_name("open-menu-symbolic")
        menu_button.set_menu_model(menu)
        self.append(menu_button)


    def on_filter_button_clicked(self, *data):
        self.filter_popover.popup()